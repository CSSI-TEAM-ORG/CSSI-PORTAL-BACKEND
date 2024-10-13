import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
// import { Agent } from 'undici';

// const agent = new Agent({ connect: { timeout: 10000 } });  // Custom timeout settings
// const res = await fetch('https://zjnbydpwlftghwyypxan.supabase.co');  // Replace with your actual Supabase URL
// console.log(await res.json());
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
export default supabase;