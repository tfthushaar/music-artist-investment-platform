const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: "Investor", required: true },
  purchasePrice: { type: Number, required: true },
  currentValue: { type: Number },
});

module.exports = mongoose.model('Share', ShareSchema);
