const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  clubId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club', 
    required: true, 
    index: true 
  },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Events', 'Equipment', 'Sponsorship', 'Dues', 'Venue', 'Supplies', 'Other'], 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['in', 'out'], 
    required: true 
  },
  amount: { type: Number, required: true },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
