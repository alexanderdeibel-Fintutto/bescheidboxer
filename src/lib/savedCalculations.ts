/**
 * Saved Calculations System — User speichert Rechner-Ergebnisse persistent.
 *
 * Adaptiert von cloud/apps/fintutto-portal/src/lib/savedCalculations.ts.
 * BescheidBoxer-Variante:
 *   - Save-Limits an unsere PlanType (schnupperer/starter/kämpfer/vollschutz)
 *   - localStorage-only für den Anfang (Supabase-Sync spaeter)
 *   - Tool-Namen der 13 BescheidBoxer-Rechner
 */
import type { PlanType } from './credits'

export type ToolType = 'rechner' | 'checker' | 'formular'

export interface SavedCalculation {
  id: string
  userId?: string         // optional für LocalStorage-only-Mode
  toolId: string
  toolType: ToolType
  toolName: string
  inputData: Record<string, unknown>
  resultData: Record<string, unknown>
  savedAt: string
  updatedAt: string
  notes?: string
}

/**
 * Speicher-Limits pro Plan. -1 = unlimited.
 * Schnupperer kann nichts speichern (Conversion-Anreiz).
 */
export const SAVE_LIMITS: Record<PlanType, number> = {
  schnupperer: 0,
  starter: 5,
  kaempfer: 25,
  vollschutz: -1,
}

export interface SaveCheckResult {
  allowed: boolean
  reason?: string
  limit: number
  remaining: number
}

export function canSaveCalculation(
  plan: PlanType,
  currentSavedCount: number,
): SaveCheckResult {
  const limit = SAVE_LIMITS[plan]

  if (limit === 0) {
    return {
      allowed: false,
      reason: 'Berechnungen speichern ist im Schnupperer-Plan nicht enthalten. Upgrade auf Starter (5 Speicherungen) oder hoeher.',
      limit: 0,
      remaining: 0,
    }
  }

  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 }
  }

  if (currentSavedCount >= limit) {
    return {
      allowed: false,
      reason: `Limit von ${limit} gespeicherten Berechnungen erreicht. Upgrade auf den naechsthoeheren Plan für mehr Speicherplatz.`,
      limit,
      remaining: 0,
    }
  }

  return {
    allowed: true,
    limit,
    remaining: limit - currentSavedCount,
  }
}

const STORAGE_KEY = 'bescheidboxer_saved_calculations'

export function getSavedCalculations(): SavedCalculation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? (JSON.parse(data) as SavedCalculation[]) : []
  } catch {
    return []
  }
}

export function saveCalculation(
  calc: Omit<SavedCalculation, 'id' | 'savedAt' | 'updatedAt'>,
): SavedCalculation {
  const saved = getSavedCalculations()
  const newCalc: SavedCalculation = {
    ...calc,
    id: `calc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  saved.unshift(newCalc)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch { /* quota - ignore */ }
  return newCalc
}

export function updateCalculation(
  id: string,
  updates: Partial<SavedCalculation>,
): SavedCalculation | null {
  const saved = getSavedCalculations()
  const index = saved.findIndex((c) => c.id === id)
  if (index === -1) return null
  saved[index] = {
    ...saved[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch { /* ignore */ }
  return saved[index]
}

export function deleteCalculation(id: string): boolean {
  const saved = getSavedCalculations()
  const filtered = saved.filter((c) => c.id !== id)
  if (filtered.length === saved.length) return false
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch { /* ignore */ }
  return true
}

export function getSavedCalculationsByTool(toolId: string): SavedCalculation[] {
  return getSavedCalculations().filter((c) => c.toolId === toolId)
}

/**
 * Display-Names für alle 13 BescheidBoxer-Rechner
 * (Alignment mit /src/pages/rechner/*.tsx).
 */
const TOOL_NAMES: Record<string, string> = {
  buergergeld: 'Bürgergeld-Rechner',
  einkommen: 'Einkommens-Anrechnungs-Rechner',
  erstausstattung: 'Erstausstattungs-Rechner',
  freibetrag: 'Freibetrags-Rechner',
  fristen: 'Fristen-Rechner',
  haushalt: 'Haushalts-Rechner',
  kdu: 'KdU-Rechner (Kosten der Unterkunft)',
  mehrbedarf: 'Mehrbedarfs-Rechner',
  mietspiegel: 'Mietspiegel-Rechner',
  pkh: 'PKH-Rechner (Prozesskostenhilfe)',
  sanktionen: 'Sanktions-Rechner',
  schonvermoegen: 'Schonvermögens-Rechner',
  umzugskosten: 'Umzugskosten-Rechner',
}

export function getToolDisplayName(toolId: string): string {
  return TOOL_NAMES[toolId] || toolId
}
