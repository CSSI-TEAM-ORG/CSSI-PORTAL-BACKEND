import bcrypt from 'bcrypt';
import supabase from '../../configs/supabaseClient.js';

const ngoRegisterController = async (req, res) => {
    const { name, capacity, state, city, address, email, password, confirm_password } = req.body;

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordPattern.test(password))
        return res.status(400).json({ message: 'Weak Password!' });

    if (password !== confirm_password)
        return res.status(400).json({ message: 'Passwords do not match.' });

    const { data: existing_user } = await supabase
        .from('NGO')
        .select('*')
        .eq('email', email)
        .single();
    if (existing_user) {
        if (existing_user.is_verified == true) {
            return res.status(400).json({ message: 'Verified NGO already exists.' });
        }
        else {
            const { error: deleteError } = await supabase
                .from('NGO')
                .delete()
                .eq('email', email)
                .single();
            if (deleteError)
                return res.status(500).json({ message: 'Error deleting existing user: ' + deleteError.message });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: auth_error } = await supabase.auth.signUp({
        email,
        password: hashedPassword,
        options: { data: { name, } }
    });
    if (auth_error)
        return res.status(400).json({ message: 'Authentication error: ' + auth_error.message });

    const { error: insert_error } = await supabase
        .from('NGO')
        .insert({
            name, 
            capacity, 
            state, 
            city, 
            address, 
            email,
            password: hashedPassword,
        });
    if (insert_error)
        return res.status(500).json({ message: 'Error inserting data into database: ' + insert_error.message });

    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
};

export { ngoRegisterController };