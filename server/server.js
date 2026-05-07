require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expenses = require('./routes/expenses');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/expenses', expenses);

// Debug route
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const uri = process.env.MONGO_URI;
  res.json({
    mongoUriSet: !!uri,
    mongoUriPreview: uri ? `${uri.slice(0, 30)}...` : 'NOT SET',
    dbState: mongoose.connection.readyState,
    dbError: global.lastDbError || null,
  });
});

// In-memory store fallback for when MongoDB is not connected
global.mockExpenses = [];

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<username>')) {
      console.warn("⚠️  MONGO_URI is not defined or is still a placeholder. Switching to IN-MEMORY MOCK MODE.");
      console.info("💡 Tip: Add a valid MONGO_URI to server/.env to persist data.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    global.lastDbError = null;
  } catch (error) {
    global.lastDbError = error.message;
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // Add a helpful hint for common connection issues
    if (error.message.includes('IP') || error.message.includes('connect')) {
      console.info("💡 Hint: This usually means your current IP address is not whitelisted in MongoDB Atlas.");
      console.info("👉 To fix: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Add Current IP Address (or 0.0.0.0/0).");
    }
    
    console.warn("⚠️  Falling back to IN-MEMORY MOCK MODE due to connection error.");
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
