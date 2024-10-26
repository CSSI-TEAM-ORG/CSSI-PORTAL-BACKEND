import bcrypt from 'bcrypt';
import supabase from '../../configs/supabaseClient.js';

const addFacultyController = async (req, res) => {

    const {name, department, email, password, confirm_password} = req.body;

    const emailPattern = /^[a-zA-Z0-9.@]+\.pdpu\.ac\.in$/;
    if (!emailPattern.test(email))
    return res.status(400).json({ message: 'Invalid email format.' });

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordPattern.test(password)) 
    return res.status(400).json({ message: 'Password Format Invalid.' });

    if (password !== confirm_password) 
    return res.status(400).json({ message: 'Passwords do not match.'});

    const {data: existing_user} =await supabase
    .from('faculty')
    .select('*')
    .eq('email',email)
    .single();
    if(existing_user){
        return res.status(400).json({ message: 'Faculty already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: deptData, error: deptError } = await supabase
    .from('Department')
    .select('id')
    .eq('name', department)
    .single();

    if (deptError || !deptData) 
        return res.status(400).json({ message: 'Department not found.' });
    const dept_id = deptData.id;

    const { error: insert_error } = await supabase
    .from('faculty')
    .insert({
        name,
        email,
        password: hashedPassword,
        department_id : dept_id,
    });
    if (insert_error)
    return res.status(500).json({ message: 'Error inserting data into database: ' + insert_error.message });

    res.status(201).json({ message: 'Faculty registered successfully.' });
};

export { addFacultyController};