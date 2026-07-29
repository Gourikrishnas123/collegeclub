const express = require('express');
const router = express.Router({ mergeParams: true });
const Notice = require('../models/Notice');
const { authenticateToken, authorize, checkClubAccess } = require('../middleware/auth');

// GET /clubs/:clubId/notices — sorted pinned-first, then newest
router.get('/', authenticateToken, checkClubAccess, async (req, res) => {
  try {
    const { clubId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Notice.countDocuments({ clubId });
    const notices = await Notice.find({ clubId })
      .sort({ pinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('postedBy', 'name email');

    res.json({
      notices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ message: 'Error fetching notices.' });
  }
});

// POST /clubs/:clubId/notices — club_admin only
router.post('/', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId } = req.params;
    const { title, body, tag, pinned } = req.body;

    if (!title || !body || !tag) {
      return res.status(400).json({ message: 'Title, body, and tag are required.' });
    }

    const validTags = ['Urgent', 'Events', 'Finance', 'General'];
    if (!validTags.includes(tag)) {
      return res.status(400).json({ message: 'Invalid tag option.' });
    }

    const notice = new Notice({
      clubId,
      title,
      body,
      tag,
      pinned: Boolean(pinned),
      postedBy: req.user.id
    });

    await notice.save();
    await notice.populate('postedBy', 'name email');

    res.status(201).json(notice);
  } catch (err) {
    console.error('Error posting notice:', err);
    res.status(500).json({ message: 'Error posting notice.' });
  }
});

// PATCH /clubs/:clubId/notices/:id — club_admin only
router.patch('/:id', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId, id } = req.params;
    const { title, body, tag, pinned } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (body) updateFields.body = body;
    if (tag) updateFields.tag = tag;
    if (pinned !== undefined) updateFields.pinned = Boolean(pinned);

    const notice = await Notice.findOneAndUpdate(
      { _id: id, clubId },
      updateFields,
      { new: true }
    ).populate('postedBy', 'name email');

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    res.json(notice);
  } catch (err) {
    console.error('Error updating notice:', err);
    res.status(500).json({ message: 'Error updating notice.' });
  }
});

// DELETE /clubs/:clubId/notices/:id — club_admin only
router.delete('/:id', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId, id } = req.params;
    const notice = await Notice.findOneAndDelete({ _id: id, clubId });

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    res.json({ message: 'Notice deleted successfully.' });
  } catch (err) {
    console.error('Error deleting notice:', err);
    res.status(500).json({ message: 'Error deleting notice.' });
  }
});

module.exports = router;
