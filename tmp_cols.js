
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkCols() {
    const { data } = await s.from('BD_moldes').select('*').limit(1);
    console.log('Columns in BD_moldes:', Object.keys(data[0]));
}

checkCols();
