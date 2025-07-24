const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const swaggerDocs = require('./src/config/swagger-docs');

// Import all route documentation files
require('./src/features/home/homeRoutes.docs');
require('./src/features/users/authRoutes.docs');
require('./src/features/articles/articleRoutes.docs');
require('./src/features/contacts/contactRoutes.docs');
require('./src/features/careers/careerRoutes.docs');
require('./src/features/products/productRoutes.docs');
require('./src/features/users/userRoutes.docs');
require('./src/features/company-profile/companyProfileRoutes.docs');
require('./src/features/company-profile/adminCompanyProfileRoutes.docs');
require('./src/features/upload/uploadRoutes.docs');
require('./src/features/dashboard/dashboardRoutes.docs');

const outputFile = './docs/swagger-output.json';
const endpointsFiles = [
  './src/features/home/homeRoutes.js',
  './src/features/users/authRoutes.js',
  './src/features/articles/articleRoutes.js',
  './src/features/contacts/contactRoutes.js',
  './src/features/careers/careerRoutes.js',
  './src/features/products/productRoutes.js',
  './src/features/users/userRoutes.js',
  './src/features/company-profile/companyProfileRoutes.js',
  './src/features/company-profile/adminCompanyProfileRoutes.js',
  './src/features/upload/uploadRoutes.js',
  './src/features/dashboard/dashboardRoutes.js'
];

// Generate Swagger/OpenAPI documentation
swaggerAutogen(outputFile, endpointsFiles, swaggerDocs);
