import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.warn(
    '[BescheidBoxer] Supabase ist nicht konfiguriert. Die App laeuft im Demo-Modus. ' +
    'Setze VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in deiner .env-Datei.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

export default supabase
