const express = require('express');
const router = express.Router({ mergeParams: true });
const Transaction = require('../models/Transaction');
const Club = require('../models/Club');
const { authenticateToken, authorize, checkClubAccess } = require('../middleware/auth');

// Helper to recalculate club budgetSpent
const updateClubBudgetSpent = async (clubId) => {
  const result = await Transaction.aggregate([
    { $match: { clubId: new (require('mongoose').Types.ObjectId)(clubId), type: 'out' } },
    { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
  ]);
  const spent = result.length > 0 ? result[0].totalSpent : 0;
  await Club.findByIdAndUpdate(clubId, { budgetSpent: spent });
  return spent;
};

// GET /clubs/:clubId/finance/summary — available to super_admin, club_admin, member
router.get('/summary', authenticateToken, checkClubAccess, async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    // Category breakdown for spend ('out' transactions)
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { clubId: new (require('mongoose').Types.ObjectId)(clubId), type: 'out' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    const categories = ['Events', 'Equipment', 'Sponsorship', 'Dues', 'Venue', 'Supplies', 'Other'];
    const breakdownMap = {};
    categories.forEach(c => breakdownMap[c] = 0);
    categoryBreakdown.forEach(item => {
      breakdownMap[item._id] = item.total;
    });

    const categoryData = Object.keys(breakdownMap).map(cat => ({
      category: cat,
      amount: breakdownMap[cat]
    }));

    const budgetTotal = club.budgetTotal || 0;
    const budgetSpent = club.budgetSpent || 0;
    const remaining = Math.max(0, budgetTotal - budgetSpent);
    const utilization = budgetTotal > 0 ? Number(((budgetSpent / budgetTotal) * 100).toFixed(1)) : 0;

    res.json({
      budgetTotal,
      budgetSpent,
      remaining,
      utilization,
      categoryBreakdown: categoryData
    });
  } catch (err) {
    console.error('Error fetching finance summary:', err);
    res.status(500).json({ message: 'Error fetching finance summary.' });
  }
});

// GET /clubs/:clubId/transactions — super_admin and club_admin only (members cannot view detailed list)
router.get('/transactions', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments({ clubId });
    const transactions = await Transaction.find({ clubId })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'name email');

    res.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Error fetching transactions.' });
  }
});

// POST /clubs/:clubId/transactions — club_admin only
router.post('/transactions', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId } = req.params;
    const { description, category, type, amount, date } = req.body;

    if (!description || !category || !type || amount === undefined) {
      return res.status(400).json({ message: 'Description, category, type, and amount are required.' });
    }

    const transaction = new Transaction({
      clubId,
      description,
      category,
      type,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      addedBy: req.user.id
    });

    await transaction.save();
    await updateClubBudgetSpent(clubId);

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ message: 'Error adding transaction.' });
  }
});

// DELETE /clubs/:clubId/transactions/:id — club_admin only
router.delete('/transactions/:id', authenticateToken, checkClubAccess, authorize(['super_admin', 'club_admin']), async (req, res) => {
  try {
    const { clubId, id } = req.params;
    const transaction = await Transaction.findOneAndDelete({ _id: id, clubId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    await updateClubBudgetSpent(clubId);
    res.json({ message: 'Transaction deleted successfully.' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ message: 'Error deleting transaction.' });
  }
});

module.exports = router;
