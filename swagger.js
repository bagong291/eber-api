const swaggerAutogen = require('swagger-autogen')();
const config        = require('./src/config/swagger');

swaggerAutogen(config.outputFile, config.endpointsFiles, config.doc)
  .then(() => require('./src/server'));
