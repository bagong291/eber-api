const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Certificate extends Model {}

Certificate.init({
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Certificate name (optional)'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Certificate image URL'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Active/Inactive status'
  }
}, {
  sequelize,
  modelName: 'Certificate',
  tableName: 'certificates',
  timestamps: true
});

module.exports = Certificate;
