import bcrypt from 'bcrypt';
import supabase from '../../configs/supabaseClient.js';

const addNGOController = async (req, res) => {
    const {name, capacity, city, state, address, email, password, confirm_password} = req.body.data;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email))
    return res.status(400).json({ message: 'Invalid email format.' });

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordPattern.test(password)) 
    return res.status(400).json({ message: 'Password Format Invalid.' });

    if (password !== confirm_password) 
    return res.status(400).json({ message: 'Passwords do not match.'});

    const {data: existing_user} =await supabase
    .from('NGO')
    .select('*')
    .eq('email',email)
    .single();
    if(existing_user){
        return res.status(400).json({ message: 'NGO already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insert_error } = await supabase
    .from('NGO')
    .insert({
        name,
        capacity,
        city,
        state,
        address,
        email,
        password: hashedPassword,
        is_verified:true
    });
    if (insert_error)
    return res.status(500).json({ message: 'Error inserting data into database: ' + insert_error.message });

    res.status(201).json({ message: 'NGO registered successfully.' });
};

export { addNGOController};