import Supabase from '../../configs/supabaseClient.js';

const getAllDataController=async (req, res) => {
    try {
        const { data: NGO, error } = await Supabase
        .from('NGO')
        .select('*');

        if (error) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error });
        }

        return res.status(200).json(NGO);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export {getAllDataController}