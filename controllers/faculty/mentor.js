import Supabase from '../../configs/supabaseClient.js';

const mentorController = async (req, res) => {

    try {
        const { id, role } = req.user;

        if (role != 'faculty') {
            return res.status(401).json({ message: 'UnAuthorized' });
        }

        let { data: student_ids, error1 } = await Supabase
            .from('faculty-student-mentor')
            .select('student_id')
            .eq('faculty_id', id);

        if (error1) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }

        const mappedID = student_ids.map(id => id.student_id);

        let { data: students, error2 } = await Supabase
            .from('student')
            .select('*')
            .in('id', mappedID);

        if (error2) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }

        return res.status(200).json(students);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export { mentorController }