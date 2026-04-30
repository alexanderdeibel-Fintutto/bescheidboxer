/**
 * PasswordSetGuard — Globaler Pflicht-Setup-Guard.
 *
 * Wirkt unabhängig von AuthCallbackPage und RequireAuth: bei JEDEM
 * Location-Wechsel prüft er, ob ein eingeloggter User noch kein Passwort
 * gesetzt hat. Wenn ja → Redirect auf /onboarding/passwort.
 *
 * Damit ist es egal, ob der User über Magic-Link, /login mit Passwort,
 * direkten Aufruf von /scan, /profil oder einer anderen Route reinkommt:
 * solange hasPassword=false ist, wird er zur Setup-Seite gezwungen.
 *
 * Ausgenommen sind nur Routes, auf denen der User auch ohne Passwort
 * sein darf:
 *   - /onboarding/passwort (die Setup-Seite selbst, sonst Loop)
 *   - /login, /register, /passwort-vergessen, /auth/callback (Auth-Flow)
 *   - /onboarding (Welcome-Tour)
 *   - / (Homepage)
 *   - /datenschutz, /impressum, /agb, /kontakt, /faq, /ueber-uns (Legal/Info)
 */
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

// Routes auf denen User auch ohne Passwort sein darf
const ALLOWED_WITHOUT_PASSWORD = [
  '/onboarding/passwort',
  '/onboarding',
  '/login',
  '/register',
  '/passwort-vergessen',
  '/auth/callback',
  '/datenschutz',
  '/impressum',
  '/agb',
  '/kontakt',
  '/faq',
  '/ueber-uns',
]

export default function PasswordSetGuard() {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Warten bis Auth-State + Profil komplett geladen sind
    if (loading) return
    if (!user) return // nicht eingeloggt → kein Guard nötig
    if (!profile) return // profile noch nicht da

    // User hat schon Passwort → kein Guard nötig
    if (profile.hasPassword) return

    // User ist auf erlaubter Route → durchlassen
    const path = location.pathname
    const isAllowed = ALLOWED_WITHOUT_PASSWORD.some((p) =>
      path === p || path.startsWith(`${p}/`),
    )
    if (isAllowed) return

    // Pflicht-Setup erzwingen — mit next=<aktuelle-Route> damit der User
    // nach Passwort-Setup zur ursprünglich angesteuerten Seite kommt.
    navigate(`/onboarding/passwort?next=${encodeURIComponent(path + location.search)}`, {
      replace: true,
    })
  }, [user, profile, loading, location.pathname, location.search, navigate])

  return null
}
