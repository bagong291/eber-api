const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Career extends Model {}
Career.init({
  position:    { type: DataTypes.STRING, allowNull: false },
  type:    { type: DataTypes.STRING, allowNull: false },
  location:    { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT,   allowNull: false },
  status:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Career',
  tableName: 'careers',
  timestamps: true
});

module.exports = Career;
