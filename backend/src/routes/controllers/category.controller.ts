import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../services/category.service';
import { getServerById } from '../services/server.service';

const categoryRouter = express.Router();

// POST /api/categories
categoryRouter.post(
  '/',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { name, serverId } = req.body;

      await createCategory(name, +serverId);

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

// PATCH /api/categories/:id
categoryRouter.patch(
  '/:id(\\d+)',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { id } = req.params;
      const { name, serverId } = req.body;

      await updateCategory(+id, name);

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

// DELETE /api/categories/:id
categoryRouter.delete(
  '/:id(\\d+)',
  expressAsyncHandler(async (req: any, res) => {
    try {
      const { id } = req.params;
      const { serverId } = req.body;

      await deleteCategory(+id);

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

export { categoryRouter };
