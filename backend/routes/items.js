const express = require('express');
const Joi = require('joi');
const Item = require('../models/Item');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Validation schemas
const createItemSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().max(500),
  tags: Joi.array().items(Joi.string()),
});

const updateItemSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(500),
  status: Joi.string().enum('active', 'inactive', 'archived'),
  tags: Joi.array().items(Joi.string()),
});

// Create item
router.post('/', validateRequest(createItemSchema), async (req, res, next) => {
  try {
    const { title, description, tags } = req.validated;

    const item = await Item.create({
      title,
      description,
      tags: tags || [],
      userId: req.user.id,
    });

    logger.info({
      message: 'Item created',
      userId: req.user.id,
      itemId: item._id,
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// Get all items (with pagination)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const items = await Item.find({ userId: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single item
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return next(new AppError('Item not found', 404));
    }

    if (item.userId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// Update item
router.put('/:id', validateRequest(updateItemSchema), async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return next(new AppError('Item not found', 404));
    }

    if (item.userId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.validated, {
      new: true,
      runValidators: true,
    });

    logger.info({
      message: 'Item updated',
      userId: req.user.id,
      itemId: item._id,
    });

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// Delete item
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return next(new AppError('Item not found', 404));
    }

    if (item.userId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    await Item.findByIdAndDelete(req.params.id);

    logger.info({
      message: 'Item deleted',
      userId: req.user.id,
      itemId: item._id,
    });

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
