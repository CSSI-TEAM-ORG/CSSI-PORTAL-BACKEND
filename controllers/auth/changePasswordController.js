import supabase from '../../configs/supabaseClient.js';
import bcrypt from 'bcrypt';

const changePasswordController= async(req,res)=>{
    const{old_password, new_password} =req.body;
    const{id, role} =req.user;

    const { data: user, error } = await supabase
    .from(`${role}`) 
    .select('password')
    .eq('id', id)
    .single();
    if (error || !user) 
    return res.status(401).json({ message: 'No such user Found' });

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Old Password' });
    }

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordPattern.test(new_password)) 
    return res.status(400).json({ message: 'Weak Password!' });

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const { error: updateError } = await supabase
    .from(`${role}`)
    .update({ password: hashedPassword })
    .eq('id', id)
    if(updateError)res.status(500).json({ message: 'Error Updating password' });

    res.status(200).json({ message: 'Password changed successfully!' });
}

export {changePasswordController}