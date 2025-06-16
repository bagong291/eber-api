module.exports = {
  outputFile: './docs/swagger-output.json',
  endpointsFiles: ['./src/features/**/**Routes.js'],
  doc: {
    info: {
      title:       'Company Profile API',
      description: 'Auto-generated with swagger-autogen',
      version:     '1.0.0'
    },
    host:     `localhost:${process.env.PORT || 3000}`,
    basePath: '/api/v1'
  }
};
