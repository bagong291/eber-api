const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Product = require('../products/Product');
const CompanyProfile = require('../company-profile/CompanyProfile');

class CompanyTopProduct extends Model {}

CompanyTopProduct.init({
  company_profile_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'company_profiles',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
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
      max: 3
    }
  }
}, {
  sequelize,
  modelName: 'CompanyTopProduct',
  tableName: 'company_top_products',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['company_profile_id', 'rank'],
      name: 'unique_company_rank'
    },
    {
      unique: true,
      fields: ['company_profile_id', 'product_id'],
      name: 'unique_company_product'
    }
  ]
});

// Define associations
CompanyTopProduct.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

CompanyTopProduct.belongsTo(CompanyProfile, {
  foreignKey: 'company_profile_id',
  as: 'company'
});

module.exports = CompanyTopProduct;
