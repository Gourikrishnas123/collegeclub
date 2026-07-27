const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register
router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.validated;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return next(new AppError('User already exists', 400));
    }

    // Create user
    user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    logger.info({
      message: 'User registered successfully',
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = generateToken(user._id);

    logger.info({
      message: 'User logged in successfully',
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
