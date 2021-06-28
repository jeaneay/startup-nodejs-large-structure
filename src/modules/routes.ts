import express from 'express';
import { authRoutes } from './authentication';
import { userRoutes } from './users';

let router: express.Router = express.Router();
router = authRoutes(router);
router = userRoutes(router);

export default router;
