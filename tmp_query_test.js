
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testQuery() {
    // Attempt 1: With explicit double quotes in string
    console.log('--- Test 1: ilike(\"\\"Tipo de reparacion\\"\", \"%rapida%\") ---');
    const q1 = await s.from('BD_moldes').select('id').ilike('"Tipo de reparacion"', '%rapida%').limit(1);
    if (q1.error) console.log('Error 1:', q1.error);
    else console.log('Result 1 count:', q1.data.length);

    // Attempt 2: Without quotes (using spaces as is)
    console.log('--- Test 2: ilike(\"Tipo de reparacion\", \"%rapida%\") ---');
    const q2 = await s.from('BD_moldes').select('id').ilike('Tipo de reparacion', '%rapida%').limit(1);
    if (q2.error) console.log('Error 2:', q2.error);
    else console.log('Result 2 count:', q2.data.length);
}

testQuery();
