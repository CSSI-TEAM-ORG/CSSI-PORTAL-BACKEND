import Supabase from '../../configs/supabaseClient.js';

const getNGOController=async (req, res) => {
    const{id, role} =req.user;

    if (role != 'admin'){
        return res.status(401).json({ message: 'Unauthorized access: Access denied' });
    }

    try {
        let { data: NGO, error1 } = await Supabase
        .from('NGO')
        .select('id, email, name, capacity, state, city, address')
        .order('name', { ascending: true });

        if (error1) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }

        return res.status(200).json(NGO);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export {getNGOController}