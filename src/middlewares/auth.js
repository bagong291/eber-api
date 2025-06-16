const jwt    = require('jsonwebtoken');
const config = require('../config/default');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Token missing' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({status:"failed", message: 'Invalid token' });
  }
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status:"failed",message: 'Forbidden' });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };
