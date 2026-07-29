const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Could not set custom DNS servers');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clubRoutes = require('./routes/clubs');
const financeRoutes = require('./routes/finance');
const galleryRoutes = require('./routes/gallery');
const noticeRoutes = require('./routes/notices');
const memberRoutes = require('./routes/members');

const app = express();

// Trust reverse proxy (Render / Vercel SSL proxies) for secure cookies
app.set('trust proxy', 1);

// Dynamic CORS configuration allowing localhost & Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://collegeclub-flax.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(null, true); // Fallback allow for production flexibility
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploaded gallery images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check / API status
app.get('/', (req, res) => {
  res.send('Multi-Club Management System API Server is Online 🚀');
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'Online',
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);

// Club nested sub-resource routes
app.use('/api/clubs/:clubId/finance', financeRoutes);
app.use('/api/clubs/:clubId', financeRoutes); // for /transactions endpoints
app.use('/api/clubs/:clubId/gallery', galleryRoutes);
app.use('/api/clubs/:clubId/notices', noticeRoutes);
app.use('/api/clubs/:clubId/members', memberRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });