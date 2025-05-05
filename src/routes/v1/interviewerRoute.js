import express from 'express';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { interviewerController } from '~/controllers/interviewerController';

import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/list-candidate').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER]),
  interviewerController.getListCandidates
);
Router.route('/create-room-chat').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER]),
  interviewerController.createRoomChat
);
Router.route('/create-schedual').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER]),
  interviewerController.createSchedual
);
Router.route('/list-schedual').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER]),
  interviewerController.getListSchedual
);
export const interviewRouter = Router;
