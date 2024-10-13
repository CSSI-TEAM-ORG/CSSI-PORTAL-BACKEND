import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import Supabase from './configs/supabaseClient.js';
import cors from 'cors';
dotenv.config();

import auth from './routes/auth.js';


const app = express();
const PORT = process.env.PORT || 5000; 
const sup=Supabase;

app.use(cors({origin:'http://localhost:3000'}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 

app.set('views', './views');
app.use(express.static('./public'));

app.get('/ngodata', async (req, res) => {
    // console.log(sup)
    try {
        const { data: NGO, error } = await Supabase
            .from('NGO')
            .select('*');

        // Log the fetched data and error (if any)
        console.log('NGO Data:', NGO);
        console.log('Error:', error);

        // Check if there's an error in fetching data
        if (error) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error });
        }

        // Send the fetched data as response
        return res.status(200).json(NGO);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
});


app.use('/auth', auth);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
