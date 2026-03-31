
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkVisibleStatesSimple() {
    const activeStates = [
        'En espera en moldes', 'EN ESPERA EN MOLDES', 'En espera moldes', 'En espera - Moldes',
        'En reparación', 'En reparacion', 'EN REPARACIÓN', 'EN REPARACION',
        'En espera en producción', 'En espera en produccion', 'EN ESPERA EN PRODUCCIÓN',
        'En espera producción', 'En espera produccion', 'En espera - Producción', 'En espera - Produccion'
    ];
    
    const { data: q1 } = await s.from('BD_moldes').select('id, ESTADO, "Tipo de reparacion"').in('ESTADO', activeStates);
    console.log('TOTAL ACTIVE (Todos):', q1.length);
    
    const rapidas = q1.filter(d => (d['Tipo de reparacion'] || '').toLowerCase().includes('rapida'));
    console.log('TOTAL ACTIVE AND RAPIDA (Manual):', rapidas.length);

    const { data: q2 } = await s.from('BD_moldes').select('id').in('ESTADO', activeStates).ilike('Tipo de reparacion', '%rapida%');
    console.log('TOTAL ACTIVE AND RAPIDA (Supabase):', q2.length);
}

checkVisibleStatesSimple();
