import express from 'express';
const Router = express.Router();

import { studentRegisterController } from '../controllers/studentRegisterController.js';
import { signupConfirmController } from '../controllers/signupConfirmController.js';
import { loginController } from '../controllers/loginController.js';
import { changePasswordController } from '../controllers/changePasswordController.js';
import { logoutController } from '../controllers/logoutController.js';
import {verifyToken}  from "../middlewares/verifyToken.js"

Router.post('/register',studentRegisterController);
Router.get('/confirm',signupConfirmController);
Router.post('/login',loginController);
Router.post('/changePassword',verifyToken,changePasswordController);
Router.post('/logout',verifyToken,logoutController);

export default Router;