const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

// @route   GET /api/campaigns
// @desc    Get all active campaigns (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'Active' })
      .populate('ngoId', 'name email')
      .sort({ createdAt: -1 });

    const formatted = campaigns.map(c => ({
      id: c._id,
      title: c.title,
      ngo: c.ngoId?.name || 'Unknown NGO',
      ngoId: c.ngoId?._id,
      date: c.date,
      location: c.location,
      volReq: String(c.volunteersRequired),
      description: c.description,
      photo: c.photo || '',
      status: c.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/campaigns/my
// @desc    Get campaigns created by the current NGO user
// @access  Private (NGO only)
router.get('/my', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ ngoId: req.user.id })
      .populate('ngoId', 'name email')
      .sort({ createdAt: -1 });

    const formatted = campaigns.map(c => ({
      id: c._id,
      title: c.title,
      ngo: c.ngoId?.name || 'Unknown NGO',
      ngoId: c.ngoId?._id,
      date: c.date,
      location: c.location,
      volReq: String(c.volunteersRequired),
      description: c.description,
      photo: c.photo || '',
      status: c.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private (NGO only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'NGO') {
      return res.status(403).json({ msg: 'Only NGOs can create campaigns' });
    }

    const { title, date, location, volunteersRequired, description, photo } = req.body;

    const campaign = new Campaign({
      title,
      ngoId: req.user.id,
      date,
      location,
      volunteersRequired: parseInt(volunteersRequired) || 0,
      description,
      photo: photo || '',
      status: 'Active',
    });

    await campaign.save();

    // Return in the same shape the frontend expects
    res.json({
      id: campaign._id,
      title: campaign.title,
      ngo: user.name,
      ngoId: user._id,
      date: campaign.date,
      location: campaign.location,
      volReq: String(campaign.volunteersRequired),
      description: campaign.description,
      photo: campaign.photo,
      status: campaign.status,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign (owner NGO only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    if (campaign.ngoId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, date, location, volunteersRequired, description, photo, status } = req.body;

    if (title) campaign.title = title;
    if (date) campaign.date = date;
    if (location) campaign.location = location;
    if (volunteersRequired) campaign.volunteersRequired = parseInt(volunteersRequired);
    if (description) campaign.description = description;
    if (photo !== undefined) campaign.photo = photo;
    if (status) campaign.status = status;

    await campaign.save();
    res.json({ msg: 'Campaign updated', campaign });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign (owner NGO only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    if (campaign.ngoId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Campaign deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
