import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { config } from './env';
import { apiRouter } from '../routes/index';

import type { Express, Request, Response, NextFunction } from 'express';
import { validateJWT } from '../routes/services/session.service';

const app: Express = express();
const environment = config.environment;
const isProduction = environment === 'production';

const server = createServer(app);

if (environment === 'development') {
  app.use(morgan('dev'));
  app.use(cors());
}

app.set('trust proxy', 1);
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://discordia.fly.dev'
        : ['http://localhost:5173', 'http://localhost:1420'],
    allowedHeaders: ['BEARER-TOKEN', 'authorization'],
    credentials: true,
  },
  // allowRequest: async (req, callback) => {
  //   try {
  //     const token = req.headers['cookie'].split('BEARER-TOKEN=')[1];
  //     const isValid = await validateJWT(token);
  //     callback(null, isValid);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers['cookie'].split('BEARER-TOKEN=')[1];
    if (!token) {
      return next(new Error('Invalid request.'));
    }
    if (await validateJWT(token)) {
      next();
    } else {
      next(new Error('Socket authentication error'));
    }
  } catch (e) {
    console.error(e);
  }
});

// Static routes
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('build', 'index.html'));
  });

  app.all('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect(`https://${req.hostname}${req.url}`);
    } else {
      next();
    }
  });

  app.use(express.static(path.resolve('build')));

  app.get(/^(?!\/?api).*/, (req, res) => {
    res.sendFile(path.resolve('build', 'index.html'));
  });
}

app.use('/api', apiRouter);

// Catch unhandled requests and forward to error handler.
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const err: any = new Error("The requested resource couldn't be found.");
  err.title = 'Resource Not Found';
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// Error formatter
app.use((err: any, _req: Request, res: Response) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

export { app, io, server };
