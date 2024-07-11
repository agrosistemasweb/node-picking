const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Doc',
      version: '1.0.0',
      description: 'Development Picking API',
    },
    servers: [
      {
        url: 'https://goldfish-app-2-mfno2.ondigitalocean.app',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
