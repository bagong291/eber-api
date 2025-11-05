const jwt            = require('jsonwebtoken');
const bcrypt         = require('bcrypt');
const config         = require('../../config/default');
const UserRepository = require('./userRepository');

exports.register = async (req, res, next) => {
  try {
    // Validate ADMIN_SECRET from payload
    const { adminSecret, ...userData } = req.body;
    
    if (!adminSecret || adminSecret !== config.adminSecret) {
      return res.status(403).json({ 
        status: 'failed',
        message: 'Invalid or missing admin secret' 
      });
    }
    
    const existing = await UserRepository.findByUsername(userData.username);
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = await require('./userService').registerUser(userData);
    const safeUser = user.get({ plain: true });
    delete safeUser.password;
    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await UserRepository.findByUsername(req.body.username);
    if (!user) {
      return res.status(401).json({ status:"failed",message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ status:"failed",message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: '9999999999999999999999999999999999999h' }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
