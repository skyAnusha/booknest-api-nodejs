// JavaScript
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    logger.warn('No authorization header');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.warn('User not found');
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    logger.error('Token error: ' + err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;