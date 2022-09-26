import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  deleteServer,
  getServerById,
  getServersByUserId,
  joinServer,
  newServer,
  searchServerByName,
  updateServer,
} from '../services/server.service';

const serverRouter = express.Router();

// GET /api/servers
serverRouter.get(
  '/',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const user = req.user;
      const servers = await getServersByUserId(+user.id);
      res.status(200).json(servers);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// GET /api/servers/search?name=serverName
serverRouter.get(
  '/search',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { name } = req.query;
      const servers = await searchServerByName(name);
      res.status(200).json(servers);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// POST /api/servers
serverRouter.post(
  '/',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const user = req.user;
      const { name, icon, private: privateServer } = req.body;

      const server = await newServer(name, +user.id, privateServer, icon);
      res.status(200).json(server);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'This server name is already taken.',
      });
    }
  }),
);

// POST /api/servers/:serverId/join
serverRouter.post(
  '/:serverId/join',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const user = req.user;
      const { serverId } = req.params;

      const checkPrivate = await getServerById(+serverId);

      if (checkPrivate.private) {
        throw new Error('Server is private.');
      }

      const server = await joinServer(+serverId, +user.id);
      res.status(200).json(server);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// PATCH /api/servers/:serverId
serverRouter.patch(
  '/:serverId',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { serverId } = req.params;
      const { name, icon, private: privateServer } = req.body;

      const server = await updateServer(+serverId, name, privateServer, icon);
      res.status(200).json(server);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'This server name is already taken.',
      });
    }
  }),
);

// DELETE /api/servers/:serverId
serverRouter.delete(
  '/:serverId',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { serverId } = req.params;

      const server = await deleteServer(+serverId);
      res.status(200).json(server);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

export { serverRouter };
