const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "Share" }],
});

module.exports = mongoose.model('Investor', InvestorSchema);
