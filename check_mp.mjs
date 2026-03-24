
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function check() {
  const ts = ['Materia prima moldes', 'Materia_prima_moldes', 'Entradas_salidas_MP'];
  for (const t of ts) {
    const { data, error } = await client.from(t).select('*').limit(1);
    console.log(`--- ${t} ---`);
    if (error) console.log('ERROR:', error.message);
    else if (data && data.length > 0) {
      console.log('KEYS:', Object.keys(data[0]));
      console.log('SAMPLE:', JSON.stringify(data[0]));
    } else {
      console.log('EMPTY');
    }
  }
}
check();
