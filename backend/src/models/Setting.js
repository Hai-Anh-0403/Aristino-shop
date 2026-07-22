const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Value is required'],
    },
  },
  {
    timestamps: true,
  }
);

settingSchema.index({ key: 1 });

module.exports = mongoose.model('Setting', settingSchema);
