const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbacks, deleteFeedback } = require('../controllers/feedbackController');
const createRateLimiter = require('../middleware/rateLimitMiddleware');

const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 3, // Limit to 3 contact requests per 15 mins
  message: 'Bạn đã gửi tin nhắn quá nhiều lần. Vui lòng thử lại sau 15 phút.',
});

router.route('/')
  .post(contactLimiter, submitFeedback)
  .get(getFeedbacks);

router.route('/:id')
  .delete(deleteFeedback);

module.exports = router;
