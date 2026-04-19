const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['NGO', 'Volunteer', 'Donor', 'Admin'], required: true },
  isApproved: { type: Boolean, default: false }, // Useful for NGOs awaiting Admin approval
  regId: { type: String }, // Specific to NGOs
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
