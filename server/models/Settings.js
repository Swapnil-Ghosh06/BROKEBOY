const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  initialBalance: {
    type: Number,
    default: 10000
  },
  monthlyLimit: {
    type: Number,
    default: 5000
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
