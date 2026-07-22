const Feedback = require('../models/Feedback');

// @desc    Submit customer contact message/feedback
// @route   POST /api/feedbacks
// @access  Public
const submitFeedback = async (req, res) => {
  try {
    const { name, email, phone, message, userKey } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, phone, message) are required.',
      });
    }

    const newFeedback = await Feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      userKey: userKey || null,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      data: newFeedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit feedback',
    });
  }
};

// @desc    Get all submitted customer feedback
// @route   GET /api/feedbacks
// @access  Public / Admin
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
    });
  }
};

// @desc    Delete customer feedback
// @route   DELETE /api/feedbacks/:id
// @access  Public / Admin
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }
    res.json({
      success: true,
      message: 'Feedback deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
    });
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
  deleteFeedback,
};
