import express from 'express';

import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

/** Admin */
Router.route('/admin/create').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userValidation.createNew,
  userController.createNew
);
Router.route('/edit/:id').put(
  authMiddleware.isAuthorized,
  authMiddleware.canEditUser,
  userController.update
);
Router.route('/').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.getListUser
);
Router.route('/delete/:id').delete(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.deleteUser
);
Router.route('/statistic').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.statistic
);

Router.route('/details/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.getDetailUser
);
/** Admin */

/** Employer */
Router.route('/employer/statistic').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  userController.statisticByEmployer
);
Router.route('/employer/list-candidate').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  userController.getListCandidate
);
/** Employer */

Router.route('/list-employer').get(authMiddleware.isAuthorized, userController.getListEmployer);
export const userRouter = Router;
