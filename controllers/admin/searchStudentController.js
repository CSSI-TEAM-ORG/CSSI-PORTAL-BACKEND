import Supabase from '../../configs/supabaseClient.js';

const searchStudentController = async(req, res) => {
    // SEND THE KEYWORD in BODY of GET request
    try {
        const {keyword} = req.body;
        let { data: Students, error1 } = await Supabase
        .from('student')
        .select('id, email, name, rollno, NGO, Department_id')
        .order('rollno', { ascending: true });
        
        if (error1) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }

        if (!Students) {
            return res.status(404).json({ message: 'No Student found.'});
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
            if(department_map[dept_id]){
                Students[index]['Department']=department_map[dept_id]
            }
        }

        const keywords = keyword.split(" "); 
        let filtered_students = []
        keywords.forEach(key_w => {
            let regex_keyword = new RegExp(String(key_w), 'i');
            Students.forEach(student => {
                for (const [key, value] of Object.entries(student)) {
                    if (key != 'id' && key != 'Department_id' && !(filtered_students.some(item => item === student)) && regex_keyword.test(String(value))) {
                        filtered_students.push(student);
                    }
                }
            });
        });
        

        return res.status(200).json(filtered_students);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export {searchStudentController}