import supabase from '../../configs/supabaseClient.js';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from "dotenv"
dotenv.config();

const loginController = async(req,res)=>{
    const { email, password, role } = req.body;
    
    if(role=='student'){
        const { data: user, error } = await supabase
        .from('student') 
        .select('id, email, password, is_verified')
        .eq('email', email)
        .single();
        if (error || !user) 
        return res.status(401).json({ message: 'Invalid credentials' });

        if (user.is_verified==false) 
        return res.status(401).json({ message: 'Please Confirm Your Email First' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jsonwebtoken.sign(
            { id: user.id, email: user.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' } 
        );
    
        res.cookie('authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
            sameSite: 'Lax',
        });

        return res.status(200).json({ message: 'Login successful' });
    }
    
    else if(role=='faculty'){
        const { data: user, error } = await supabase
        .from('faculty') 
        .select('id, email, password')
        .eq('email', email)
        .single();
        if (error || !user) 
        return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jsonwebtoken.sign(
            { id: user.id, email: user.email, role: 'faculty' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' } 
        );
    
        res.cookie('authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
            sameSite: 'Lax',  
            domain: 'localhost'
        });

        return res.status(200).json({ message: 'Login successful' });
    }

    else if(role=='ngo'){
        const { data: user, error } = await supabase
        .from('NGO') 
        .select('id, email, password')
        .eq('email', email) 
        .single();
        if (error || !user) 
        return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jsonwebtoken.sign(
            { id: user.id, email: user.email, role: 'NGO' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
    
        res.cookie('authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
            sameSite: 'Lax',
        });

        return res.status(200).json({ message: 'Login successful' });
    }
    else if(role.toLowerCase()=='admin'){
        const { data: user, error } = await supabase
        .from('admin') 
        .select('id, email, password')
        .eq('email', email) 
        .single();
        console.log(error)
        if (error || !user) 
        return res.status(401).json({ message: 'Invalid credentials helo' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials hi' });
        }

        const token = jsonwebtoken.sign(
            { id: user.id, email: user.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
    
        res.cookie('authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
            sameSite: 'Lax',
        });

        return res.status(200).json({ message: 'Login successful' });
    }
    res.status(401).json({ message: 'No such Account Exist!' });
}

export{loginController}