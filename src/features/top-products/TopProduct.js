const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Product = require('../products/Product');

class TopProduct extends Model {}

TopProduct.init({
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  }
}, {
  sequelize,
  modelName: 'TopProduct',
  tableName: 'top_products',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['product_id']
    },
    {
      unique: true,
      fields: ['rank']
    }
  ]
});

// Define association
TopProduct.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

module.exports = TopProduct;
