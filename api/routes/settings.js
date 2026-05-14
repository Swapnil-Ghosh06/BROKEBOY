const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const connectDB = require('../db');
const { protect } = require('../middleware/authMiddleware');

const checkConnection = async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    // logged in connectDB
  }
  next();
};

router.use(checkConnection);
router.use(protect);

// GET /api/settings — fetch user's settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = await Settings.create({ userId: req.user.id, initialBalance: 0, monthlyLimit: 0 });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/settings — update user's settings
router.post('/', async (req, res) => {
  try {
    const { initialBalance, monthlyLimit } = req.body;
    let settings = await Settings.findOne({ userId: req.user.id });

    if (settings) {
      settings.initialBalance = initialBalance ?? settings.initialBalance;
      settings.monthlyLimit = monthlyLimit ?? settings.monthlyLimit;
      await settings.save();
    } else {
      settings = await Settings.create({ userId: req.user.id, initialBalance, monthlyLimit });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
