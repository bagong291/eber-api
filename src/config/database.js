const { Sequelize } = require('sequelize');
const config        = require('./default').db;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host:    config.host,
    port:    config.port,
    dialect: config.dialect,
    logging: false,
    define: {
      underscored:     true,
      freezeTableName: true
    }
  }
);

module.exports = sequelize;
