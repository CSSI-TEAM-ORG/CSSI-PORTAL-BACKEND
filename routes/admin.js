import express from 'express';
const Router = express.Router();

import {verifyToken}  from "../middlewares/verifyToken.js"
import { contactAdminController } from '../controllers/admin/contactAdminController.js';

import { getStudentController } from '../controllers/admin/getStudentController.js';
import { getFacultyController } from '../controllers/admin/getFacultyController.js';
import { getNGOController } from '../controllers/admin/getNGOController.js';

import { addStudentController } from '../controllers/admin/addStudentController.js';
import { addFacultyController } from '../controllers/admin/addFacultyController.js';
import { addNGOController } from '../controllers/admin/addNGOController.js';

Router.post('/contact',contactAdminController);

Router.get('/getStudent',verifyToken,getStudentController);
Router.get('/getFaculty',verifyToken,getFacultyController);
Router.get('/getNGO',verifyToken,getNGOController);

Router.post('/addStudent',verifyToken,addStudentController);
Router.post('/addFaculty',verifyToken,addFacultyController);
Router.post('/addNGO',verifyToken,addNGOController);

export default Router;