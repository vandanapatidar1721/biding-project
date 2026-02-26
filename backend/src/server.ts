import http from 'http';
import { app, initApp } from './app';
import { env } from './config/env';
import { createSocketServer } from './websocket/socket';

async function bootstrap() {
  await initApp();

  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});

