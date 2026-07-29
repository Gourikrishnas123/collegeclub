const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'club_admin', 'member'], 
    required: true 
  },
  clubId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club', 
    default: null 
  },
  year: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);