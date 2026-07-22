const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const validate = require('../middleware/validate');
const { createOrderSchema, updateOrderStatusSchema } = require('../middleware/schemas');

// Public checkout order creation
router.post('/', validate(createOrderSchema), createOrder);

// Protected Admin order management routes
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, validate(updateOrderStatusSchema), updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
