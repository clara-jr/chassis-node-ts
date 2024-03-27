import { Application } from 'express';
import swaggerui from 'swagger-ui-express';
import swaggerjsdoc from 'swagger-jsdoc';

const openapiOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chassis API',
      version: '1.0.0',
      description: 'Node.js + Express.js + MongoDB Chassis API',
    },
  },
  apis: ['src/routes/*.ts'],
};

export default async function setOpenAPIDocumentation(app: Application) {
  app.use(
    '/openapi',
    swaggerui.serve,
    swaggerui.setup(swaggerjsdoc(openapiOptions))
  );
}
