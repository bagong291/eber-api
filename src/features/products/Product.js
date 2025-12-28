const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Product extends Model {}
Product.init({
  // Multi-language support for application and performance features  
  application_en:       { type: DataTypes.STRING,    allowNull: true },
  application_id:       { type: DataTypes.STRING,    allowNull: true },
  performanceFeature_en:{ field: 'performance_feature_en', type: DataTypes.TEXT, allowNull: true },
  performanceFeature_id:{ field: 'performance_feature_id', type: DataTypes.TEXT, allowNull: true },
  
  // Legacy fields (keep for backward compatibility)
  application:          { type: DataTypes.STRING,    allowNull: true },
  performanceFeature:   { field: 'performance_feature', type: DataTypes.TEXT, allowNull: true },
  
  code:                 { type: DataTypes.STRING,    allowNull: false, unique: true },
  type:                 { type: DataTypes.STRING,    allowNull: false },
  status:               { type: DataTypes.BOOLEAN,   allowNull: false, defaultValue: true },
  
  // Additional product fields
  it_mfg:               { type: DataTypes.STRING,    allowNull: true },
  segment:              { type: DataTypes.STRING,    allowNull: true },
  sbu_name:             { type: DataTypes.STRING,    allowNull: true },
  grp_name:             { type: DataTypes.STRING,    allowNull: true },
  grp_sbu:              { type: DataTypes.STRING,    allowNull: true },
  coid:                 { type: DataTypes.STRING,    allowNull: true }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
