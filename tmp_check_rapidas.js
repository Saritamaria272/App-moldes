
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkRapidas() {
    const { data, error } = await s.from('BD_moldes').select('ESTADO, "Tipo de reparacion"').ilike('Tipo de reparacion', '%rapida%');
    if (error) {
        console.log('Error:', error);
        return;
    }
    const states = [...new Set(data.map(d => d.ESTADO))];
    console.log('States for Rapida repairs:', states);
    console.log('Count:', data.length);
}

checkRapidas();
