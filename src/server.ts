import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { Server } from 'node:http';
import { styleText } from 'node:util';

import routes from './routes/routes.ts';
import customErrorHandler from './middlewares/custom-error-handler.ts';
import authenticationHandler from './middlewares/authentication-handler.ts';
import setOpenAPIDocumentation from './middlewares/openapi-docs-handler.ts';
import setMorganLogger from './middlewares/morgan-logger-handler.ts';
import cacheHandler from './middlewares/cache-handler.ts';
import IMDBService from './services/imdb.service.ts';
import JWTService from './services/jwt.service.ts';
import redisService from './services/redis.service.ts';
import mongoRepository from './repositories/mongo.repository.ts';
import exampleRepository from './repositories/example.repository.ts';
import { ExampleModel } from './models/example.model.ts';

const app = express();

let server: Server;

async function start() {
  process.loadEnvFile(`.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`);
  // @ts-expect-error: ignore ts error in the following line
  console.info(styleText('bold', `NODE_ENV: ${styleText(['bgGreenBright', 'bold'], process.env.NODE_ENV)}`));

  // Init app services (e.g. MongoDB connection)
  const mongodb_uri: string =
    process.env.MONGODB_URI || 'mongodb://localhost/chassis';
  await mongoose.connect(mongodb_uri);
  console.info(`✅ MongoDB is connected to ${styleText(['bgGreenBright', 'bold'], mongodb_uri)}`);
  const redis_uri: string = process.env.REDIS_URI || 'redis://localhost:6379';
  await IMDBService.bootstrap(redisService, { uri: redis_uri });
  console.info(`✅ Redis is connected to ${styleText(['bgGreenBright', 'bold'], redis_uri)}`);
  JWTService.bootstrap();

  // Add middlewares (including routes)
  app.use(helmet()); // set HTTP response headers
  app.use(express.json()); // for parsing application/json
  app.use(cors()); // enable CORS
  app.use(cookieParser()); // set req.cookies
  setMorganLogger(app); // set morgan logger
  setOpenAPIDocumentation(app); // set openapi documentation
  app.use(authenticationHandler);
  app.use(cacheHandler);
  app.use('/', routes);
  app.use(customErrorHandler);

  // Bootstrap repositories
  exampleRepository.bootstrap(mongoRepository, ExampleModel);

  // Start Express server
  await new Promise((resolve) => {
    const PORT = process.env.PORT || 8080;
    server = app.listen(PORT, () => {
      console.info(`✅ Express server listening at port: ${styleText(['bgGreenBright', 'bold'], `${PORT}`)}`);
      resolve(true);
    });
  });
}

async function stop() {
  // Stop Express server
  await new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.info(styleText('dim', 'Express server stopped'));
        resolve(true);
      });
    } else {
      resolve(true);
    }
  });

  // Stop app services (e.g. MongoDB connection)
  await mongoose.disconnect();
  console.info(styleText('dim', 'MongoDB disconnected'));
  IMDBService.disconnect();
  console.info(styleText('dim', 'Redis disconnected'));

  console.info(styleText('dim', 'Exiting...'));
}

// Docker stop
process.on('SIGTERM', async () => {
  await stop();
  process.exit(0);
});

// Ctrl-C
process.on('SIGINT', async () => {
  await stop();
  process.exit(0);
});

// Nodemon restart
process.on('SIGUSR2', async () => {
  await stop();
  process.exit(0);
});

export default { app, start, stop };
