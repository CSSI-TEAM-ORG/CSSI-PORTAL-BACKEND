import express from 'express';
const Router = express.Router();

import {getAllDataController} from '../controllers/ngo/getAllDataController.js';

Router.get('/allData', getAllDataController);

export default Router;