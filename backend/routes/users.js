const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Get current user profile
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
const updateProfileSchema = Joi.object({
  name: Joi.string().max(50),
  email: Joi.string().email(),
});

router.put('/me', protect, validateRequest(updateProfileSchema), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.validated, {
      new: true,
      runValidators: true,
    });

    logger.info({
      message: 'User profile updated',
      userId: user._id,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
