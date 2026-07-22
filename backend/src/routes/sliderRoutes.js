const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// GET /api/sliders — Get active sliders (public)
router.get('/', sliderController.getSliders);

// Protected Admin Routes:
// GET /api/sliders/all — Get all sliders (admin)
router.get('/all', protect, sliderController.getAllSliders);

// POST /api/sliders/upload — Upload images from computer
router.post('/upload', protect, upload.array('images', 10), sliderController.uploadSlider);

// PUT /api/sliders/reorder — Reorder sliders
router.put('/reorder', protect, sliderController.reorderSliders);

// DELETE /api/sliders/:id — Delete slider
router.delete('/:id', protect, sliderController.deleteSlider);

module.exports = router;
