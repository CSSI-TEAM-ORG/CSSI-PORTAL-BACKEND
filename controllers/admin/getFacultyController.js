import Supabase from '../../configs/supabaseClient.js';

const getFacultyController=async (req, res) => {
    
    try {
        let { data: Faculty, error1 } = await Supabase
        .from('faculty')
        .select('id, email, name, department_id')
        .order('department_id', { ascending: true })
        .order('name',{ ascending: true });


        if (error1) {
            return res.status(500).json({ message: 'Error fetching data from Supabase', error1 });
        }

        if (!Faculty[0]) {
            return res.status(404).json({'message':"No Faculty found"})
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

        for (let index = 0; index < Faculty.length; index++) {
            let dept_id = Faculty[index]['department_id'];
            if(department_map[dept_id]){
                Faculty[index]['department']=department_map[dept_id]
            }
        }

        return res.status(200).json(Faculty);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export {getFacultyController}