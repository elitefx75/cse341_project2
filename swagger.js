const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
        title: 'Items API',
      description: 'API for managing items',
  },
  host: 'localhost:3000',
  schemes: ['https', 'http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/items.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);