import server from './src/server.ts';

try {
  await server.start();
} catch (error) {
  console.log(error);
  process.exit(0);
}