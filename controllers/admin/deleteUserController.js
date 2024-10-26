import Supabase from '../../configs/supabaseClient.js';

const deleteUserController = async (req, res) => {
    
    try {
        let {user_id, user_type} = req.body;
        user_type = user_type.toLowerCase();
        if (user_type == 'faculty' || user_type == 'student') {
            //pass
        }
        else{
            user_type = user_type.toUpperCase();
            if (user_type != 'NGO') {
                return res.status(400).json({ message: 'Invalid User Type!'});
            }
        }
        let { data: user, error1 } = await Supabase
        .from(user_type)
        .select('*')
        .eq('id',user_id)
        .single();

        if (error1) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }

        if (!user) {
            return res.status(404).json({ message: 'Student not found.'});
        }

        const response = await Supabase
        .from(user_type)
        .delete()
        .eq('id', user_id);
        
        if(response['status']==204){
            return res.status(200).json({'message':'Deletion Successfull'});
        }
        else{
            return res.status(500).json({'message':'Deletion Unsuccessfull'});
        }
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export { deleteUserController }