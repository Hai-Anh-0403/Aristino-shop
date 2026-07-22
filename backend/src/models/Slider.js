const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    originalName: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

sliderSchema.index({ order: 1 });
sliderSchema.index({ isActive: 1 });

module.exports = mongoose.model('Slider', sliderSchema);
