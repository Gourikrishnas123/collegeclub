const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const User = require('../models/User');
const Notice = require('../models/Notice');
const Transaction = require('../models/Transaction');
const { authenticateToken, authorize } = require('../middleware/auth');

// GET /clubs — super_admin: all clubs; club_admin/member: only their own club
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'super_admin') {
      const clubs = await Club.find().sort({ name: 1 });
      return res.json(clubs);
    } else {
      const userClubId = req.user.clubId ? (typeof req.user.clubId === 'object' ? req.user.clubId._id : req.user.clubId) : null;
      if (!userClubId) {
        return res.json([]);
      }
      const club = await Club.findById(userClubId);
      return res.json(club ? [club] : []);
    }
  } catch (err) {
    console.error('Error fetching clubs:', err);
    res.status(500).json({ message: 'Error fetching clubs.' });
  }
});

// GET /clubs/overview — super_admin only: aggregated stats across all clubs
router.get('/overview', authenticateToken, authorize(['super_admin']), async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    const totalClubs = clubs.length;
    const totalMembers = await User.countDocuments({ role: { $ne: 'super_admin' } });
    
    let totalBudget = 0;
    let totalSpent = 0;
    clubs.forEach(c => {
      totalBudget += c.budgetTotal || 0;
      totalSpent += c.budgetSpent || 0;
    });

    const totalNotices = await Notice.countDocuments();

    // Map each club with member count and transaction count
    const clubSummaries = await Promise.all(clubs.map(async (club) => {
      const memberCount = await User.countDocuments({ clubId: club._id });
      const adminUser = await User.findOne({ clubId: club._id, role: 'club_admin' }).select('name email');
      return {
        ...club.toObject(),
        memberCount,
        adminName: adminUser ? adminUser.name : 'Unassigned',
        adminEmail: adminUser ? adminUser.email : ''
      };
    }));

    res.json({
      stats: {
        totalClubs,
        totalMembers,
        totalBudget,
        totalSpent,
        budgetUtilization: totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0,
        totalNotices
      },
      clubs: clubSummaries
    });
  } catch (err) {
    console.error('Error fetching admin overview:', err);
    res.status(500).json({ message: 'Error fetching admin overview.' });
  }
});

// POST /clubs — super_admin only, create new club
router.post('/', authenticateToken, authorize(['super_admin']), async (req, res) => {
  try {
    const { name, department, mark, description, budgetTotal, adminEmail, adminName, adminPassword } = req.body;

    if (!name || !department || !mark) {
      return res.status(400).json({ message: 'Name, department, and mark code are required.' });
    }

    const newClub = new Club({
      name,
      department,
      mark: mark.toUpperCase(),
      description: description || '',
      budgetTotal: Number(budgetTotal) || 0,
      budgetSpent: 0,
      isActive: true
    });

    await newClub.save();

    // If an admin user creation details were supplied
    let createdAdmin = null;
    if (adminEmail && adminPassword) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      createdAdmin = new User({
        name: adminName || `${mark} Admin`,
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: 'club_admin',
        clubId: newClub._id
      });
      await createdAdmin.save();
    }

    res.status(201).json({
      club: newClub,
      admin: createdAdmin ? { id: createdAdmin._id, email: createdAdmin.email } : null
    });
  } catch (err) {
    console.error('Error creating club:', err);
    res.status(500).json({ message: 'Error creating club.' });
  }
});

// PATCH /clubs/:id — super_admin or that club's admin
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const clubId = req.params.id;

    const userClubId = req.user.clubId ? (typeof req.user.clubId === 'object' ? req.user.clubId._id?.toString() : req.user.clubId.toString()) : null;
    if (req.user.role !== 'super_admin' && userClubId !== clubId) {
      return res.status(403).json({ message: 'Access denied: You can only edit your own club.' });
    }

    const { name, department, mark, description, budgetTotal } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (department) updateFields.department = department;
    if (mark) updateFields.mark = mark.toUpperCase();
    if (description !== undefined) updateFields.description = description;
    if (budgetTotal !== undefined && req.user.role === 'super_admin') {
      updateFields.budgetTotal = Number(budgetTotal);
    }

    const updatedClub = await Club.findByIdAndUpdate(clubId, updateFields, { new: true });
    if (!updatedClub) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    res.json(updatedClub);
  } catch (err) {
    console.error('Error updating club:', err);
    res.status(500).json({ message: 'Error updating club.' });
  }
});

// PATCH /clubs/:id/deactivate — super_admin only
router.patch('/:id/deactivate', authenticateToken, authorize(['super_admin']), async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    club.isActive = !club.isActive;
    await club.save();

    res.json({ message: `Club ${club.isActive ? 'activated' : 'deactivated'} successfully.`, club });
  } catch (err) {
    console.error('Error toggling club status:', err);
    res.status(500).json({ message: 'Error updating club status.' });
  }
});

module.exports = router;