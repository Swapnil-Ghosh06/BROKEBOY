const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  initialBalance: {
    type: Number,
    default: 0
  },
  monthlyLimit: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
