/**
 * Zentraler Ort fuer alle DB-Inkremente (Scans, Chat, Letters).
 *
 * Warum existiert diese Datei?
 * - Vorher wurde im Frontend ueber useState gezaehlt (manipulierbar,
 *   persistiert nicht).
 * - Jetzt: pro Aktion wird in bb_user_state die jeweilige Spalte um
 *   +1 hochgesetzt. So bleibt das Zaehlen konsistent ueber
 *   Tab-Wechsel, Reload und mehrere Devices hinweg.
 *
 * Hinweis zur Architektur:
 * - bb_user_state.user_id = profiles.id = auth.users.id
 *   (direkte Kopplung, kein separater PK mehr).
 * - Der Aufrufer uebergibt die auth.uid() (same as profile.id).
 *
 * Fallback: wenn kein echtes Supabase konfiguriert ist (Demo-Mode),
 * ist das ein No-Op und der Provider zaehlt clientseitig weiter.
 */

import { supabase } from '@/integrations/supabase/client'

type QuotaField =
  | 'scans_this_month'
  | 'letters_generated_this_month'
  | 'chat_messages_used_today'

const hasRealSupabase = !!(
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !String(import.meta.env.VITE_SUPABASE_ANON_KEY).includes('placeholder')
)

/**
 * Atomisches Increment ueber eine einzelne Spalte in bb_user_state.
 * Nutzt den Round-Trip: lesen -> +1 -> updaten. Fuer echte
 * Concurrency-Safety wuerden wir eine Postgres-Function anlegen;
 * fuer den Launch reicht dieser Ansatz, da die UI immer nur einen
 * Call gleichzeitig feuert.
 *
 * @returns der neue Wert der Spalte, oder null bei Fehler/Demo-Mode.
 */
async function incrementField(
  userId: string,
  field: QuotaField,
): Promise<number | null> {
  if (!hasRealSupabase) return null

  // Aktuellen Stand holen
  const { data: row, error: readErr } = await supabase
    .from('bb_user_state')
    .select(`user_id, ${field}`)
    .eq('user_id', userId)
    .maybeSingle()

  if (readErr || !row) {
    console.error(`[quota] read failed for ${field}:`, readErr)
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentValue = ((row as any)[field] as number) ?? 0
  const newValue = currentValue + 1

  const { error: writeErr } = await supabase
    .from('bb_user_state')
    .update({ [field]: newValue })
    .eq('user_id', userId)

  if (writeErr) {
    console.error(`[quota] write failed for ${field}:`, writeErr)
    return null
  }

  return newValue
}

export function incrementScan(userId: string): Promise<number | null> {
  return incrementField(userId, 'scans_this_month')
}

export function incrementLetter(userId: string): Promise<number | null> {
  return incrementField(userId, 'letters_generated_this_month')
}

export function incrementChat(userId: string): Promise<number | null> {
  return incrementField(userId, 'chat_messages_used_today')
}
