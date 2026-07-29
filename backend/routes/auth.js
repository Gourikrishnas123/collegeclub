const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Club = require('../models/Club');
const { authenticateToken } = require('../middleware/auth');

// Helper to generate access token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      clubId: user.clubId 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, clubId, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default to 'member' unless explicitly set and valid
    let assignedRole = 'member';
    if (role && ['super_admin', 'club_admin', 'member'].includes(role)) {
      assignedRole = role;
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      clubId: assignedRole === 'super_admin' ? null : clubId || null,
      year: year || ''
    });

    await user.save();
    await user.populate('clubId', 'name mark department');

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubId: user.clubId,
        year: user.year
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('clubId', 'name mark department budgetTotal budgetSpent');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubId: user.clubId,
        year: user.year
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /auth/refresh
router.post('/refresh', (req, res) => {
  const token = req.cookies ? req.cookies.token : null;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role, clubId: decoded.clubId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', newToken, cookieOptions);
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.json({ message: 'Logged out successfully.' });
});

// GET /auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash').populate('clubId', 'name mark department budgetTotal budgetSpent');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
});

module.exports = router;
