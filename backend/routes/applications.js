const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

// @route   POST /api/applications
// @desc    Volunteer applies to a campaign
// @access  Private (Volunteer only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Volunteer') {
      return res.status(403).json({ msg: 'Only volunteers can apply to campaigns' });
    }

    const { campaignId } = req.body;

    const campaign = await Campaign.findById(campaignId).populate('ngoId', 'name');
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    // Check if already applied
    const existing = await Application.findOne({ campaignId, volunteerId: req.user.id });
    if (existing) {
      return res.status(400).json({ msg: 'You have already applied to this campaign!' });
    }

    const application = new Application({
      campaignId,
      volunteerId: req.user.id,
      status: 'Pending',
    });

    await application.save();

    res.json({
      id: application._id,
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      ngo: campaign.ngoId?.name || 'Unknown NGO',
      volunteerName: user.name,
      email: user.email,
      status: application.status,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/applications/my
// @desc    Get current volunteer's applications
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const applications = await Application.find({ volunteerId: req.user.id })
      .populate({
        path: 'campaignId',
        populate: { path: 'ngoId', select: 'name' }
      })
      .sort({ createdAt: -1 });

    const formatted = applications.map(app => ({
      id: app._id,
      campaignId: app.campaignId?._id,
      campaignTitle: app.campaignId?.title || 'Deleted Campaign',
      ngo: app.campaignId?.ngoId?.name || 'Unknown NGO',
      volunteerName: '', // Will be filled by frontend from context
      email: '',
      status: app.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/applications/campaign/:campaignId
// @desc    Get all applications for a specific campaign (for NGO management)
// @access  Private (NGO who owns the campaign)
router.get('/campaign/:campaignId', auth, async (req, res) => {
  try {
    // Verify the campaign belongs to this NGO
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    if (campaign.ngoId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ campaignId: req.params.campaignId })
      .populate('volunteerId', 'name email')
      .sort({ createdAt: -1 });

    const formatted = applications.map(app => ({
      id: app._id,
      campaignId: app.campaignId,
      campaignTitle: campaign.title,
      ngo: '',
      volunteerName: app.volunteerId?.name || 'Unknown',
      email: app.volunteerId?.email || '',
      status: app.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Approve/Reject)
// @access  Private (NGO who owns the campaign)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Verify the campaign belongs to this NGO
    const campaign = await Campaign.findById(application.campaignId);
    if (!campaign || campaign.ngoId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status. Use Approved or Rejected.' });
    }

    application.status = status;
    await application.save();

    res.json({ msg: `Application ${status.toLowerCase()}`, application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/applications/count/:campaignId
// @desc    Get application counts for a campaign
// @access  Public
router.get('/count/:campaignId', async (req, res) => {
  try {
    const total = await Application.countDocuments({ campaignId: req.params.campaignId });
    const approved = await Application.countDocuments({ campaignId: req.params.campaignId, status: 'Approved' });

    res.json({ total, approved });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
