const express = require('express');
const router = express.Router({ mergeParams: true });
const GalleryEvent = require('../models/GalleryEvent');
const upload = require('../middleware/upload');
const { authenticateToken, authorize, checkClubAccess } = require('../middleware/auth');

// GET /clubs/:clubId/gallery
router.get('/', authenticateToken, checkClubAccess, async (req, res) => {
  try {
    const { clubId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await GalleryEvent.countDocuments({ clubId });
    const events = await GalleryEvent.find({ clubId })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.json({
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ message: 'Error fetching gallery events.' });
  }
});

// POST /clubs/:clubId/gallery — club_admin only, multipart upload up to 20 images
router.post('/', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), upload.array('images', 20), async (req, res) => {
  try {
    const { clubId } = req.params;
    const { title, description, date, captions } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Gallery event title is required.' });
    }

    let imageList = [];
    if (req.files && req.files.length > 0) {
      const parsedCaptions = Array.isArray(captions) ? captions : (captions ? [captions] : []);
      imageList = req.files.map((file, idx) => ({
        url: `/uploads/${file.filename}`,
        caption: parsedCaptions[idx] || ''
      }));
    } else if (req.body.imageUrl) {
      // Fallback for image URL if provided as JSON
      imageList.push({
        url: req.body.imageUrl,
        caption: req.body.caption || ''
      });
    }

    const event = new GalleryEvent({
      clubId,
      title,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      images: imageList,
      createdBy: req.user.id
    });

    await event.save();
    await event.populate('createdBy', 'name email');

    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating gallery event:', err);
    res.status(500).json({ message: 'Error creating gallery event.' });
  }
});

// DELETE /clubs/:clubId/gallery/:eventId — club_admin only
router.delete('/:eventId', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId, eventId } = req.params;
    const event = await GalleryEvent.findOneAndDelete({ _id: eventId, clubId });

    if (!event) {
      return res.status(404).json({ message: 'Gallery event not found.' });
    }

    res.json({ message: 'Gallery event deleted successfully.' });
  } catch (err) {
    console.error('Error deleting gallery event:', err);
    res.status(500).json({ message: 'Error deleting gallery event.' });
  }
});

module.exports = router;
