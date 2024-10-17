import Supabase from '../../configs/supabaseClient.js';

const getProfileController = async (req, res) => {
    try {
        const { id, role } = req.user;

        const { data: profile, error } = await Supabase
            .from(role) 
            .select('*')
            .eq('id', id);

        if (error) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error });
        }

        if (profile.length > 0) {
            let dept_name=null;
            if(role!="NGO"){
                const department_id= role=='student'? profile[0].Department_id : profile[0].department_id;

                const { data: deptData, error: deptError } = await Supabase
                .from('Department')
                .select('name')
                .eq('id', department_id)
                .single();

                if (deptError || !deptData) 
                    return res.status(400).json({ message: 'Department not found.' });
                dept_name= deptData.name;
            }

            return res.status(200).json({
                ...profile[0], 
                role: role,
                department:dept_name, 
            });
        } else {
            return res.status(404).json({ message: 'Profile not found' });
        }

    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

export { getProfileController };