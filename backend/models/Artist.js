const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  genre: { type: [String], required: true },
  returnPercentage: { type: Number, required: true },
  sharePrice: { type: Number, required: true },
  totalShares: { type: Number, required: true },
  sharesSold: { type: Number, default: 0 },
  metrics: { type: Object }, 
});

module.exports = mongoose.model('Artist', ArtistSchema);
