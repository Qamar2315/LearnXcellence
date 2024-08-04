// otpModel.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const otpSchema = new schema({
  otp: Number,
  createdAt: { type: Date, default: Date.now } // Add createdAt field
});

module.exports = mongoose.model('Otp', otpSchema);