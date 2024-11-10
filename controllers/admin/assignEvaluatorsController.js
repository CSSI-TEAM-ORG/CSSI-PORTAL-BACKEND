import Supabase from '../../configs/supabaseClient.js';

const assignEvaluatorsController = async (req, res) => {
    try {
        const { data: students, error: studentsError } = await Supabase
            .from('student')
            .select('id, "Department_id"');

        if (studentsError) {
            throw new Error(`Error fetching students: ${studentsError.message}`);
        }

        const { data: faculties, error: facultiesError } = await Supabase
            .from('faculty')
            .select('id, "department_id"');

        if (facultiesError) {
            throw new Error(`Error fetching faculties: ${facultiesError.message}`);
        }

        console.log(`Fetched ${students.length} students and ${faculties.length} faculties.`);

        const studentCount = students.length;
        const facultyCount = faculties.length;
        const maxStudentsPerFaculty = Math.ceil(studentCount / facultyCount);

        const assigned = new Array(studentCount).fill(false);
        const facultyAssignmentCount = new Array(facultyCount).fill(0);

        const assignments = [];

        for (let i = 0; i < studentCount; i++) {
            const student = students[i];
            let assignedToFaculty = false;


            for (let j = facultyCount - 1; j >= 0; j--) {
                const faculty = faculties[j];


                if (student.Department_id !== faculty.department_id && facultyAssignmentCount[j] <= maxStudentsPerFaculty) {
                    assignments.push({
                        student_id: student.id,
                        faculty_id: faculty.id,
                    });

                    assigned[i] = true;
                    facultyAssignmentCount[j]++;
                    assignedToFaculty = true;

                    break;
                }
            }

            if (!assignedToFaculty) {
                console.log(`Student ${student.id} could not be assigned to a faculty member.`);
            }
        }

        if (assignments.length > 0) {
            console.log(`Inserting ${assignments.length} assignments into the database...`);

            const { error: insertError } = await Supabase
                .from('faculty_student_evaluator')
                .upsert(assignments, { onConflict: ['faculty_id', 'student_id'] });

            if (insertError) {
                console.error('Error inserting assignments:', insertError);
                throw new Error(`Error inserting assignments: ${insertError.message}`);
            }

            return res.status(200).json({ message: 'Assignments completed successfully' });
        } else {
            console.log('No valid assignments were made.');
            return res.status(400).json({ message: 'No valid assignments were made.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export { assignEvaluatorsController };
