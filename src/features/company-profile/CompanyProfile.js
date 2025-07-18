const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class CompanyProfile extends Model {}

CompanyProfile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    coordinate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    main_image: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
  sequelize,
  modelName: 'CompanyProfile',
  tableName: 'company_profiles',
  timestamps: true,
});

module.exports = CompanyProfile;
