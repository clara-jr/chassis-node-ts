import server from '../src/server.ts';
import { styleText } from 'node:util';

before(async () => {
  console.info(styleText('bgWhiteBright', '🤖 Launching server before running tests...'));
  try {
    await server.start();
  } catch (error) {
    console.error(styleText('bgRedBright', error));
  }
});

after(async () => {
  console.info(styleText('bgWhiteBright', '🤖 Stopping server after running tests...'));
  try {
    await server.stop();
  } catch (error) {
    console.error(styleText('bgRedBright', error));
  }
});