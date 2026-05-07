const app = require('../server/server.js');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Vercel: MongoDB Connected");
    } catch (error) {
      console.error("❌ Vercel: MongoDB Connection Error:", error);
    }
  }
  return app(req, res);
};
