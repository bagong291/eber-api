const UserService = require('./userService');

exports.listUsers = async (req, res, next) => {
  try {
    const { search, page = 1, pageSize, limit, ...filters } = req.query;
    const effectivePageSize = Number(limit) || Number(pageSize) || 10;
    const items = await UserService.listUsers({ search, ...filters }, Number(page), effectivePageSize);
    res.json({status:"success",data:items});
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const item = await UserService.getUserById(req.params.id);
    if (!item) return res.status(404).json({ message: 'User not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updated = await UserService.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({status:"success",data:updated});
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
