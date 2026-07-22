const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

/**
 * Protect Middleware
 * Verifies JWT Access Token and checks Database Session validity.
 * Ensures force-logged-out (revoked) sessions are immediately denied access.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract Bearer token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực: Không tìm thấy Access Token',
      });
    }

    // 2. Decode and verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Access Token đã hết hạn',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Access Token không hợp lệ',
      });
    }

    const { userId, sessionId } = decoded;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ: Thiếu session_id',
      });
    }

    // 3. Query DB to check if the session is still valid and active
    const session = await UserSession.findOne({ session_id: sessionId });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Phiên làm việc không tồn tại hoặc đã bị hủy',
      });
    }

    if (!session.is_valid) {
      return res.status(401).json({
        success: false,
        code: 'SESSION_REVOKED',
        message: 'Phiên làm việc đã bị ép đăng xuất bởi Admin hoặc hệ thống',
      });
    }

    if (new Date() > new Date(session.expires_at)) {
      return res.status(401).json({
        success: false,
        code: 'SESSION_EXPIRED',
        message: 'Phiên làm việc đã hết hạn trong cơ sở dữ liệu',
      });
    }

    // 4. Verify user exists and is active
    const user = await User.findById(userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị khóa',
      });
    }

    // 5. Attach user and session context to request
    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi xác thực phiên làm việc',
    });
  }
};

/**
 * Require SuperAdmin Middleware
 * Restricts access to endpoints requiring SuperAdmin rights.
 */
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Quyền truy cập bị từ chối: Yêu cầu quyền SuperAdmin',
    });
  }
  next();
};

module.exports = {
  protect,
  requireSuperAdmin,
};
