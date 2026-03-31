
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkEveryRepairsStatus() {
    const { data, error } = await s.from('BD_moldes').select('ESTADO, "Tipo de reparacion"');
    if (error) {
        console.log('Error:', error);
        return;
    }
    const rapidas = data.filter(d => (d['Tipo de reparacion'] || '').toLowerCase().includes('rapida'));
    const states = [...new Set(rapidas.map(d => d.ESTADO))];
    console.log('Unique states for Rapida records in DB:', states);
    
    // Check specific counts for Rapida
    const counts = rapidas.reduce((acc, d) => {
        const s = d.ESTADO || 'null';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});
    console.log('Counts per state for Rapida:', counts);
}

checkEveryRepairsStatus();
