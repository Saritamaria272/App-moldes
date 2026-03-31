
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testIn() {
    console.log('--- Test in(\"\\"ESTADO\\"\", ...) ---');
    const q1 = await s.from('BD_moldes').select('id').in('"ESTADO"', ['En reparacion']).limit(1);
    if (q1.error) console.log('Error 1:', q1.error);
    else console.log('Result 1 count:', q1.data.length);

    console.log('--- Test in(\"ESTADO\", ...) ---');
    const q2 = await s.from('BD_moldes').select('id').in('ESTADO', ['En reparacion']).limit(1);
    if (q2.error) console.log('Error 2:', q2.error);
    else console.log('Result 2 count:', q2.data.length);
}

testIn();
