
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkRepairs() {
    const { data, error } = await s.from('BD_moldes').select('"Tipo de reparacion"').not('Tipo de reparacion', 'is', null).limit(20);
    if (error) {
        console.log('Error:', error);
        return;
    }
    console.log('Unique Repair Types:', [...new Set(data.map(d => d['Tipo de reparacion']))]);
    console.log('All results:', data);
}

checkRepairs();
