import Supabase from '../../configs/supabaseClient.js';

const updateProfileController = async (req, res) => {
    try {
        const { id, role } = req.user;

        if (role == 'NGO') {
            const { name, email, capacity, state, city, address } = req.body;
            const { error } = await Supabase
                .from('NGO')
                .update({ name: name, email: email, capacity: capacity, state: state, city: city, address: address })
                .eq('id', id);

            if (error) {
                return res.status(500).json({ message: 'Error fetching data from Supabase', error });
            }

            return res.status(200).json({ message: 'Updated Successfully' });
        }
        else if (role == 'faculty') {
            const { name, department } = req.body;

            const { data: deptData, error: deptError } = await Supabase
                .from('Department')
                .select('*')
                .eq('name', department)
                .single();

            if (deptError || !deptData) {
                return res.status(400).json({ message: 'Department not found.' });
            }
            const dept_id = deptData.id;

            const { error } = await Supabase
                .from('faculty')
                .update({ name: name, department_id: dept_id })
                .eq('id', id);

            if (error) {
                return res.status(500).json({ message: 'Error fetching data from Supabase', error });
            }

            return res.status(200).json({ message: 'Updated Successfully' });
        }
        else if (role == 'student') {
            const { name, rollno } = req.body;

            const { error } = await Supabase
                .from('student')
                .update({ name, rollno})
                .eq('id', id);

            if (error) {
                return res.status(500).json({ message: 'Error fetching data from Supabase', error });
            }

            return res.status(200).json({ message: 'Updated Successfully' });
        }

        return res.status(400).json({ message: 'Role not found.' });
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export { updateProfileController }