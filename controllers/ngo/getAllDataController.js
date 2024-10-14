import Supabase from '../../configs/supabaseClient.js';

const getAllDataController=async (req, res) => {
    try {
        const { data: NGO, error } = await Supabase
        .from('NGO')
        .select('id,email,name,capacity,state,city,address');

        if (error) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error });
        }
        let filtered_NGO = []
        
        NGO.forEach(ngo => {
            if(ngo['name']!=null && ngo['city']!=null){
                filtered_NGO.push(ngo)
            }
        });
        return res.status(200).json(filtered_NGO);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export {getAllDataController}