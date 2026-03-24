
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const versions = ['Defectos_moldes', 'Defectos moldes', 'BD_moldes', 'moldes'];
  for (const v of versions) {
    const { data, error } = await supabase.from(v).select('*').limit(1);
    console.log(`--- Table: ${v} ---`);
    if (error) console.log('Error:', error.message);
    else if (data && data.length > 0) {
      console.log('Columns found:', Object.keys(data[0]));
      console.log('Full Sample:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('Table found but EMPTY.');
    }
  }
}
check();
