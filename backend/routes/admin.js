const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Application = require('../models/Application');

// Middleware to check if the user is an Admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
  next();
}

// @route   GET /api/admin/pending-ngos
// @desc    Get all NGOs pending approval
// @access  Private (Admin only)
router.get('/pending-ngos', auth, isAdmin, async (req, res) => {
  try {
    const pendingNGOs = await User.find({ role: 'NGO', isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });

    const formatted = pendingNGOs.map(ngo => ({
      id: ngo._id,
      name: ngo.name,
      email: ngo.email,
      regId: ngo.regId || 'N/A',
      date: ngo.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      focus: 'General', // Not stored in model, placeholder
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/approve-ngo/:id
// @desc    Approve an NGO registration
// @access  Private (Admin only)
router.put('/approve-ngo/:id', auth, isAdmin, async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);
    if (!ngo || ngo.role !== 'NGO') {
      return res.status(404).json({ msg: 'NGO not found' });
    }

    ngo.isApproved = true;
    await ngo.save();

    res.json({ msg: `${ngo.name} has been officially approved!` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/reject-ngo/:id
// @desc    Reject and delete an NGO registration
// @access  Private (Admin only)
router.put('/reject-ngo/:id', auth, isAdmin, async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);
    if (!ngo || ngo.role !== 'NGO') {
      return res.status(404).json({ msg: 'NGO not found' });
    }

    const name = ngo.name;
    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: `${name} registration rejected and removed.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/users
// @desc    Get all users on the platform
// @access  Private (Admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const formatted = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      joined: u.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: u.isApproved === false && u.role === 'NGO' ? 'Pending' : 'Active',
      isBanned: u.isApproved === false && u.role !== 'NGO',
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/ban-user/:id
// @desc    Ban a user (set isApproved to false)
// @access  Private (Admin only)
router.put('/ban-user/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Don't allow banning admins
    if (user.role === 'Admin') {
      return res.status(403).json({ msg: 'Cannot ban an admin' });
    }

    user.isApproved = false;
    await user.save();

    res.json({ msg: `User ${user.name} has been banned from the platform.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform-wide statistics
// @access  Private (Admin only)
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const approvedNGOs = await User.countDocuments({ role: 'NGO', isApproved: true });
    const totalUsers = await User.countDocuments();
    const pendingNGOs = await User.countDocuments({ role: 'NGO', isApproved: false });
    const totalCampaigns = await Campaign.countDocuments();
    const totalDonations = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      approvedNGOs,
      totalUsers,
      pendingNGOs,
      totalCampaigns,
      totalDonationAmount: totalDonations[0]?.total || 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/ngos
// @desc    Get all approved NGOs (for donor listing)
// @access  Private
router.get('/ngos', auth, async (req, res) => {
  try {
    const ngos = await User.find({ role: 'NGO', isApproved: true })
      .select('name email regId')
      .sort({ name: 1 });

    const formatted = ngos.map(n => ({
      id: n._id,
      name: n.name,
      email: n.email,
      regId: n.regId,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
