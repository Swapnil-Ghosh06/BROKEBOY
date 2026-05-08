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
    dbError: global.lastDbError || null,
    uriUsed: (process.env.MONGO_URI || '').replace(/\/\/(.*?):(.*?)@/, '//$1:****@'),
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Store last DB error globally for debugging
global.lastDbError = null;

// In-memory store fallback for when MongoDB is not connected
global.mockExpenses = [];

// Connect to MongoDB
const { MongoClient } = require('mongodb');
let cachedDb = null;

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
    console.log(`🔍 Raw Connecting to: ${safeUri}`);

    // First, test with native driver to bypass any Mongoose bugs
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    await client.connect();
    console.log("✅ Native Driver Connected");
    await client.close();

    // If native works, Mongoose should work
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    });

    console.log(`✅ Mongoose Connected Successfully`);
    global.lastDbError = null;
    cachedDb = conn;
    return conn;
  } catch (error) {
    global.lastDbError = `${error.name}: ${error.message}`;
    console.error(`❌ Connection Error: ${error.name} - ${error.message}`);
    cachedDb = null;
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

