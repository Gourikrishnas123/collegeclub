const jwt = require('jsonwebtoken');

// Authenticate token from cookie or Authorization header
const authenticateToken = (req, res, next) => {
  let token = req.cookies ? req.cookies.token : null;
  
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Check if user has required role(s)
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges.' });
    }

    next();
  };
};

// Helper to safely extract string ID from ObjectId or object
const extractIdString = (val) => {
  if (!val) return null;
  if (typeof val === 'object') {
    return val._id ? val._id.toString() : val.toString();
  }
  return val.toString();
};

// Verify user has access to target clubId (super_admin can access any, club_admin/member only their own)
const checkClubAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Super admin can access any club
  if (req.user.role === 'super_admin') {
    return next();
  }

  const targetClubId = req.params.clubId || req.body.clubId || req.query.clubId;

  if (!targetClubId) {
    return res.status(400).json({ message: 'Club ID parameter missing.' });
  }

  const userClubIdStr = extractIdString(req.user.clubId);
  const targetClubIdStr = targetClubId.toString();

  if (!userClubIdStr || userClubIdStr !== targetClubIdStr) {
    return res.status(403).json({ message: 'Access denied: You can only access your own club data.' });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorize,
  checkClubAccess
};
