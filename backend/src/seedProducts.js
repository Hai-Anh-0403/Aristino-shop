require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const seedProducts = [
  {
    id: 1784509572378,
    title: 'Emotional Support Husband Do Not Pet Funny Monkey (On Back) T-Shirt',
    price: 15.29,
    description: 'Mô tả sản phẩm',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    ],
    color: '',
    uploadedAt: new Date('2026-07-20T01:07:34.879Z'),
    brand: 'Funny Monkey Saying Quote',
    status: 'done',
    done: true,
    theme: 'monkey',
    slug: 'emotional-support-husband-do-not-pet-funny-monkey-on-back-t-shirt',
    tagLeft: 'NEW',
    tagRight: 'POPULAR',
  },
  {
    id: 1784509572379,
    title: 'Vintage Retro Monkey Graphic Premium Cotton T-Shirt',
    price: 18.99,
    description: 'Áo thun cotton cao cấp in hình khỉ phong cách Vintage Retro độc đáo.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    ],
    color: 'Black',
    uploadedAt: new Date('2026-07-20T01:10:00.000Z'),
    brand: 'Funny Monkey Saying Quote',
    status: 'done',
    done: true,
    theme: 'monkey',
    slug: 'vintage-retro-monkey-graphic-premium-cotton-t-shirt',
    tagLeft: 'BESTSELLER',
  },
  {
    id: 1784509572380,
    title: 'Minimalist Monkey Character Unisex Casual T-Shirt',
    price: 16.50,
    description: 'Áo thun unisex thiết kế tối giản hình nhân vật khỉ ngộ nghĩnh.',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    ],
    color: 'White',
    uploadedAt: new Date('2026-07-20T01:15:00.000Z'),
    brand: 'Monkey Collection',
    status: 'done',
    done: true,
    theme: 'monkey',
    slug: 'minimalist-monkey-character-unisex-casual-t-shirt',
  },
  {
    id: 1784509572381,
    title: 'Aristino Premium Cotton Dress Shirt',
    price: 45.00,
    description: 'Áo sơ mi nam Aristino chất liệu 100% Cotton thoáng mát, phom dáng hiện đại.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
    ],
    color: 'Navy',
    uploadedAt: new Date('2026-07-20T01:20:00.000Z'),
    brand: 'Aristino',
    status: 'done',
    done: true,
    theme: 'shirt',
    slug: 'aristino-premium-cotton-dress-shirt',
    tagLeft: 'PREMIUM',
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Clearing existing products in database "shirts_collection"...');
    await Product.deleteMany({});

    console.log('Inserting seed products...');
    const created = await Product.insertMany(seedProducts);

    console.log(`✅ Successfully seeded ${created.length} products into "shirts_collection" -> "products" collection!`);
    console.log('Sample product:', created[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedDB();
