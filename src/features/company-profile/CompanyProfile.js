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
    // Multi-language address
    address_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Legacy field (for backward compatibility)
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Multi-language main description
    description_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Legacy field (for backward compatibility)
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    main_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
  sequelize,
  modelName: 'CompanyProfile',
  tableName: 'company_profiles',
  timestamps: true,
});

module.exports = CompanyProfile;
