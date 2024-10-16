import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
dotenv.config();

import auth from './routes/auth.js';
import ngo from './routes/ngo.js';
import admin from './routes/admin.js';
import corsOptions from './configs/corsOptions.js';

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 
app.use(corsOptions);

app.set('views', './views');
app.use(express.static('./public'));

app.use('/ngo',ngo);
app.use('/auth',auth);
app.use('/admin',admin);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
