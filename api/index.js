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

const connectDB = require('./db');

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
  } catch (e) {
    // Error logged in connectDB
  }
  res.json({
    status: 'online',
    dbConnected: mongoose.connection.readyState === 1,
    dbState: mongoose.connection.readyState,
    dbError: global.lastDbError || null,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Store last DB error globally for debugging
global.lastDbError = null;

// In-memory store fallback for when MongoDB is not connected
global.mockExpenses = [];

connectDB().catch(err => console.error("Initial connect failed"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

