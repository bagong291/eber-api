const bcrypt = require('bcrypt');
const User = require('../features/users/User');
const sequelize = require('../config/database');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Check if admin user already exists
      const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
      
      if (!adminExists) {
        await User.create({
          username: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('✅ Admin user created successfully');
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    } catch (error) {
      console.error('❌ Error seeding admin user:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await User.destroy({ where: { email: 'admin@example.com' } });
  }
};
