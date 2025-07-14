const UserModel = require('./User');

class UserRepository {
  static async findAll(filter = {}, page = 1, pageSize = 10) {
    const where = {};
    // Global search (username, email, etc.)
    if (filter.search) {
      where['$or'] = [
        { username: { $like: `%${filter.search}%` } },
        { email: { $like: `%${filter.search}%` } }
      ];
    }
    // Add other filters
    Object.keys(filter).forEach(key => {
      if (key !== 'search') {
        where[key] = filter[key];
      }
    });
    const limit = Math.min(Number(pageSize) || 10, 100);
    const offset = (Number(page) - 1) * limit;
    const [data, total] = await Promise.all([
      UserModel.findAll({ where, order: [['created_at', 'DESC']], limit, offset, attributes: { exclude: ['password'] } }),
      UserModel.count({ where })
    ]);
    return {
      data,
      meta: { page: Number(page), pageSize: limit, total }
    };
  }

  static findById(userId) {
    return UserModel.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
  }

  static findByUsername(username) {
    return UserModel.findOne({ where: { username } });
  }

  static createUser(data) {
    return UserModel.create(data);
  }

  static updateUser(userId, updates) {
    return UserModel.findByPk(userId)
      .then(user => user && user.update(updates));
  }

  static deleteUser(userId) {
    return UserModel.findByPk(userId)
      .then(user => user && user.destroy());
  }
}

module.exports = UserRepository;
