const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

let cachedDb = null;
global.lastDbError = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      global.lastDbError = "MONGO_URI is missing.";
      return;
    }

    const safeUri = uri.replace(/\/\/(.*?):(.*?)@/, '//$1:****@');
    console.log(`🔍 Connecting to: ${safeUri}`);

    // Native driver test
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    await client.connect();
    await client.close();

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    });

    console.log(`✅ MongoDB Connected Successfully`);
    global.lastDbError = null;
    cachedDb = conn;
    return conn;
  } catch (error) {
    global.lastDbError = `${error.name}: ${error.message}`;
    console.error(`❌ Connection Error: ${error.name} - ${error.message}`);
    cachedDb = null;
    throw error;
  }
};

module.exports = connectDB;
