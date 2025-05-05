import express from 'express';
import { authController } from '~/controllers/authController';
import { authValidations } from '~/validations/authValidation';
const Router = express.Router();

Router.route('/').post(authValidations.createNew, authController.createNew);
Router.route('/login').post(authValidations.login, authController.login);
Router.route('/refresh_token').get(authController.refreshToken);
Router.route('/logout').delete(authController.logout);

export const authRouter = Router;
