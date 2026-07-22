const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const upload = require('../middleware/uploadMiddleware');

// GET /api/sliders — Lấy sliders đang active (public)
router.get('/', sliderController.getSliders);

// GET /api/sliders/all — Lấy tất cả sliders (admin)
router.get('/all', sliderController.getAllSliders);

// POST /api/sliders/upload — Upload ảnh từ máy tính
router.post('/upload', upload.array('images', 10), sliderController.uploadSlider);

// PUT /api/sliders/reorder — Sắp xếp thứ tự
router.put('/reorder', sliderController.reorderSliders);

// DELETE /api/sliders/:id — Xóa slider
router.delete('/:id', sliderController.deleteSlider);

module.exports = router;
