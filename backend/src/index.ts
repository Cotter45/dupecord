import { app, io } from './config/app';
import { NodeCache } from './config/cache';
import { config } from './config/env';

const cache = new NodeCache(3600);

const handleMessages = async (
  socket: any,
  message: { type: string; data: any },
  cache: NodeCache,
) => {
  const { type, data } = message;
  console.log('MESSAGES', type);

  switch (type) {
    case 'login':
      const online = cache.get('online');
      if (online) {
        cache.set('online', [...online, { [data.email]: socket.id }]);
      }
      cache.set('online', [data.email]);
      break;
    case 'logout':
      const offline = cache.get('online');
      if (offline) {
        cache.set(
          'online',
          offline.filter((user: any) => Object.keys(user)[0] !== data.email),
        );
      }
      break;
    default:
      break;
  }
};

io.on('connection', (socket) => {
  socket.on('message', async (message) => {
    console.log(message);
    await handleMessages(socket, message, cache);
  });

  socket.on('disconnect', (message) => {
    console.log(message);
    socket.removeAllListeners();
  });
});

app.listen(config.port || 8000, () => {
  console.log(`Server is running on port ${config.port || 8000}`);
});

io.listen(4000);
