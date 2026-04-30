import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import { getLastEmail, forgetLastEmail } from '@/lib/last-email'
import useDocumentTitle from '@/hooks/useDocumentTitle'

export default function LoginPage() {
  useDocumentTitle('Anmelden')
  // Email aus localStorage vorausfüllen — wenn der User schon mal hier war,
  // muss er nur noch das Passwort eingeben.
  const [email, setEmail] = useState(() => getLastEmail())
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, signIn, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const errorParam = searchParams.get('error')
  const passwordRef = useRef<HTMLInputElement>(null)
  const hasPrefilledEmail = email.length > 0

  // Wenn Email schon vorausgefüllt ist, direkt im Passwort-Feld starten
  useEffect(() => {
    if (hasPrefilledEmail) {
      // Mini-Delay damit Component erst voll gemountet ist
      const t = setTimeout(() => passwordRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [hasPrefilledEmail])

  // Wenn schon eingeloggt: redirect
  useEffect(() => {
    if (!loading && user) {
      navigate(next, { replace: true })
    }
  }, [user, loading, navigate, next])

  // Error-Param aus URL (von AuthCallback bei abgelaufenem Link)
  useEffect(() => {
    if (errorParam === 'link-invalid') {
      setError('Der Anmelde-Link ist ungültig oder wurde bereits verwendet.')
    } else if (errorParam === 'link-expired') {
      setError('Der Anmelde-Link ist abgelaufen. Bitte neuen anfordern.')
    }
  }, [errorParam])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await signIn(email, password)
      navigate(next, { replace: true })
    } catch {
      setError('E-Mail oder Passwort falsch.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        badge="Anmelden"
        title="Willkommen"
        titleGradient="zurück."
        subtitle={
          hasPrefilledEmail
            ? `Eingeloggt als ${email}. Gib dein Passwort ein.`
            : 'Melde dich mit deiner E-Mail und deinem Passwort an.'
        }
        align="center"
      />

      <div className="container max-w-md mx-auto px-6 pb-16">
        <FadeSection delay={120}>
          <Card className="rounded-2xl">
            <CardContent className="p-6 sm:p-7">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <Label htmlFor="email">E-Mail</Label>
                    {hasPrefilledEmail && (
                      <button
                        type="button"
                        onClick={() => {
                          forgetLastEmail()
                          setEmail('')
                        }}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Andere E-Mail?
                      </button>
                    )}
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="deine@email.de"
                    required
                    autoFocus={!hasPrefilledEmail}
                    autoComplete="email"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <Label htmlFor="password">Passwort</Label>
                    <Link
                      to="/passwort-vergessen"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Vergessen?
                    </Link>
                  </div>
                  <Input
                    ref={passwordRef}
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dein Passwort"
                    required
                    autoComplete="current-password"
                    className="mt-1.5"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full gradient-boxer text-white border-0 hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <KeyRound className="mr-2 h-4 w-4" />
                  Anmelden
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-border text-center text-sm text-muted-foreground">
                Noch kein Konto?{' '}
                <Link
                  to={`/register${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next') || '')}` : ''}`}
                  className="text-primary font-semibold hover:underline"
                >
                  Kostenlos registrieren
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeSection>
      </div>
    </>
  )
}
