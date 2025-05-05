import express from 'express';
import { jobController } from '~/controllers/jobController';
import { jobValidation } from '~/validations/jobValidation';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
import { jobMiddleware } from '~/middlewares/jobMiddleware';
const Router = express.Router();

Router.route('/').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  jobMiddleware.canCreateJob,
  jobValidation.createNew,
  jobController.createNew
);
Router.route('/list-jobs').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  jobController.getlistJobs
);
Router.route('/admin/list-jobs').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  jobController.getListJobsByAdmin
);
Router.route('/admin/chang-status/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  jobController.changStatus
);
Router.route('/delete/:id').delete(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN, ROLE_USER.EMPLOYER]),
  jobMiddleware.canDeleteGetDetailJob,
  jobController.deleteJob
);
Router.route('/user/list-jobs').get(jobController.getListJobsByUser);

Router.route('/details/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN, ROLE_USER.EMPLOYER]),
  jobMiddleware.canDeleteGetDetailJob,
  jobController.getJobDetails
);
Router.route('/user/details/:id').get(jobController.getJobDetailsByUser);
Router.route('/update/:id').put(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  jobController.update
);

export const jobRouter = Router;
