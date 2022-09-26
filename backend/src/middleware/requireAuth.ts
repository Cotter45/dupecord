import * as jwt from 'jsonwebtoken';

import { config } from '../config/env';
import type { NextFunction, Response } from 'express';
import { getUserByUsername } from '../routes/services/user.service';

const { jwtConfig } = config;
const { jwtSecret } = jwtConfig;

export async function requireAuth(req: any, res: Response, next: NextFunction) {
  const token = req.cookies['BEARER-TOKEN'];

  if (!token) {
    return res.status(401).json({
      message: 'Invalid request.',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const { username } = decoded as { username: string };

    if (!username) {
      res.clearCookie('BEARER-TOKEN');
      throw new Error('Invalid request.');
    }

    const user = await getUserByUsername(username);

    if (!user) {
      res.clearCookie('BEARER-TOKEN');
      throw new Error('Invalid request.');
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid request.',
    });
  }
  next();
}
