import { io, server } from './config/app';
import { NodeCache } from './config/cache';
import { config } from './config/env';
import { handleMessages } from './routes/socketio';

const cache = new NodeCache(3600);

io.on('connection', (socket) => {
  socket.on('message', async (message) => {
    await handleMessages(socket, message, cache);
  });

  socket.on('disconnect', () => {
    socket.removeAllListeners();
  });
});

server.listen(config.port || 8080, () => {
  console.log(`Server is running on port ${config.port || 8080}`);
});

// io.listen(4000);
