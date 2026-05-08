const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const connectDB = require('../db');

// Middleware to check DB connection status
const checkConnection = async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    // Error logged in connectDB
  }
  next();
};

router.use(checkConnection);

// GET /api/settings - Fetch budget settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if they don't exist
      settings = await Settings.create({ initialBalance: 0, monthlyLimit: 0 });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/settings - Update budget settings
router.post('/', async (req, res) => {
  try {
    const { initialBalance, monthlyLimit } = req.body;
    let settings = await Settings.findOne();
    
    if (settings) {
      settings.initialBalance = initialBalance ?? settings.initialBalance;
      settings.monthlyLimit = monthlyLimit ?? settings.monthlyLimit;
      await settings.save();
    } else {
      settings = await Settings.create({ initialBalance, monthlyLimit });
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
