const express = require('express');
const router = express.Router({ mergeParams: true });
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticateToken, authorize, checkClubAccess } = require('../middleware/auth');

// GET /clubs/:clubId/members
router.get('/', authenticateToken, checkClubAccess, async (req, res) => {
  try {
    const { clubId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments({ clubId });
    const members = await User.find({ clubId })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Error fetching members.' });
  }
});

// POST /clubs/:clubId/members — club_admin invites/adds a member
router.post('/', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, email, password, role, year } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const defaultPassword = password || 'member123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role && ['club_admin', 'member'].includes(role) ? role : 'member',
      clubId,
      year: year || ''
    });

    await newUser.save();
    
    const userObject = newUser.toObject();
    delete userObject.passwordHash;

    res.status(201).json(userObject);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: 'Error adding member.' });
  }
});

// PATCH /clubs/:clubId/members/:id — change role/status
router.patch('/:id', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId, id } = req.params;
    const { role, year, name } = req.body;

    const updateFields = {};
    if (role && ['club_admin', 'member'].includes(role)) updateFields.role = role;
    if (year !== undefined) updateFields.year = year;
    if (name) updateFields.name = name;

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, clubId },
      updateFields,
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating member:', err);
    res.status(500).json({ message: 'Error updating member.' });
  }
});

// DELETE /clubs/:clubId/members/:id — remove member
router.delete('/:id', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId, id } = req.params;

    // Prevent deleting self if current club_admin
    if (req.user.id === id) {
      return res.status(400).json({ message: 'You cannot remove your own account.' });
    }

    const deletedUser = await User.findOneAndDelete({ _id: id, clubId });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.json({ message: 'Member removed successfully.' });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ message: 'Error removing member.' });
  }
});

module.exports = router;