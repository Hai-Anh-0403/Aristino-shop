const express = require('express');
const router = express.Router();
const {
  login,
  refreshToken,
  logout,
  listSessions,
  revokeSession,
  getMe,
  googleLogin,
} = require('../controllers/authController');
const { protect, requireSuperAdmin } = require('../middleware/authMiddleware');
const createRateLimiter = require('../middleware/rateLimitMiddleware');

const validate = require('../middleware/validate');
const { loginSchema } = require('../middleware/schemas');

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
});

/**
 * Public Authentication Endpoints
 */
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/google', googleLogin);


/**
 * Protected Authentication & Session Management Endpoints
 */
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.get('/sessions', protect, listSessions);
router.delete('/sessions/:sessionId', protect, revokeSession);

module.exports = router;
