import bcrypt from 'bcrypt';
import supabase from '../../configs/supabaseClient.js';

const ngoRegisterController = async (req, res) => {
    //ROUTE FOR TESTING PURPOSE ONLY

    const {name, email, registeration_no , capacity, state, city, address, password, confirm_password} = req.body;

    if (password !== confirm_password) 
    return res.status(400).json({ message: 'Passwords do not match.'});

    const {data: existing_user} =await supabase
    .from('NGO')
    .select('*')
    .eq('email',email)
    .single();
    if(existing_user){
        return res.status(400).json({ message: 'Verified User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insert_error } = await supabase
    .from('NGO')
    .insert({
        name,
        registeration_no,
        capacity,
        state,
        city,
        address,
        email,
        password: hashedPassword,
    });

    if (insert_error)
    return res.status(500).json({ message: 'Error inserting data into database: ' + insert_error.message });

    res.status(201).json({ message: 'NGO registered successfully.'});
};

export { ngoRegisterController};