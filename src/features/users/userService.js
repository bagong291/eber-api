const bcrypt          = require('bcrypt');
const UserRepository  = require('./userRepository');

class UserService {
  static async registerUser(data) {
    const hashed = await bcrypt.hash(data.password, 10);
    return UserRepository.createUser({ 
      username: data.username, 
      email: data.email, 
      password: hashed 
    });
  }

  static listUsers() {
    return UserRepository.findAll();
  }

  static getUserById(userId) {
    return UserRepository.findById(userId);
  }

  static async updateUser(userId, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return UserRepository.updateUser(userId, data);
  }

  static deleteUser(userId) {
    return UserRepository.deleteUser(userId);
  }
}

module.exports = UserService;
