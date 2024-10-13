import Supabase from '../../configs/supabaseClient.js';

const getProfileController=  async (req,res)=>{
    try {
        const{id, role} =req.user;

        const { data: profile, error } = await Supabase
        .from(`${role}`)
        .select('*')
        .eq('id',id);

        if (error) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error });
        }

        return res.status(200).json(profile);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export {getProfileController}