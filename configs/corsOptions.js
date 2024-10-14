import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:3000',  
    credentials: true,  
};

export default cors(corsOptions);
