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

// MongoDB Connection Event Listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Cluster');
  global.lastDbError = null;
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Mongoose connection error: ${err.message}`);
  global.lastDbError = err.message;
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected from MongoDB');
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("🔍 Attempting to connect to MongoDB...");
    console.log(`📡 URI found: ${process.env.MONGO_URI ? 'YES' : 'NO'}`);
    
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<username>') || process.env.MONGO_URI.includes('<password>')) {
      global.lastDbError = "MONGO_URI is missing or contains placeholders.";
      console.warn("⚠️  MONGO_URI is not defined or is still a placeholder.");
      return;
    }
    
    // Set connection options for better stability in 2026
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    global.lastDbError = null;
  } catch (error) {
    global.lastDbError = error.message;
    console.error(`❌ Initial connection error: ${error.message}`);
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
