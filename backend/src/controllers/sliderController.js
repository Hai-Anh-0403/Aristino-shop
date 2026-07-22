const Slider = require('../models/Slider');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Get active sliders list
 * @route   GET /api/sliders
 */
const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({ order: 1 });

    res.json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error('getSliders error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sliders',
    });
  }
};

/**
 * @desc    Get all sliders (including inactive, for admin)
 * @route   GET /api/sliders/all
 */
const getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 });

    res.json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error('getAllSliders error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching all sliders',
    });
  }
};

/**
 * @desc    Upload multiple images from computer
 * @route   POST /api/sliders/upload
 */
const uploadSlider = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
    }

    // Get current max order
    const maxOrderDoc = await Slider.findOne().sort({ order: -1 });
    let nextOrder = maxOrderDoc ? maxOrderDoc.order + 1 : 0;

    const createdSliders = [];
    for (const file of req.files) {
      const slider = await Slider.create({
        imageUrl: `/uploads/sliders/${file.filename}`,
        originalName: file.originalname,
        order: nextOrder++,
        isActive: true,
      });
      createdSliders.push(slider);
    }

    res.status(201).json({
      success: true,
      data: createdSliders,
      message: 'Images uploaded successfully',
    });
  } catch (error) {
    console.error('uploadSlider error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading images',
    });
  }
};

/**
 * @desc    Delete slider
 * @route   DELETE /api/sliders/:id
 */
const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found',
      });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '..', '..', slider.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Slider.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
      message: 'Slider deleted successfully',
    });
  } catch (error) {
    console.error('deleteSlider error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting slider',
    });
  }
};

/**
 * @desc    Update slider order
 * @route   PUT /api/sliders/reorder
 * @body    { sliders: [{id, order}] }
 */
const reorderSliders = async (req, res) => {
  try {
    const { sliders } = req.body;

    if (!sliders || !Array.isArray(sliders)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
      });
    }

    const bulkOps = sliders.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    await Slider.bulkWrite(bulkOps);

    const updated = await Slider.find().sort({ order: 1 });

    res.json({
      success: true,
      data: updated,
      message: 'Slider order updated',
    });
  } catch (error) {
    console.error('reorderSliders error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while reordering sliders',
    });
  }
};

module.exports = {
  getSliders,
  getAllSliders,
  uploadSlider,
  reorderSliders,
  deleteSlider,
};
