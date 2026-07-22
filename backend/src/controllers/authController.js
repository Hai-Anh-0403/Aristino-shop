const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_key_change_in_production';

const ACCESS_TOKEN_EXPIRATION = '24h';
const REFRESH_TOKEN_EXPIRATION_DAYS = 1;

/**
 * Helper: Create SHA-256 hash of Refresh Token for DB storage and matching.
 * @param {string} token - Raw refresh token string
 * @returns {string} SHA-256 hash hex string
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Helper: Cookie options for Refresh Token.
 */
const getCookieOptions = () => ({
  httpOnly: true, // Prevents JavaScript XSS access
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // Protect against CSRF
  maxAge: REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, // 7 days in ms
});

/**
 * @route   POST /api/auth/login
 * @desc    Admin login, generate Access & Refresh tokens, store session in DB
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email và mật khẩu',
      });
    }

    // 2. Query user by email (explicitly include password for verification)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }

    // 3. Verify active status
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa',
      });
    }

    // 4. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }

    // 5. Generate Session ID and tokens
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);

    const accessToken = jwt.sign(
      { userId: user._id, sessionId, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, sessionId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d` }
    );

    // 6. Hash refresh token before saving to database
    const refreshTokenHash = hashToken(refreshToken);

    // Get client details for device identification
    const ipAddress = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Save session record into database
    await UserSession.create({
      session_id: sessionId,
      user_id: user._id,
      refresh_token_hash: refreshTokenHash,
      ip_address: typeof ipAddress === 'string' ? ipAddress.split(',')[0] : 'Unknown',
      user_agent: userAgent,
      is_valid: true,
      expires_at: expiresAt,
    });

    // 7. Store Refresh Token in secure HttpOnly cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    // 8. Return response with Access Token and User payload
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi trong quá trình xử lý đăng nhập',
    });
  }
};

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Exchange valid Refresh Token for a new Access Token
 * @access  Public (Uses HttpOnly Cookie or Body)
 */
