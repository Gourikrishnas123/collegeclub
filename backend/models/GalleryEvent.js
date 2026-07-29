const mongoose = require('mongoose');

const GalleryEventSchema = new mongoose.Schema({
  clubId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club', 
    required: true, 
    index: true 
  },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, default: '' },
  images: [{
    url: { type: String, required: true },
    caption: { type: String, default: '' }
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryEvent', GalleryEventSchema);
