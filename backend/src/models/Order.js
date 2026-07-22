const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  productId: { type: mongoose.Schema.Types.Mixed },
  name: { type: String },
  title: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  color: { type: String },
  selectedColor: { type: String },
  size: { type: String },
  selectedSize: { type: String },
  imageUrl: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    phone: { type: String },
    shippingAddress: { type: String },
    paymentMethod: { type: String, default: 'COD' },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipping', 'Completed', 'Cancelled'],
      default: 'Processing',
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
