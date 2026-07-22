const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbacks, deleteFeedback } = require('../controllers/feedbackController');
const createRateLimiter = require('../middleware/rateLimitMiddleware');
const { protect } = require('../middleware/authMiddleware');

const validate = require('../middleware/validate');
const { createFeedbackSchema } = require('../middleware/schemas');

const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 3, // Limit to 3 contact requests per 15 mins
  message: 'Too many contact requests from this IP, please try again after 15 minutes.',
});

// Public contact submission
router.post('/', contactLimiter, validate(createFeedbackSchema), submitFeedback);

// Protected Admin feedback routes
router.get('/', protect, getFeedbacks);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
