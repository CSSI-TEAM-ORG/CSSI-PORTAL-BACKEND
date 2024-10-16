import express from 'express';
const Router = express.Router();

import { contactAdminController } from '../controllers/admin/contactAdminController.js';

Router.post('/contact',contactAdminController);

export default Router;