import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Wrapper-Component: laesst nur User mit role IN
 * ('admin','superadmin','support') durch. Alle anderen landen auf '/'.
 *
 * Die DB-Funktion is_bb_admin() deckt admin+superadmin auf der
 * Datenbankseite ab; diese UI-Guard hier spiegelt das einfach vor.
 */
const ADMIN_ROLES = new Set(['admin', 'superadmin', 'support'])

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!profile || !ADMIN_ROLES.has(profile.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
