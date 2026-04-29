import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import useDocumentTitle from '@/hooks/useDocumentTitle'

/**
 * AuthCallbackPage — landet hier nach Klick auf Magic-Link.
 *
 * Logik:
 *   1. Warte auf Auth-State von Supabase (onAuthStateChange im AuthContext)
 *   2. Wenn user da:
 *      - Wenn ?next=/onboarding/passwort?reset=1 → direkt dorthin (Reset-Flow)
 *      - Wenn !hasPassword → /onboarding/passwort?next=<urspruengliches-next>
 *      - Wenn hasPassword → /next (normalfall)
 *   3. Wenn Auth fehlgeschlagen → /login mit Fehler
 */
export default function AuthCallbackPage() {
  useDocumentTitle('Anmeldung läuft …')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    const next = searchParams.get('next') || '/dashboard'

    if (user) {
      // Reset-Flow erkennen — explizit Passwort-Reset
      if (next.startsWith('/onboarding/passwort')) {
        navigate(next, { replace: true })
        return
      }

      // Normaler Login: Hat User schon Passwort? → next, sonst Setup
      if (profile && !profile.hasPassword) {
        navigate(`/onboarding/passwort?next=${encodeURIComponent(next)}`, {
          replace: true,
        })
        return
      }

      navigate(next, { replace: true })
    } else {
      // Kein User — Link abgelaufen oder Fehler
      const hash = window.location.hash
      if (hash.includes('error')) {
        navigate('/login?error=link-invalid', { replace: true })
      } else {
        // Nach 3s ohne User: zur Login-Page mit Fehler-Hinweis
        const t = setTimeout(() => {
          navigate('/login?error=link-expired', { replace: true })
        }, 3000)
        return () => clearTimeout(t)
      }
    }
  }, [user, profile, loading, navigate, searchParams])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-boxer text-white mb-5 shadow-lg shadow-red-500/20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Anmeldung läuft …</h1>
      <p className="text-muted-foreground">Einen Moment, wir loggen dich ein.</p>
    </div>
  )
}
