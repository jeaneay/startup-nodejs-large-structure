import express from 'express';
import _ from 'lodash';
import { ctrlAuth as controllers } from '.';

const userRoutes = (router: express.Router): express.Router => {
  router.post('/signup', controllers.signUp);

  router.post('/signin', controllers.signIn);

  router.get('/logout', controllers.logout);

  return router;
};

export default userRoutes;
