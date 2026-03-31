
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkEveryRepairsStatusDetail() {
    const { data, error } = await s.from('BD_moldes')
        .select('ESTADO, "Tipo de reparacion"')
        .not('Tipo de reparacion', 'is', null)
        .limit(100);
    if (error) {
        console.log('Error:', error);
        return;
    }
    const uniqueTypes = [...new Set(data.map(d => d['Tipo de reparacion']))];
    console.log('Unique Repair Types found:', uniqueTypes);
    
    // Check for "rapida" or "Rápida" or "reparación rápida"
    const rapidaRecords = data.filter(d => (d['Tipo de reparacion'] || '').toLowerCase().includes('rapida'));
    console.log('Found ', rapidaRecords.length, ' rapida records in first 100 sample');
    if (rapidaRecords.length > 0) {
        console.log('Example rapida record:', rapidaRecords[0]);
    }
}

checkEveryRepairsStatusDetail();
