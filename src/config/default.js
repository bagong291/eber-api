require('dotenv').config();

module.exports = {
  port:      process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  adminSecret: process.env.ADMIN_SECRET,
  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 5432,
    database: process.env.DB_NAME     || 'company_profile',
    username: process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect:  'postgres'
  }
};
