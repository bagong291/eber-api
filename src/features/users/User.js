const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class User extends Model {}
User.init({
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role:     { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true
});

module.exports = User;
