const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: "Investor", required: true },
  transactionType: { type: String, enum: ["buy", "sell"], required: true },
  shareCount: { type: Number, required: true },
  pricePerShare: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
