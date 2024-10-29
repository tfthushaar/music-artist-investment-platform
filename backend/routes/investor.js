const express = require('express');
const Investor = require('../models/Investor');
const Share = require('../models/Share');
const router = express.Router();

// Add Investor Profile
router.post('/add', async (req, res) => {
  const { user } = req.body;
  try {
    const investor = new Investor({ user });
    await investor.save();
    res.status(201).json(investor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buy Shares
router.post('/buy', async (req, res) => {
  const { artist, investor, shareCount, purchasePrice } = req.body;
  try {
    const share = new Share({ artist, investor, purchasePrice });
    await share.save();
    res.status(201).json(share);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
