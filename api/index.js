const app = require('../server/server.js');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables.");
      }
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ Vercel: MongoDB Connected");
      global.lastDbError = null;
    } catch (error) {
      console.error("❌ Vercel: MongoDB Connection Error:", error);
      global.lastDbError = error.message;
    }
  }
  return app(req, res);
};
