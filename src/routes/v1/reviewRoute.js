import express from 'express';
import { reviewController } from '~/controllers/reviewController';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER]),
  reviewController.createNew
);
Router.route('/list-reviews').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER]),
  reviewController.getListReviews
);
Router.route('/details/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.INTERVIEER]),
  reviewController.getReviewDetails
);
export const reviewRouter = Router;
