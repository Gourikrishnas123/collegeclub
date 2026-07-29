const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  mark: { type: String, required: true, uppercase: true, maxlength: 4 }, // e.g. "CS", "RO", "ME"
  description: { type: String, default: '' },
  budgetTotal: { type: Number, default: 0 },
  budgetSpent: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Club', ClubSchema);