import express from 'express';
const Router = express.Router();

import { verifyAdmin } from '../middlewares/verifyAdmin.js';
import { contactAdminController } from '../controllers/admin/contactAdminController.js';

import { getStudentController } from '../controllers/admin/getStudentController.js';
import { getFacultyController } from '../controllers/admin/getFacultyController.js';
import { getNGOController } from '../controllers/admin/getNGOController.js';

import { addStudentController } from '../controllers/admin/addStudentController.js';
import { addFacultyController } from '../controllers/admin/addFacultyController.js';
import { addNGOController } from '../controllers/admin/addNGOController.js';

import { deleteUserController } from '../controllers/admin/deleteUserController.js';

import { searchStudentController } from '../controllers/admin/searchStudentController.js';

Router.post('/contact',contactAdminController);

Router.get('/getStudent',verifyAdmin,getStudentController);
Router.get('/getFaculty',verifyAdmin,getFacultyController);
Router.get('/getNGO',verifyAdmin,getNGOController);

Router.post('/addStudent',verifyAdmin,addStudentController);
Router.post('/addFaculty',verifyAdmin,addFacultyController);
Router.post('/addNGO',verifyAdmin,addNGOController);

Router.delete('/deleteUser',verifyAdmin,deleteUserController);

Router.get('/searchStudent',verifyAdmin,searchStudentController);

export default Router;