const Order = require('../models/Order');

/**
 * @desc    Lấy tất cả đơn hàng (Hỗ trợ phân trang, tìm kiếm & lọc trạng thái)
 * @route   GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { orderNumber: regex },
        { customerName: regex },
        { customerEmail: regex },
        { phone: regex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Single aggregation query using $facet to combine listing, pagination, counts, and financial metrics
    const aggregateResult = await Order.aggregate([
      {
        $facet: {
          orders: [
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNum }
          ],
          totalCount: [
            { $match: filter },
            { $count: 'count' }
          ],
          revenue: [
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
          ],
          statusCounts: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          totalOrdersCount: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    const facet = aggregateResult[0] || {};
    const orders = facet.orders || [];
    const totalOrders = facet.totalCount?.[0]?.count || 0;
    const totalRevenue = facet.revenue?.[0]?.total || 0;
    const totalOrdersCount = facet.totalOrdersCount?.[0]?.count || 0;

    const statusCountsMap = {};
    (facet.statusCounts || []).forEach(item => {
      statusCountsMap[item._id] = item.count;
    });

    const processingCount = statusCountsMap['Processing'] || 0;
    const completedCount = statusCountsMap['Completed'] || 0;

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalOrders / limitNum) || 1,
        totalOrders,
      },
      metrics: {
        totalOrdersCount,
        totalRevenue,
        processingCount,
        completedCount,
      },
    });
  } catch (error) {
    console.error('getOrders error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    });
  }
};

/**
 * @desc    Lấy chi tiết đơn hàng theo ID hoặc OrderNumber
 * @route   GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('getOrderById error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order detail',
    });
  }
};

/**
 * @desc    Tạo đơn hàng mới (Từ Checkout)
 * @route   POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      phone,
      shippingAddress,
      paymentMethod,
      items,
      subtotal,
      shippingFee,
      notes,
    } = req.body;

    if (!customerEmail || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order details',
      });
    }

    const count = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${(count + 1).toString().padStart(3, '0')}`;

    const numSubtotal = Number(subtotal) || 0;
    const numShippingFee = Number(shippingFee) || 0;
    const totalAmount = numSubtotal + numShippingFee;

    const newOrder = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      phone: phone || '',
      shippingAddress: shippingAddress || '',
      paymentMethod: paymentMethod || 'COD',
      items,
      subtotal: numSubtotal,
      shippingFee: numShippingFee,
      totalAmount,
      status: 'Processing',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('createOrder error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
    });
  }
};

/**
 * @desc    Cập nhật trạng thái đơn hàng (Dành cho Admin)
 * @route   PUT /api/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Processing', 'Confirmed', 'Shipping', 'Completed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error('updateOrderStatus error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
    });
  }
};

/**
 * @desc    Xóa đơn hàng (Admin)
 * @route   DELETE /api/orders/:id
 */
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('deleteOrder error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting order',
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
