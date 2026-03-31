
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkVisibleStates() {
    const activeStates = [
        'En espera en moldes', 'EN ESPERA EN MOLDES', 'En espera moldes', 'En espera - Moldes',
        'En reparación', 'En reparacion', 'EN REPARACIÓN', 'EN REPARACION',
        'En espera en producción', 'En espera en produccion', 'EN ESPERA EN PRODUCCIÓN',
        'En espera producción', 'En espera produccion', 'En espera - Producción', 'En espera - Produccion'
    ];
    
    const { data: q1 } = await s.from('BD_moldes').select('ESTADO, "Tipo de reparacion"').in('ESTADO', activeStates);
    console.log('Count with state filter:', q1.length);
    
    const q1Rapidas = q1.filter(d => (d['Tipo de reparacion'] || '').toLowerCase().includes('rapida'));
    console.log('Count with state filter AND manual rapida check:', q1Rapidas.length);

    console.log('--- Test with query builder ---');
    const { data: q2 } = await s.from('BD_moldes').select('id')
        .in('ESTADO', activeStates)
        .ilike('Tipo de reparacion', '%rapida%');
    console.log('Count from query builder:', q2.length);
}

checkVisibleStates();
