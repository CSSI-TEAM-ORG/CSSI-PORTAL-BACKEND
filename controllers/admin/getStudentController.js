import Supabase from '../../configs/supabaseClient.js';

const getStudentController = async (req, res) => {

    try {
        let { data: Students, error1 } = await Supabase
            .from('student')
            .select('id, email, name, rollno, Department_id')
            .order('rollno', { ascending: true });

        if (error1) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }
        if (!Students[0]) {
            return res.status(404).json({ 'message': "No Student found" });
        }

        const { data: Department, error2 } = await Supabase
            .from('Department')
            .select('id,name');

        if (error2) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error2 });
        }
        let department_map = {};
        Department.forEach(dept => {
            department_map[dept['id']] = dept['name'];
        });

        for (let index = 0; index < Students.length; index++) {
            let dept_id = Students[index]['Department_id'];
            if (department_map[dept_id]) {
                Students[index]['Department'] = department_map[dept_id]
            }
        }
        return res.status(200).json(Students);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export { getStudentController }