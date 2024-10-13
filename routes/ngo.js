import express from 'express';
const Router = express.Router();

import {getAllDataController} from '../controllers/ngo/getAllDataController.js';
import {verifyToken}  from "../middlewares/verifyToken.js"

Router.get('/allData',verifyToken, getAllDataController);

export default Router;