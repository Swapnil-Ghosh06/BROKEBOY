const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
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
