import express from 'express';
import _ from 'lodash';
import { auth } from '../../middlewares';
import { ctrlAuth as controllers } from './';

const userRoutes = (router: express.Router): express.Router => {
  router.post('/signup', controllers.signUp);

  router.post('/signin', controllers.signIn);

  router.get('/logout', controllers.logout);

  router.get('/auth/refresh-token', controllers.refreshToken);

  router.post('/auth/send-confirm-email', controllers.sendConfirmEmail);

  router.post('/auth/active-account', controllers.activeAccount);

  router.post('/auth/forgot-password', controllers.forgotPassword);

  router.post(
    '/auth/check-token-reset-password',
    controllers.checkTokenResetPassword,
  );

  router.post('/auth/reset-password', controllers.resetPassword);

  router.get('/auth/tokens', controllers.getTokens);

  router.delete('/auth/tokens', controllers.deleteToken);

  return router;
};

export default userRoutes;
