const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Career extends Model {}
Career.init({
  position:    { type: DataTypes.STRING, allowNull: false },
  type:    { type: DataTypes.STRING, allowNull: false },
  location:    { type: DataTypes.STRING, allowNull: false },
  
  // Multi-language job description
  description_en: { type: DataTypes.TEXT, allowNull: false },
  description_id: { type: DataTypes.TEXT, allowNull: false },
  
  // Legacy field (for backward compatibility)
  description: { type: DataTypes.TEXT, allowNull: true },
  
  status:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  sequelize,
  modelName: 'Career',
  tableName: 'careers',
  timestamps: true
});

module.exports = Career;
