import multer from 'multer';
import express from 'express';
const Router = express.Router();

import { checkSingleFileUpload } from "../middlewares/checkSingleFileUpload.js"
import { uploadImageController } from "../controllers/media/uploadImageController.js"

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('file'); 

Router.post('/image', upload, checkSingleFileUpload, uploadImageController);

export default Router;