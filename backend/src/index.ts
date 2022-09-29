import { app, io } from './config/app';
import { NodeCache } from './config/cache';
import { config } from './config/env';

const cache = new NodeCache(3600);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log(message);
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

export { app };
