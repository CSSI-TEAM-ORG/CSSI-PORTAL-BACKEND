import express from 'express';
const Router = express.Router();

import { verifyToken } from "../middlewares/verifyToken.js"
import { mentorController } from '../controllers/faculty/mentor.js';
import { evaluatorController } from '../controllers/faculty/evaluator.js';

Router.get('/mentor', verifyToken, mentorController);
Router.get('/evaluator', verifyToken, evaluatorController);

export default Router;