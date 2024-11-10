import Supabase from '../../configs/supabaseClient.js';

const searchNGOController = async (req, res) => {
    try {
        const keyword = req.query.data;

        let { data: NGO, error1 } = await Supabase
            .from('NGO')
            .select('id, email, name, capacity, state, city, address')
            .order('name', { ascending: true });

        if (error1) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }

        if (!NGO) {
            return res.status(404).json({ message: 'No NGO found.' });
        }

        const keywords = keyword.split(" ");
        let filtered_ngo = []
        keywords.forEach(key_w => {
            let regex_keyword = new RegExp(String(key_w), 'i');
            NGO.forEach(ngo => {
                for (const [key, value] of Object.entries(ngo)) {
                    if (key != 'id' && !(filtered_ngo.some(item => item === ngo)) && regex_keyword.test(String(value))) {
                        filtered_ngo.push(ngo);
                    }
                }
            });
        });

        if (!filtered_ngo[0]) {
            return res.status(404).json({ 'message': "No NGO found" })
        }

        return res.status(200).json(filtered_ngo);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export { searchNGOController }