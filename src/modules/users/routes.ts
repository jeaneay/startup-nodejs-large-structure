import express from 'express';
import _ from 'lodash';
import { auth } from '../../middlewares';
import controllers from './controllers';

const userRoutes = (router: express.Router): express.Router => {
  // USER
  router.get('/users/:id', auth.authenticate, controllers.getUser);
  router.patch('/users/:id', auth.authenticate, controllers.updateUser);
  router.delete('/users/:id', auth.authenticate, controllers.deleteUser);

  return router;
};

export default userRoutes;
