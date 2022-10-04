import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  createLike,
  deleteLike,
  getLikedMessages,
} from '../services/like.service';

const likeRouter = express.Router();

// GET /api/likes/:id
likeRouter.get(
  '/:id(\\d+)',
  expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const likes = await getLikedMessages(parseInt(id, 10));
      res.status(200).json(likes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }),
);

// POST /api/likes
likeRouter.post(
  '/like',
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId, messageId } = req.body;
      await createLike(+userId, +messageId);
      res.status(200).json({ messageId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }),
);

// DELETE /api/likes/:id
likeRouter.delete(
  '/unlike',
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId, messageId } = req.body;
      await deleteLike(+userId, +messageId);
      res.status(200).json({ messageId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }),
);

export { likeRouter };
