import express from 'express';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { chatController } from '~/controllers/chatController';

import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/list-chat/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER, ROLE_USER.JOB_SEEKER]),
  chatController.getListChat
);
Router.route('/list-user-chat').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER, ROLE_USER.JOB_SEEKER]),
  chatController.getListUserChat
);
Router.route('/room-chat-details/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER, ROLE_USER.JOB_SEEKER]),
  chatController.getRoomChatDetails
);
export const chatRouter = Router;
