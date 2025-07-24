const express       = require('express');
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const swaggerUi     = require('swagger-ui-express');
const sequelize     = require('./config/database');
const errorHandler  = require('./utils/errorHandler');
const path = require('path');
const app = express();
const cors          = require('cors');
// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // atur limit lebih besar sesuai kebutuhan
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(morgan('dev'));
app.use(cors()); 
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
app.use('/api/v1/corporate',    require('./features/company-profile/companyProfileRoutes'));
app.use('/api/v1/admin-company-profile', require('./features/company-profile/adminCompanyProfileRoutes'));
app.use('/api/v1/dashboard', require('./features/dashboard/dashboardRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // akses publik
app.use('/api/v1/upload',require('./features/upload/uploadRoutes'))

// Error handler
app.use(errorHandler);

module.exports = app;
