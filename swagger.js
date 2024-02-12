const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API',
    description: 'My second API Project'
  },
  host: 'localhost:3000',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];


swaggerAutogen(outputFile, routes, doc);