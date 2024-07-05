import server from './src/server.ts';

try {
  await server.start();
} catch (error) {
  console.error(error);
  process.exit(0);
}