const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/config/swagger-docs');

const app = express();

// Serve Swagger UI at /api-docs
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Company Profile API Documentation'
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Swagger UI is running on http://localhost:${PORT}/api-docs`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
