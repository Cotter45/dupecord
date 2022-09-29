import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  createChannel,
  deleteChannel,
  updateChannel,
} from '../services/channel.service';
import { getServerById } from '../services/server.service';

const channelRouter = express.Router();

// POST /api/channels
channelRouter.post(
  '/',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { name, serverId, categoryId } = req.body;

      await createChannel(name, +serverId, +categoryId);

      const server = await getServerById(+serverId);
      res.status(200).json(server);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// PATCH /api/channels/:id
channelRouter.patch(
  '/:id(\\d+)',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { id } = req.params;
      const { name, serverId, categoryId } = req.body;

      await updateChannel(+id, name, +categoryId);

      const server = await getServerById(+serverId);
      res.status(200).json(server);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// DELETE /api/channels/:id
channelRouter.delete(
  '/:id(\\d+)',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { id } = req.params;
      const { serverId } = req.body;

      await deleteChannel(+id);

      const server = await getServerById(+serverId);
      res.status(200).json(server);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

export { channelRouter };
