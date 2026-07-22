const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// GET /api/settings/:key — Lấy cấu hình theo key
router.get('/:key', settingController.getSetting);

// POST /api/settings/:key — Cập nhật cấu hình theo key (hoặc tạo mới nếu chưa có)
router.post('/:key', settingController.updateSetting);

module.exports = router;
