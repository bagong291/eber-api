const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Company Profile API',
      version: '1.0.0',
      description: 'API for managing company profile content and resources',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.BACKEND_URL,
        description: 'Development server'
      },
      {
        url: 'http://localhost:3022/api/v1',
        description: 'Local server'
      },
      {
        url: 'https://api.example.com/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' }
          }
        },
        RegisterRequest: {
          allOf: [
            { $ref: '#/components/schemas/LoginRequest' },
            {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
                role: { type: 'string', enum: ['user', 'admin'] }
              }
            }
          ]
        },
        Article: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'published'] },
            imageUrl: { type: 'string', format: 'uri' }
          }
        },
        Career: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            position: { type: 'string' },
            location: { type: 'string' },
            type: { 
              type: 'string', 
              enum: ['full-time', 'part-time', 'contract', 'internship'] 
            },
            description: { type: 'string' },
            requirements: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            subject: { type: 'string' },
            message: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['new', 'in_progress', 'resolved'] 
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' },
            imageUrl: { type: 'string', format: 'uri' }
          }
        },
        CompanyProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            logoUrl: { type: 'string', format: 'uri' }
          }
        },
        HomeContent: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            heroTitle: { type: 'string' },
            heroSubtitle: { type: 'string' },
            heroImageUrl: { type: 'string', format: 'uri' },
            aboutTitle: { type: 'string' },
            aboutContent: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error message describing the issue' }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Validation Error' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management (admin only)' },
      { name: 'Articles', description: 'Article management' },
      { name: 'Careers', description: 'Career opportunities' },
      { name: 'Contacts', description: 'Contact form submissions' },
      { name: 'Products', description: 'Product catalog' },
      { name: 'Company Profile', description: 'Company profile information' },
      { name: 'Home', description: 'Home page content' },
      { name: 'Upload', description: 'File upload endpoints' },
      { name: 'Dashboard', description: 'Admin dashboard statistics' }
    ],
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/features/**/*.js',
    './src/features/**/*.docs.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
