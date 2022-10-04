import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  createChannelMessage,
  deleteMessage,
  getMessagesByChannelId,
  updateMessage,
} from '../services/message.service';

const messageRouter = express.Router();

// GET /api/messages/:id
messageRouter.get(
  '/:id(\\d+)/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { skip, take } = req.query;
      const messages = await getMessagesByChannelId(+id, +skip, +take);
      res.status(200).json({ messages, channelId: id });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// POST /api/messages
messageRouter.post(
  '/channel',
  expressAsyncHandler(async (req, res) => {
    try {
      const { content, authorId, channelId, attachment } = req.body;

      const message = await createChannelMessage(
        content,
        +authorId,
        +channelId,
        attachment,
      );

      res.status(200).json(message);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// PATCH /api/messages/:id
messageRouter.patch(
  '/:id(\\d+)/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const newMessage = await updateMessage(+id, content);

      res.status(200).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

// DELETE /api/messages/:id
messageRouter.delete(
  '/:id(\\d+)/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const message = await deleteMessage(+id);

      res.status(200).json(message);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Something went wrong.',
      });
    }
  }),
);

export { messageRouter };
