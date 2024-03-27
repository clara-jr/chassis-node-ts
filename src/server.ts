import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Server } from 'node:http';

import routes from './routes/routes.ts';
import customErrorHandler from './middlewares/custom-error-handler.ts';
import authenticationHandler from './middlewares/authentication-handler.ts';
import setOpenAPIDocumentation from './middlewares/openapi-docs-handler.ts';
import setMorganLogger from './middlewares/morgan-logger-handler.ts';
import cacheHandler from './middlewares/cache-handler.ts';
import RedisService from './services/redis.service.ts';
import JWTService from './services/jwt.service.ts';

const app = express();
const PORT = process.env.PORT || 8080;

let server: Server;

async function start() {
  dotenv.config({
    path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
  });
  console.info(`NODE_ENV: ${process.env.NODE_ENV}`);

  // Init app services (e.g. MongoDB connection)
  const mongodb_uri: string =
    process.env.MONGODB_URI || 'mongodb://localhost/pentathlon';
  await mongoose.connect(mongodb_uri);
  console.info(`✅ MongoDB is connected to ${mongodb_uri}`);
  const redis_uri: string = process.env.REDIS_URI || 'redis://localhost:6379';
  await RedisService.bootstrap(redis_uri);
  console.info(`✅ Redis is connected to ${redis_uri}`);
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

  // Start Express server
  await new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.info(`✅ Express server listening at port: ${PORT}`);
      resolve(true);
    });
  });
}

async function stop() {
  // Stop Express server
  await new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.info('Express server stopped');
        resolve(true);
      });
    } else {
      resolve(true);
    }
  });

  // Stop app services (e.g. MongoDB connection)
  await mongoose.disconnect();
  console.info('MongoDB disconnected.');
  RedisService.disconnect();
  console.info('Redis disconnected.');

  console.info('Exiting...');
}

// Docker stop
process.on('SIGTERM', async () => {
  await stop();
  process.exit(0);
});

// Cctrl-C
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
