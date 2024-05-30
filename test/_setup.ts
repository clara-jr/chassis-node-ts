import server from '../src/server.ts';
import { styleText } from 'node:util';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

before(async () => {
  console.info(styleText('bgWhiteBright', '🤖 Launching server before running tests...'));
  try {
    // Start MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await server.start();
  } catch (error) {
    console.error(styleText('bgRedBright', error));
  }
});

after(async () => {
  console.info(styleText('bgWhiteBright', '🤖 Stopping server after running tests...'));
  try {
    await server.stop();
    // Stop MongoDB in-memory server
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error(styleText('bgRedBright', error));
  }
});