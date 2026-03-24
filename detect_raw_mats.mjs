
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const guesses = [
    'Materia prima moldes',
    'Materia prima',
    'materia_prima',
    'MP_Moldes',
    'Materiales',
    'base_datos_moldes',
    'moldes',
    'Unidades',
    'cat_unidades',
    'unidades_medida',
    'consumo_materia_prima',
    'movimientos_materia_prima',
    'Materia prima'
  ];
  
  for (const v of guesses) {
    try {
      const { data, error } = await supabase.from(v).select('*').limit(1);
      if (!error) {
        console.log(`--- TABLE: ${v} ---`);
        if (data && data.length > 0) {
          console.log(`Columns: ${Object.keys(data[0]).join(', ')}`);
          console.log(`Sample: ${JSON.stringify(data[0])}`);
        } else {
          console.log('Exists but EMPTY.');
        }
      }
    } catch (e) {
      // Skip errors
    }
  }
}
check();
