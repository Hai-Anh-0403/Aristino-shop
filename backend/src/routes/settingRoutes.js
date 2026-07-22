const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/settings/:key — Get configuration by key (public)
router.get('/:key', settingController.getSetting);

// POST /api/settings/:key — Update configuration by key (protected admin)
router.post('/:key', protect, settingController.updateSetting);

module.exports = router;
