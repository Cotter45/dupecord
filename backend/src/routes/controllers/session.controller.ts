import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  createJWT,
  validatePassword,
  verifyJWT,
} from '../services/session.service';
import {
  createUser,
  getUserByUsername,
  updateUser,
} from '../services/user.service';

const sessionRouter = express.Router();

// login
sessionRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await getUserByUsername(username);
      if (!user) throw new Error('No user found');

      const isValid = await validatePassword(user.id, password);
      if (!isValid) throw new Error('Invalid password');

      const token = createJWT(user);

      res.cookie('BEARER-TOKEN', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      user.online = true;

      res.status(200).json(user);

      await updateUser({
        ...user,
        online: true,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Invalid username or password.',
      });
    }
  }),
);

// logout
sessionRouter.delete(
  '/',
  expressAsyncHandler(async (req: any, res) => {
    res.clearCookie('BEARER-TOKEN');
    res.status(200).json({
      message: 'Successfully logged out.',
    });
  }),
);

// restore session
sessionRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const token = req.cookies['BEARER-TOKEN'];
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token.');
      }
      const result = await verifyJWT(token);
      if (!result) throw new Error('Invalid token.');
      const { user, token: newToken } = result;

      res.cookie('BEARER-TOKEN', newToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000,
      });

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.clearCookie('BEARER-TOKEN');
      res.status(200).json({});
    }
  }),
);

// signup
sessionRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const userName = await getUserByUsername(username);
      if (userName) throw new Error('Username already exists');

      const userEmail = await getUserByUsername(email);
      if (userEmail) throw new Error('Email already exists');

      const user = await createUser(username, email, password);

      const token = createJWT(user);

      res.cookie('BEARER-TOKEN', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error.message,
      });
    }
  }),
);

export { sessionRouter };
