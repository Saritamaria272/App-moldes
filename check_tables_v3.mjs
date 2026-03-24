
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  try {
    const { data: cols1, error: err1 } = await supabase.from('BD_moldes').select('*').limit(1);
    const { data: cols2, error: err2 } = await supabase.from('Defectos_moldes').select('*').limit(1);
    
    console.log('--- BD_moldes ---');
    if (err1) console.error(err1.message);
    else console.log('Columns:', cols1 && cols1.length > 0 ? Object.keys(cols1[0]) : 'Empty');

    console.log('--- Defectos_moldes ---');
    if (err2) console.error(err2.message);
    else console.log('Columns:', cols2 && cols2.length > 0 ? Object.keys(cols2[0]) : 'Empty');

    // Sampling one record of Defectos to see structure
    if (cols2 && cols2.length > 0) {
      console.log('Sample Defecto:', cols2[0]);
    }

  } catch (e) {
    console.error(e);
  }
}
check();
