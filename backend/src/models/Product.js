const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.Mixed,
      default: () => Date.now(),
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    price: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Price is required'],
    },
    description: {
      type: String,
      default: 'Mô tả sản phẩm',
    },
    images: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: '',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    brand: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'done',
    },
    done: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discount: {
      type: String,
      default: null,
    },
    tagLeft: {
      type: String,
      default: null,
    },
    tagRight: {
      type: String,
      default: null,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    isLookbook: {
      type: Boolean,
      default: false,
    },
    lookbookLabel: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'products',
  }
);

// Virtual getter for main image URL (first image in images array or empty string)
productSchema.virtual('imageUrl').get(function () {
  if (this.images && this.images.length > 0) {
    return this.images[0];
  }
  return '';
});

// Virtual getter for colors array (returns array containing color if set)
productSchema.virtual('colors').get(function () {
  if (this.color) {
    return [this.color];
  }
  return [];
});

// Pre-save hook: auto-generate slug if not provided
productSchema.pre('save', function (next) {
  if (!this.slug) {
    if (this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    } else {
      this.slug = `product-${this.id || this._id}`;
    }
  }
  next();
});

// Indexes for fast searching
productSchema.index({ brand: 1 });
productSchema.index({ theme: 1 });
productSchema.index({ title: 'text', description: 'text' });

const { getShirtsDb } = require('../config/db');

module.exports = getShirtsDb().model('Product', productSchema, 'products');
