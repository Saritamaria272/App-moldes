
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://vuiuorjzonpyobpelyld.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aXVvcmp6b25weW9icGVseWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4MDM2OTksImV4cCI6MjAyMjM3OTY5OX0.ARDJuGYox9CY3K8z287nEEFBmWVLTs6yCLkHHeMMTKw'
)

async function run() {
    const { data, error } = await supabase.from('moldes').select('*').limit(1)
    console.log("moldes exists:", !error)
    
    // Check if table name is slightly different
    const { data: data2, error: error2 } = await supabase.from('historico moldes').select('*', { count: 'exact', head: true })
    console.log("historico moldes exists:", !error2, error2?.message)
    
    const { data: data3, error: error3 } = await supabase.from('histórico_moldes').select('*', { count: 'exact', head: true })
    console.log("histórico_moldes exists:", !error3, error3?.message)
}
run()
