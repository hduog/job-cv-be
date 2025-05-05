import express from 'express';
import { complainController } from '~/controllers/complainController';
import { complainValidation } from '~/validations/complainValidation';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.authorize([ROLE_USER.ADMIN]),
    complainController.getListComplain
  )
  .post(
    authMiddleware.isAuthorized,
    authMiddleware.authorize([ROLE_USER.JOB_SEEKER]),
    complainValidation.createNew,
    complainController.createNew
  );
Router.route('/resolve/:id').put(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  complainController.resolve
);
Router.route('/details/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  complainController.getDetailsComplain
);
Router.route('/delete/:id').delete(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  complainController.deleteComplain
);
export const complainRouter = Router;
