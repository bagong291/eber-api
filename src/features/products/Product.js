const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Product extends Model {}
Product.init({
  code:                 { type: DataTypes.STRING,    allowNull: false, unique: true },
  application:          { type: DataTypes.STRING,    allowNull: false },
  performanceFeature:   { field: 'performance_feature', type: DataTypes.TEXT, allowNull: false },
  type:                 { type: DataTypes.STRING,    allowNull: false }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
