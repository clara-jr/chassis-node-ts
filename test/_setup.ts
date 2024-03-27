import server from '../src/server.ts';

before(async () => {
  console.log('🤖 Launching server before running tests...');
  try {
    await server.start();
  } catch (error) {
    console.log(error);
  }
});

after(async () => {
  console.log('🤖 Stopping server after running tests...');
  try {
    await server.stop();
  } catch (error) {
    console.log(error);
  }
});