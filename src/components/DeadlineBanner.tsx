/**
 * DeadlineBanner — globaler Frist-Warn-Banner.
 *
 * Liest dieselbe localStorage-Quelle wie FristAlarm
 * (`bescheidboxer_widersprueche`) und zeigt einen prominenten Banner über
 * dem Layout, sobald eine Frist <= 7 Tage entfernt oder ueberschritten ist.
 *
 * Dismiss-Status wird in sessionStorage gehalten — nach Tab-Reload taucht
 * der Banner wieder auf, falls die Frist noch akut ist.
 *
 * Adaptiert von cloud/apps/bescheidboxer/components/DeadlineBanner.tsx
 * (dort an useBescheidContext gebunden — das gibts in unserem Standalone
 * nicht, also Standalone-Read aus localStorage).
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Clock, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TrackerEntry {
  id: string
  aktenzeichen?: string
  beschreibung?: string
  status: string
  fristDatum?: string
}

interface UrgentFrist {
  id: string
  label: string
  daysLeft: number
}

const DISMISS_KEY = 'bescheidboxer_deadline_banner_dismissed'

function readDismissed(): Set<string> {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

function persistDismissed(set: Set<string>) {
  try {
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify(Array.from(set)))
  } catch { /* ignore */ }
}

function loadUrgentFristen(dismissed: Set<string>): UrgentFrist[] {
  try {
    const raw = localStorage.getItem('bescheidboxer_widersprueche')
    if (!raw) return []
    const entries: TrackerEntry[] = JSON.parse(raw)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return entries
      .filter((e) => e.fristDatum && e.status !== 'erledigt' && !dismissed.has(e.id))
      .map((e) => {
        const frist = new Date(e.fristDatum!)
        frist.setHours(0, 0, 0, 0)
        const daysLeft = Math.ceil((frist.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return {
          id: e.id,
          label: e.aktenzeichen || e.beschreibung || 'Widerspruch',
          daysLeft,
        }
      })
      .filter((f) => f.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  } catch {
    return []
  }
}

export default function DeadlineBanner() {
  const [dismissed, setDismissed] = useState<Set<string>>(() => readDismissed())
  const [urgent, setUrgent] = useState<UrgentFrist[]>(() => loadUrgentFristen(readDismissed()))

  // Re-load wenn das Tab wieder fokussiert wird (Frist-Tracker
  // koennte in einem anderen Tab geaendert worden sein).
  useEffect(() => {
    const handler = () => setUrgent(loadUrgentFristen(dismissed))
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [dismissed])

  if (urgent.length === 0) return null

  const mostUrgent = urgent[0]
  const isOverdue = mostUrgent.daysLeft < 0

  function handleDismiss() {
    const next = new Set(dismissed)
    next.add(mostUrgent.id)
    setDismissed(next)
    persistDismissed(next)
    setUrgent(loadUrgentFristen(next))
  }

  return (
    <div
      className={`mx-4 mt-3 mb-2 rounded-lg px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 ${
        isOverdue
          ? 'bg-red-50 border border-red-200'
          : 'bg-amber-50 border border-amber-200'
      }`}
      role="alert"
    >
      <div className={`shrink-0 rounded-full p-1.5 ${
        isOverdue ? 'bg-red-100' : 'bg-amber-100'
      }`}>
        {isOverdue ? (
          <AlertTriangle className="h-4 w-4 text-red-600" />
        ) : (
          <Clock className="h-4 w-4 text-amber-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${
          isOverdue ? 'text-red-800' : 'text-amber-800'
        }`}>
          {isOverdue
            ? `Frist überschritten: ${mostUrgent.label}`
            : mostUrgent.daysLeft === 0
              ? `Frist läuft heute ab: ${mostUrgent.label}`
              : `Noch ${mostUrgent.daysLeft} ${mostUrgent.daysLeft === 1 ? 'Tag' : 'Tage'}: ${mostUrgent.label}`
          }
          {urgent.length > 1 && (
            <span className="text-muted-foreground ml-1">
              (+{urgent.length - 1} weitere)
            </span>
          )}
        </p>
        <p className="text-[10px] text-muted-foreground/80 mt-0.5">
          Schätzung — bitte mit der Rechtsbehelfsbelehrung auf deinem Bescheid abgleichen.
        </p>
      </div>

      <Link to="/tracker">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 shrink-0 ${
            isOverdue ? 'text-red-700 hover:text-red-800' : 'text-amber-700 hover:text-amber-800'
          }`}
        >
          Anzeigen <ArrowRight className="h-3 w-3" />
        </Button>
      </Link>

      <button
        onClick={handleDismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Hinweis schliessen"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
