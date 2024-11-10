import Supabase from '../../configs/supabaseClient.js';

const applyNGOController= async(req,res)=>{
    const {id,role}=req.user;
    // console.log(req.body.internship)
    try{
    if(role!=="student"){
        return res.status(401).json({message:"unauthorized"})
    }
    const {data:stud,error}=await Supabase
    .from('student')
    .select('*')
    .eq('id',id)
    
    if(error){
        return res.status(501).json({message:"Error fetching data from supabase",error});
    }
    console.log(stud[0].id)
    // console.log(stud); supabase ke table me ek field add karni hai depicting student has applied for which NGO internship. 
    //student can apply only once for each NGO. if field have_applied is null then update it here to corr NGO id.
    if(stud[0].have_applied && stud[0].have_applied ==req.body.internship.id){
        return res.status(400).json({message:"You have already applied to this NGO."})
    }
    else{
        const { data:stup, error } = await Supabase
        .from('student')
        .upsert({ id:stud[0].id, have_applied: req.body.internship.id},{onConflict:"handle"})
        .select()
        console.log(stup)
    }
    if(stud[0].NGO != null){
        return res.status(400).json({message:"You have already been assigned a NGO!!!"})
    }
    return res.status(200).json({message:"successfully applied!!"})
}
catch (err) {
    console.error('Fetch failed due to:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
}

}

export {applyNGOController}