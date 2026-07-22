require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-web';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB:', mongoUri);

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@aristino.com' });

    if (existingAdmin) {
      existingAdmin.password = 'admin1234';
      await existingAdmin.save();
      console.log('🔄 Password for admin@aristino.com updated to admin1234!');
    } else {
      const newAdmin = await User.create({
        email: 'admin@aristino.com',
        password: 'admin1234', // Will be automatically hashed by pre('save') hook in User model
        name: 'System Admin',
        role: 'superadmin',
        is_active: true,
      });
      console.log('🎉 Default admin user created successfully!');
      console.log('   Email: admin@aristino.com');
      console.log('   Password: admin1234');
      console.log('   Role: superadmin');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
