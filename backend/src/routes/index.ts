import express from 'express';
import { requireAuth } from '../middleware/requireAuth';

import { sessionRouter } from './controllers/session.controller';
import { userRouter } from './controllers/user.controller';
import { serverRouter } from './controllers/server.controller';
import { channelRouter } from './controllers/channel.controller';
import { categoryRouter } from './controllers/category.controller';

const apiRouter = express.Router();

apiRouter.use('/session', sessionRouter);

// REQUIRE AUTHENTICATION
apiRouter.use('/users', requireAuth, userRouter);
apiRouter.use('/servers', requireAuth, serverRouter);
apiRouter.use('/channels', requireAuth, channelRouter);
apiRouter.use('/categories', requireAuth, categoryRouter);

export { apiRouter };
