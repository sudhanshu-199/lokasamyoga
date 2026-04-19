const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['upi', 'card', 'netbanking'], required: true },
  status: { type: String, default: 'Completed' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
