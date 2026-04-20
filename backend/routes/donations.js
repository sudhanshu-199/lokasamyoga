const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Donation = require('../models/Donation');
const User = require('../models/User');

// @route   POST /api/donations
// @desc    Donor makes a donation to an NGO
// @access  Private (Donor only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Donor') {
      return res.status(403).json({ msg: 'Only donors can make donations' });
    }

    const { ngoId, amount, paymentMethod } = req.body;

    // Verify the NGO exists
    const ngo = await User.findById(ngoId);
    if (!ngo || ngo.role !== 'NGO') {
      return res.status(404).json({ msg: 'NGO not found' });
    }

    const donation = new Donation({
      donorId: req.user.id,
      ngoId,
      amount: parseInt(amount),
      paymentMethod: paymentMethod || 'upi',
      status: 'Completed',
    });

    await donation.save();

    res.json({
      id: donation._id,
      ngo: ngo.name,
      ngoId: ngo._id,
      campaign: 'Direct Donation',
      amount: String(donation.amount),
      paymentMethod: donation.paymentMethod,
      status: donation.status,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/donations/my
// @desc    Get current donor's donation history
// @access  Private (Donor)
router.get('/my', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id })
      .populate('ngoId', 'name')
      .sort({ createdAt: -1 });

    const formatted = donations.map(d => ({
      id: d._id,
      ngo: d.ngoId?.name || 'Unknown NGO',
      ngoId: d.ngoId?._id,
      campaign: 'Direct Donation',
      amount: String(d.amount),
      paymentMethod: d.paymentMethod,
      status: d.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/donations/ngo
// @desc    Get donations received by the current NGO
// @access  Private (NGO)
router.get('/ngo', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ ngoId: req.user.id })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 });

    const formatted = donations.map(d => ({
      id: d._id,
      donorName: d.donorId?.name || 'Anonymous',
      amount: String(d.amount),
      paymentMethod: d.paymentMethod,
      status: d.status,
      createdAt: d.createdAt,
    }));

    const total = donations.reduce((acc, d) => acc + d.amount, 0);

    res.json({ donations: formatted, total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/donations/total
// @desc    Get total donation stats (for display)
// @access  Private
router.get('/total', auth, async (req, res) => {
  try {
    const donations = await Donation.find();
    const total = donations.reduce((acc, d) => acc + d.amount, 0);
    const count = donations.length;
    const uniqueNGOs = [...new Set(donations.map(d => d.ngoId.toString()))].length;

    res.json({ total, count, uniqueNGOs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
