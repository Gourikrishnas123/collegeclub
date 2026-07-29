const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  clubId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club', 
    required: true, 
    index: true 
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tag: { 
    type: String, 
    enum: ['Urgent', 'Events', 'Finance', 'General'], 
    required: true 
  },
  pinned: { type: Boolean, default: false },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);