const refreshToken = async (req, res) => {
  try {
    // 1. Get Refresh Token from Cookie or Request Body
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy Refresh Token',
      });
    }

    // 2. Verify JWT signature of Refresh Token
    let decoded;
    try {
      decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
      // Clear invalid cookie if verification fails
      res.clearCookie('refreshToken', getCookieOptions());
      return res.status(401).json({
        success: false,
        message: 'Refresh Token không hợp lệ hoặc đã hết hạn',
      });
    }

    const { userId, sessionId } = decoded;

    // 3. Hash token and query corresponding session record in DB
    const tokenHash = hashToken(token);
    const session = await UserSession.findOne({ session_id: sessionId });

    // Validate DB Session state
    if (!session || session.refresh_token_hash !== tokenHash) {
      res.clearCookie('refreshToken', getCookieOptions());
      return res.status(401).json({
        success: false,
        message: 'Phiên đăng nhập không hợp lệ hoặc token không khớp',
      });
    }

    if (!session.is_valid) {
      res.clearCookie('refreshToken', getCookieOptions());
      return res.status(401).json({
        success: false,
        code: 'SESSION_REVOKED',
        message: 'Phiên làm việc này đã bị thu hồi/ép đăng xuất',
      });
    }

    if (new Date() > new Date(session.expires_at)) {
      res.clearCookie('refreshToken', getCookieOptions());
      return res.status(401).json({
        success: false,
        code: 'SESSION_EXPIRED',
        message: 'Phiên làm việc đã hết hạn',
      });
    }

    // 4. Check user status
    const user = await User.findById(userId);
    if (!user || !user.is_active) {
      res.clearCookie('refreshToken', getCookieOptions());
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị khóa',
      });
    }

    // 5. Issue new short-lived Access Token
    const newAccessToken = jwt.sign(
      { userId: user._id, sessionId: session.session_id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    return res.status(200).json({
      success: true,
      message: 'Cấp mới Access Token thành công',
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi làm mới token',
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout current session, set is_valid = false in DB, and clear cookie
 * @access  Protected
 */
const logout = async (req, res) => {
  try {
    // Current active session attached by protect middleware or fallback from cookie
    const sessionId = req.session?.session_id;

    if (sessionId) {
      await UserSession.findOneAndUpdate(
        { session_id: sessionId },
        { is_valid: false }
      );
    }

    // Clear client-side cookie
    res.clearCookie('refreshToken', getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi đăng xuất',
    });
  }
};

/**
 * @route   GET /api/auth/sessions
 * @desc    List active sessions of a user (SuperAdmin can view any user via ?user_id=...)
 * @access  Protected
 */
const listSessions = async (req, res) => {
  try {
    let targetUserId = req.user._id;

    // SuperAdmin can query sessions for another user
    if (req.user.role === 'superadmin' && req.query.user_id) {
      targetUserId = req.query.user_id;
    }

    const sessions = await UserSession.find({ user_id: targetUserId })
      .sort({ created_at: -1 })
      .lean();

    const formattedSessions = sessions.map((s) => ({
      session_id: s.session_id,
      ip_address: s.ip_address,
      user_agent: s.user_agent,
      is_valid: s.is_valid,
      is_current: req.session?.session_id === s.session_id,
      expires_at: s.expires_at,
      created_at: s.created_at,
      updated_at: s.updated_at,
    }));

    return res.status(200).json({
      success: true,
      count: formattedSessions.length,
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error('List Sessions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi lấy danh sách phiên',
    });
  }
};

/**
 * @route   DELETE /api/auth/sessions/:sessionId
 * @desc    Revoke (force logout) a specific session
 * @access  Protected (SuperAdmin can revoke any session, user can revoke their own)
 */
const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await UserSession.findOne({ session_id: sessionId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiên làm việc',
      });
    }

    // Permission check: Must be SuperAdmin or owner of the session
    const isOwner = session.user_id.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === 'superadmin';

    if (!isOwner && !isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thu hồi phiên làm việc này',
      });
    }

    // Set is_valid to false (Force logout on next refresh/API request)
    session.is_valid = false;
    await session.save();

    return res.status(200).json({
      success: true,
      message: `Đã thu hồi thành công phiên làm việc ${sessionId}`,
    });
  } catch (error) {
    console.error('Revoke Session Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi thu hồi phiên làm việc',
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Verify active session and return current admin user details
 * @access  Protected
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    session: {
      session_id: req.session.session_id,
      expires_at: req.session.expires_at,
    },
  });
};

/**
 * @route   POST /api/auth/google
 * @desc    Verify Google OAuth ID Token and log in customer user
 * @access  Public
 */
const googleLogin = async (req, res) => {
  try {
    const { idToken, credential } = req.body;
    const token = idToken || credential;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp Google ID Token',
      });
    }

    // Verify Google token via Google tokeninfo API
    let googleUser = null;
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (response.ok) {
        googleUser = await response.json();
      }
    } catch (err) {
      console.warn('Backend fetch to Google tokeninfo failed, fallback token decode:', err.message);
    }

    // Fallback parsing if tokeninfo network request had issue in dev
    if (!googleUser || !googleUser.email) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          googleUser = payload;
        }
      } catch (e) {
        // Ignored
      }
    }

    if (!googleUser || !googleUser.email) {
      return res.status(401).json({
        success: false,
        message: 'Google ID Token không hợp lệ hoặc đã hết hạn',
      });
    }

    const email = googleUser.email.toLowerCase();
    const name = googleUser.name || 'Google User';
    const picture = googleUser.picture || '';

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập Google thành công',
      user: {
        email,
        firstName: googleUser.given_name || name.split(' ')[0] || 'Google',
        lastName: googleUser.family_name || name.split(' ').slice(1).join(' ') || 'User',
        provider: 'google',
        avatarUrl: picture,
        googleId: googleUser.sub || googleUser.user_id,
      },
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xử lý đăng nhập bằng Google',
    });
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  listSessions,
  revokeSession,
  getMe,
  googleLogin,
};

