const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  volunteersRequired: { type: Number, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
