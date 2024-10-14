import express from 'express';
const Router = express.Router();

import { studentRegisterController } from '../controllers/auth/studentRegisterController.js';
import { signupConfirmController } from '../controllers/auth/signupConfirmController.js';
import { loginController } from '../controllers/auth/loginController.js';
import { changePasswordController } from '../controllers/auth/changePasswordController.js';
import { logoutController } from '../controllers/auth/logoutController.js';
import { getProfileController } from '../controllers/auth/getProfileController.js';
import { updateProfileController } from '../controllers/auth/updateProfileController.js';
import {verifyToken}  from "../middlewares/verifyToken.js"

Router.post('/register',studentRegisterController);
Router.get('/confirm',signupConfirmController);
Router.post('/login',loginController);
Router.post('/changePassword',verifyToken,changePasswordController);
Router.post('/logout',verifyToken,logoutController);
Router.get('/profile',verifyToken,getProfileController);
Router.post('/updateprofile',verifyToken, updateProfileController);

export default Router;