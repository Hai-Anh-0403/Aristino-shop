require('dotenv').config();
const connectDB = require('./config/db');
const Order = require('./models/Order');

const SAMPLE_ORDERS = [
  {
    orderNumber: 'ORD-849102-001',
    customerEmail: 'nguyen.van.a@gmail.com',
    customerName: 'Nguyễn Văn Ánh',
    phone: '0987654321',
    shippingAddress: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'COD',
    items: [
      {
        id: 'prod-001-blue-l',
        name: 'Áo Sơ Mi Nam Tay Dài Premium Cotton',
        price: 49.99,
        quantity: 2,
        color: 'Xanh Navy',
        size: 'L',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200',
      },
      {
        id: 'prod-002-black-m',
        name: 'Quần Âu Nam Slim Fit Wool Blend',
        price: 79.50,
        quantity: 1,
        color: 'Đen Tuyền',
        size: 'M',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200',
      },
    ],
    subtotal: 179.48,
    shippingFee: 0,
    totalAmount: 179.48,
    status: 'Completed',
    notes: 'Giao giờ hành chính',
  },
  {
    orderNumber: 'ORD-849103-002',
    customerEmail: 'tran.thi.b@gmail.com',
    customerName: 'Trần Thị Bình',
    phone: '0912345678',
    shippingAddress: '456 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
    paymentMethod: 'Credit Card / Visa',
    items: [
      {
        id: 'prod-003-white-xl',
        name: 'Áo Polo Nam Luxury Silk Cotton',
        price: 39.00,
        quantity: 1,
        color: 'Trắng Tinh Khôi',
        size: 'XL',
        imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1200',
      },
    ],
    subtotal: 39.00,
    shippingFee: 5.00,
    totalAmount: 44.00,
    status: 'Shipping',
    notes: 'Gọi trước khi giao 15 phút',
  },
  {
    orderNumber: 'ORD-849104-003',
    customerEmail: 'le.hoang.c@gmail.com',
    customerName: 'Lê Hoàng Cường',
    phone: '0909112233',
    shippingAddress: '789 Đường Ngô Quyền, Quận Sơn Trà, TP. Đà Nẵng',
    paymentMethod: 'COD',
    items: [
      {
        id: 'prod-004-grey-l',
        name: 'Bộ Suit Nam Wool Premium Tailored',
        price: 299.99,
        quantity: 1,
        color: 'Ghi Xám Aristino',
        size: 'L',
        imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200',
      },
    ],
    subtotal: 299.99,
    shippingFee: 0,
    totalAmount: 299.99,
    status: 'Processing',
    notes: 'Đã xác nhận đặt hàng',
  },
  {
    orderNumber: 'ORD-849105-004',
    customerEmail: 'pham.quoc.d@gmail.com',
    customerName: 'Phạm Quốc Dũng',
    phone: '0933445566',
    shippingAddress: '12 Đường Trần Phú, Quận Hải Châu, TP. Đà Nẵng',
    paymentMethod: 'COD',
    items: [
      {
        id: 'prod-005-black-s',
        name: 'Áo Jacket Nam Thu Đông Aristino Signature',
        price: 125.00,
        quantity: 1,
        color: 'Đen Mờ',
        size: 'S',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200',
      },
    ],
    subtotal: 125.00,
    shippingFee: 0,
    totalAmount: 125.00,
    status: 'Confirmed',
    notes: '',
  },
];

const seedOrders = async () => {
  try {
    await connectDB();
    console.log('📦 Connected to Database for seeding Orders...');

    for (const sample of SAMPLE_ORDERS) {
      await Order.findOneAndUpdate(
        { orderNumber: sample.orderNumber },
        sample,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Seeded Sample Orders successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error.message);
    process.exit(1);
  }
};

seedOrders();
