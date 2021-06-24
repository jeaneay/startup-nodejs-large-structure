import express from 'express';
import _ from 'lodash';
import { auth, upload } from '../../middlewares';
import controllers from './controllers';

const userRoutes = (router: express.Router): express.Router => {
  // USER RESSOURCES
  router.post(
    '/users/:id/first-connection',
    auth.authenticate,
    upload.multipleEncryptFiles,
    controllers.createFirstConnection,
  );
  router.post(
    '/users/:id/professional-experiences',
    auth.authenticate,
    controllers.createUserProfessionalExperiences,
  );

  router.put(
    '/users/:id/change-password',
    auth.authenticate,
    controllers.changePassword,
  );
  router.put(
    '/users/:id/avatar',
    auth.authenticate,
    upload.singleAvatar,
    controllers.uploadUserAvatar,
  );
  router.put(
    '/users/:id/skills',
    auth.authenticate,
    controllers.createUserSkills,
  );
  router.put(
    '/users/:id/main-industries',
    auth.authenticate,
    controllers.updateUserMainIndustries,
  );
  router.put(
    '/users/:id/other-industries',
    auth.authenticate,
    controllers.updateUserOtherIndustries,
  );
  router.put(
    '/users/:id/competences',
    auth.authenticate,
    controllers.updateUserCompetences,
  );
  router.put(
    '/users/:id/professional-experiences',
    auth.authenticate,
    controllers.updateUserProfessionalExperiences,
  );
  router.put(
    '/users/:id/target-countries',
    auth.authenticate,
    controllers.updateUserTargetCountries,
  );
  router.put(
    '/users/:id/requirements',
    auth.authenticate,
    controllers.updateUserRequirements,
  );

  router.delete(
    '/users/:id/skills/:skillId',
    auth.authenticate,
    controllers.deleteUserSkills,
  );
  router.delete(
    '/users/:id/professional-experiences/:proExpId',
    auth.authenticate,
    controllers.deleteUserProfessionalExperiences,
  );

  // USER
  router.get('/users/me', auth.authenticate, controllers.getMe);
  router.get('/users', controllers.getUsers);
  router.get('/users/:id', auth.authenticate, controllers.getUser);
  router.patch('/users/:id', auth.authenticate, controllers.updateUser);
  router.delete('/users/:id', auth.authenticate, controllers.deleteUser);

  return router;
};

export default userRoutes;
