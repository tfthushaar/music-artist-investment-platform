const express = require('express');
const Artist = require('../models/Artist');
const router = express.Router();

// Add Artist Profile
router.post('/add', async (req, res) => {
  const { user, genre, returnPercentage, sharePrice, totalShares } = req.body;
  try {
    const artist = new Artist({ user, genre, returnPercentage, sharePrice, totalShares });
    await artist.save();
    res.status(201).json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
