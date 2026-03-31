
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkExactSearch() {
    const search = '0085-11';
    const term = `%${search}%`;
    const repair_type = 'Reparación rápida';
    const activeStates = [
        'En espera en moldes', 'EN ESPERA EN MOLDES', 'En espera moldes', 'En espera - Moldes',
        'En reparación', 'En reparacion', 'EN REPARACIÓN', 'EN REPARACION',
        'En espera en producción', 'En espera en produccion', 'EN ESPERA EN PRODUCCIÓN',
        'En espera producción', 'En espera produccion', 'En espera - Producción', 'En espera - Produccion'
    ];

    let query = s.from('BD_moldes').select('id, ESTADO, "Tipo de reparacion", "CODIGO MOLDE"');
    
    // Exact logic from molds.service.ts
    if (search.trim()) {
        query = query.or(`"CODIGO MOLDE".ilike.${term},"Título".ilike.${term},"DEFECTOS A REPARAR".ilike.${term},"ESTADO".ilike.${term}`);
    }
    
    query = query.in('ESTADO', activeStates);
    
    if (repair_type && repair_type !== 'Todos') {
        if (repair_type.toLowerCase().includes('rapida')) {
            query = query.ilike('Tipo de reparacion', '%rapida%');
        }
    }
    
    const { data, error } = await query;
    if (error) {
        console.log('Error found during reproduction:', error);
    } else {
        console.log('Results count:', data.length);
        console.log('Results:', data);
    }
}

checkExactSearch();
