const UserModel = require('./User');

class UserRepository {
  static findAll() {
    return UserModel.findAll({
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    });
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
