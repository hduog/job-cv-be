import express from 'express';
import { contractController } from '~/controllers/contractController';
import { contractValidation } from '~/validations/contractValidation';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.authorize(ROLE_USER.ADMIN),
    contractController.getListContract
  )
  .post(
    authMiddleware.isAuthorized,
    authMiddleware.authorize(ROLE_USER.EMPLOYER),
    contractValidation.createNew,
    contractController.createNew
  );
Router.route('/change-status/:id').put(
  authMiddleware.isAuthorized,
  authMiddleware.authorize(ROLE_USER.ADMIN),
  contractController.changStatus
);
Router.route('/delete/:id').delete(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  contractController.deleteContract
);
Router.route('/details/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  contractController.getContractDetails
);
Router.route('/employer').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize(ROLE_USER.EMPLOYER),
  contractController.getDetailsByEmployer
);
Router.route('/edit/:id').put(
  authMiddleware.isAuthorized,
  authMiddleware.authorize(ROLE_USER.EMPLOYER),
  contractController.editContract
);
export const contractRouter = Router;
