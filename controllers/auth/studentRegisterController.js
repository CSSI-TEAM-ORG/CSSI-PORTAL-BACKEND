import bcrypt from 'bcrypt';
import supabase from '../../configs/supabaseClient.js';

const studentRegisterController = async (req, res) => {
    const {name, rollno, department, email, password, confirm_password} = req.body;

    const emailPattern = /^[a-zA-Z0-9._%+-]+\.pdpu\.ac\.in$/;
    if (!emailPattern.test(email))
    return res.status(400).json({ message: 'Invalid email format.' });

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordPattern.test(password)) 
    return res.status(400).json({ message: 'Password Format Invalid.' });

    if (password !== confirm_password) 
    return res.status(400).json({ message: 'Passwords do not match.'});

    const {data: existing_user} =await supabase
    .from('student')
    .select('*')
    .eq('email',email)
    .single();
    if(existing_user){
        if(existing_user.is_verified=='TRUE'){
            return res.status(400).json({ message: 'Verified User already exists.' });
        }
        else{
            const { error: deleteError } = await supabase
            .from('student')
            .delete()
            .eq('email',email)
            .single();
            if (deleteError)
            return res.status(500).json({ message: 'Error deleting existing user: ' + deleteError.message });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const {error:auth_error}=await supabase.auth.signUp({
        email,
        password : hashedPassword,
        options: {data: {name,}}
    });
    if (auth_error) 
    return res.status(400).json({ message: 'Authentication error: ' + auth_error.message });

    const { data: deptData, error: deptError } = await supabase
    .from('Department')
    .select('id')
    .eq('name', department)
    .single();

    if (deptError || !deptData) 
        return res.status(400).json({ message: 'Department not found.' });
    const dept_id = deptData.id;

    const { error: insert_error } = await supabase
    .from('student')
    .insert({
        name,
        rollno,
        email,
        password: hashedPassword,
        Department_id : dept_id,
    });
    if (insert_error)
    return res.status(500).json({ message: 'Error inserting data into database: ' + insert_error.message });

    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
};

export { studentRegisterController};