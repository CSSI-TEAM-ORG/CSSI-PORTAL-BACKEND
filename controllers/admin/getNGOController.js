import Supabase from '../../configs/supabaseClient.js';

const getNGOController=async (req, res) => {
    const{id, role} =req.user;
    // console.log(req)
    const data=req.query?.data;
    const searchBy=req.query?.searchBy;
    // console.log(data)
    // console.log(searchBy)
    if (role != 'admin'){
        return res.status(401).json({ message: 'Unauthorized access: Access denied' });
    }

    try {
        let obj={};
        if(data && searchBy){
            obj=await Supabase
            .from('NGO')
            .select('id,email,name,capacity,state,city,address')
            .eq(searchBy,data)
            .order('name',{ascending:true})
        }
        else{
            obj= await Supabase
        .from('NGO')
        .select('id, email, name, capacity, state, city, address')
        .order('name', { ascending: true });
        }
        console.log("hi ")
        console.log(obj)

        if (obj.error) {
            return res.status(500).json({ message: 'Error fetching data from Supabase',  });
        }

        return res.status(200).json(obj.data);
    } catch (err) {
        console.error('Fetch failed due to:', err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

export {getNGOController}