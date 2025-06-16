const express       = require('express');
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const swaggerUi     = require('swagger-ui-express');
const sequelize     = require('./config/database');
const errorHandler  = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Database connect & sync
sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => console.log('✅ DB connected & synced'))
  .catch(err => console.error('❌ DB error:', err));

// Swagger UI
const swaggerDocument = require('../docs/swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Feature routes
app.use('/api/v1/home',     require('./features/home/homeRoutes'));
app.use('/api/v1/articles', require('./features/articles/articleRoutes'));
app.use('/api/v1/contacts', require('./features/contacts/contactRoutes'));
app.use('/api/v1/careers',  require('./features/careers/careerRoutes'));
app.use('/api/v1/products', require('./features/products/productRoutes'));
app.use('/api/v1/auth',     require('./features/users/authRoutes'));
app.use('/api/v1/users',    require('./features/users/userRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;
