import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

/**
 * RequireAuth — Wrapper für geschützte Routes.
 *
 * Verhalten:
 * - Wenn Auth-Status noch lädt: zeigt Spinner
 * - Wenn nicht eingeloggt: redirect zu /login?next=<aktueller-Pfad>
 * - Wenn eingeloggt: rendert die children
 *
 * Beispiel: <RequireAuth><BescheidScanPage /></RequireAuth>
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    const next = location.pathname + location.search
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  return <>{children}</>
}
