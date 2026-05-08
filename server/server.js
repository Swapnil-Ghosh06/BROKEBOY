const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expenses = require('./routes/expenses');
const settings = require('./routes/settings');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/expenses', expenses);
app.use('/api/settings', settings);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    dbConnected: mongoose.connection.readyState === 1,
    dbState: mongoose.connection.readyState,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// In-memory store fallback for when MongoDB is not connected
global.mockExpenses = [];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
      console.warn("⚠️  MONGO_URI is missing or contains placeholders. Switching to IN-MEMORY MOCK MODE.");
      return;
    }

    console.log("🔍 Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
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

