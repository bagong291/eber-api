const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Home extends Model {}
Home.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logo: {
    field: 'logo_url',
    type: DataTypes.STRING
  },
  address: {
    field: 'address',
    type: DataTypes.STRING
  },
  phone: {
    field: 'phone',
    type: DataTypes.STRING
  },
  email: {
    field: 'email',
    type: DataTypes.STRING
  },
  subsidiaries:{
    type:DataTypes.JSONB,
    allowNull:false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Home',
  tableName: 'home',
  timestamps: true
});

module.exports = Home;
