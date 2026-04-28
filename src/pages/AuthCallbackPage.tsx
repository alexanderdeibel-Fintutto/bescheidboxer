import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import useDocumentTitle from '@/hooks/useDocumentTitle'

/**
 * AuthCallbackPage — landet hier nach Klick auf Magic-Link.
 * Supabase macht via onAuthStateChange im AuthContext automatisch
 * `setSession(...)`. Wir warten darauf und redirecten dann zum
 * `next`-Parameter (oder /dashboard als Fallback).
 */
export default function AuthCallbackPage() {
  useDocumentTitle('Anmeldung läuft …')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Warte auf Auth-State von Supabase
    if (loading) return

    const next = searchParams.get('next') || '/dashboard'

    if (user) {
      navigate(next, { replace: true })
    } else {
      // Auth fehlgeschlagen oder Link abgelaufen
      // Fehler-Hashes/Errors stehen in URL-Hash bei Supabase
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
  }, [user, loading, navigate, searchParams])

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
