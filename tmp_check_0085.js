
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkSpecificMold() {
    const { data, error } = await s.from('BD_moldes').select('ESTADO, "Tipo de reparacion", "CODIGO MOLDE"').ilike('CODIGO MOLDE', '%0085-11%');
    if (error) {
        console.log('Error:', error);
        return;
    }
    console.log('Results for 0085-11:', data);
}

checkSpecificMold();
