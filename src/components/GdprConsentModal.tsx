/**
 * GdprConsentModal — Pflicht-Modal vor erstem Bescheid-Upload.
 *
 * Holt die ausdrückliche Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO ein
 * (Bescheide enthalten Sozial-/Gesundheitsdaten) plus die Kenntnisnahme des
 * RDG-Disclaimers (kein Rechtsberatungs-Verhältnis).
 *
 * Persistierung in localStorage (sofort) und in bb_user_state.gdpr_consent_at
 * via Supabase (best effort, blockiert nicht).
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

const CONSENT_KEY = 'bescheidboxer_gdpr_art9_consent_v1'

/** Hat dieser Browser/User bereits eingewilligt? */
export function hasGdprConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'true'
  } catch {
    return false
  }
}

interface Props {
  open: boolean
  onAccept: () => void
  onCancel: () => void
}

export default function GdprConsentModal({ open, onAccept, onCancel }: Props) {
  const { user } = useAuth()
  const [art9, setArt9] = useState(false)
  const [rdg, setRdg] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Reset wenn Modal neu geöffnet wird
    if (open) {
      setArt9(false)
      setRdg(false)
    }
  }, [open])

  if (!open) return null

  const canAccept = art9 && rdg

  const handleAccept = async () => {
    if (!canAccept) return
    setSubmitting(true)
    const ts = new Date().toISOString()

    // 1. localStorage sofort (blockiert nicht)
    try {
      localStorage.setItem(CONSENT_KEY, 'true')
      localStorage.setItem(`${CONSENT_KEY}_at`, ts)
    } catch (err) {
      console.warn('localStorage GDPR-Consent fehlgeschlagen:', err)
    }

    // 2. Supabase best effort (blockiert auch nicht)
    if (user) {
      try {
        await supabase
          .from('bb_user_state')
          .update({ gdpr_consent_at: ts })
          .eq('user_id', user.id)
      } catch (err) {
        console.warn('GDPR-Consent in Supabase nicht persistiert:', err)
      }
    }

    setSubmitting(false)
    onAccept()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                Bevor du loslegst
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Zwei kurze Bestätigungen — einmalig, dann nie wieder.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Checkbox 1: Art. 9 DSGVO */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={art9}
              onChange={(e) => setArt9(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
            />
            <div className="text-sm">
              <strong className="text-foreground">
                Einwilligung zur Verarbeitung sensibler Daten (Art. 9 DSGVO)
              </strong>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                Mein Bescheid kann besondere Kategorien personenbezogener Daten
                enthalten — z.&nbsp;B. Gesundheitsdaten (Mehrbedarf wegen
                Krankheit/Behinderung) oder Sozialdaten i.&nbsp;S.&nbsp;v.
                §&nbsp;67&nbsp;SGB&nbsp;X. Ich willige ausdrücklich ein, dass
                BescheidBoxer diese Daten zur KI-Analyse temporär verarbeitet
                und an{' '}
                <strong className="text-foreground">Anthropic (USA)</strong>{' '}
                übermittelt — abgesichert durch Standardvertragsklauseln (SCC,
                Art.&nbsp;46 DSGVO). Bescheide werden spätestens nach 24h aus
                dem temporären Speicher gelöscht. Mehr in der{' '}
                <Link
                  to="/datenschutz"
                  target="_blank"
                  className="text-primary underline hover:no-underline"
                >
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          </label>

          {/* Checkbox 2: RDG-Disclaimer */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={rdg}
              onChange={(e) => setRdg(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
            />
            <div className="text-sm">
              <strong className="text-foreground">
                Keine Rechtsberatung im Einzelfall (RDG)
              </strong>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                Ich habe verstanden, dass BescheidBoxer ein KI-gestütztes
                Informations- und Selbsthilfe-Werkzeug ist und{' '}
                <strong className="text-foreground">
                  keine Rechtsberatung im Einzelfall
                </strong>{' '}
                im Sinne des Rechtsdienstleistungsgesetzes (RDG) ersetzt. Bei
                komplexen Fällen wende ich mich an einen Sozialverband
                (VdK,&nbsp;SoVD), eine Beratungsstelle oder einen Fachanwalt.
                Die Verantwortung für Fristen, Anträge und Widersprüche liegt
                bei mir.
              </p>
            </div>
          </label>

          {/* Hinweis-Block */}
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
              Du kannst deine Einwilligung jederzeit widerrufen — durch Löschen
              deines Accounts oder per Mail an{' '}
              <a
                href="mailto:hello@bescheidboxer.de"
                className="underline font-medium"
              >
                hello@bescheidboxer.de
              </a>
              . Wirkung gilt für die Zukunft.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full sm:flex-1"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!canAccept || submitting}
            className="rounded-full sm:flex-[2] gradient-boxer text-white border-0 hover:opacity-90"
          >
            {submitting ? 'Wird gespeichert …' : 'Einwilligen & weiter'}
          </Button>
        </div>
      </div>
    </div>
  )
}
