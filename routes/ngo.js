import express from 'express';
const Router = express.Router();

import {getAllDataController} from '../controllers/ngo/getAllDataController.js';
import {verifyToken}  from "../middlewares/verifyToken.js"

import {ngoRegisterController} from '../controllers/ngo/ngoRegisterController.js';

Router.get('/allData',verifyToken, getAllDataController);

//ROUTE FOR BACKEND TESTING
Router.post('/registerngo',ngoRegisterController);

export default Router;