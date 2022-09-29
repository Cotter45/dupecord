import express from 'express';
import { Server } from 'socket.io';
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

if (environment === 'development') {
  app.use(morgan('dev'));
  app.use(cors());
}

app.set('trust proxy', 1);
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

const io = new Server({
  path: '/socket.io',
  cors: {
    origin: ['http://localhost:5173'],
    allowedHeaders: ['BEARER-TOKEN'],
    credentials: true,
  },
  allowRequest: async (req, callback) => {
    try {
      const token = req.headers['cookie'].split('BEARER-TOKEN=')[1];
      const isValid = await validateJWT(token);
      callback(null, isValid);
    } catch (e) {
      console.error(e);
    }
  },
});

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

export { app, io };
