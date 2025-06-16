const { Model, DataTypes } = require('sequelize');
const sequelize            = require('../../config/database');

class Contact extends Model {}
Contact.init({
  firstName: { field: 'first_name', type: DataTypes.STRING, allowNull: false },
  lastName:  { field: 'last_name',  type: DataTypes.STRING, allowNull: false },
  email:     { type: DataTypes.STRING, allowNull: false },
  message:   { type: DataTypes.TEXT }
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'contacts',
  timestamps: true
});

module.exports = Contact;
