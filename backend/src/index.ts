import { app, io } from './config/app';
import { NodeCache } from './config/cache';
import { config } from './config/env';

const cache = new NodeCache(3600);

io.on('connection', (socket) => {
  // ...
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.listen(config.port || 8000, () => {
  console.log(`Server is running on port ${config.port || 8000}`);
});

export { app };
