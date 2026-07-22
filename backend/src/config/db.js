const mongoose = require('mongoose');

let shirtsDbConnection = null;

/**
 * Connect to MongoDB using Mongoose.
 * Primary connection connects to process.env.MONGODB_URI ('shop-web' DB for login/auth/settings).
 * Shirts connection connects to process.env.SHIRTS_DB_NAME ('shirts' DB for products).
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shop-web';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected (Primary DB): ${conn.connection.host}:${conn.connection.port || ''} [DB: ${conn.connection.name}]`);

    const shirtsDbName = process.env.SHIRTS_DB_NAME || 'shirts';
    shirtsDbConnection = conn.connection.useDb(shirtsDbName, { useCache: true });
    console.log(`✅ MongoDB connected (Products DB): [DB: ${shirtsDbConnection.name}]`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

/**
 * Get the Mongoose connection bound to the shirts products database.
 */
const getShirtsDb = () => {
  if (shirtsDbConnection) {
    return shirtsDbConnection;
  }
  const shirtsDbName = process.env.SHIRTS_DB_NAME || 'shirts';
  return mongoose.connection.useDb(shirtsDbName, { useCache: true });
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.getShirtsDb = getShirtsDb;
