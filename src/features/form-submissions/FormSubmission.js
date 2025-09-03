const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class FormSubmission extends Model {}

FormSubmission.init({
  firstName: {
    field: 'first_name',
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'First name is required' },
      len: { args: [2, 100], msg: 'First name must be between 2-100 characters' }
    }
  },
  lastName: {
    field: 'last_name',
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name is required' },
      len: { args: [2, 100], msg: 'Last name must be between 2-100 characters' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: 'Must be a valid email address' },
      notEmpty: { msg: 'Email is required' }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: { args: [0, 20], msg: 'Phone number must be less than 20 characters' }
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: { args: [0, 200], msg: 'Company name must be less than 200 characters' }
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: { args: [0, 100], msg: 'City name must be less than 100 characters' }
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Subject is required' },
      len: { args: [5, 200], msg: 'Subject must be between 5-200 characters' }
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Message is required' },
      len: { args: [10, 2000], msg: 'Message must be between 10-2000 characters' }
    }
  },
  formType: {
    field: 'form_type',
    type: DataTypes.ENUM('inquiry', 'quote_request', 'contact', 'partnership', 'support', 'instant_access'),
    allowNull: false,
    defaultValue: 'inquiry'
  },
  status: {
    type: DataTypes.ENUM('pending', 'responded', 'resolved', 'spam'),
    allowNull: false,
    defaultValue: 'pending'
  },
  emailSent: {
    field: 'email_sent',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  emailSentAt: {
    field: 'email_sent_at',
    type: DataTypes.DATE,
    allowNull: true
  },
  ipAddress: {
    field: 'ip_address',
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    field: 'user_agent',
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'FormSubmission',
  tableName: 'form_submissions',
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['form_type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = FormSubmission;