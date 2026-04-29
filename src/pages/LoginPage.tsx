import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import useDocumentTitle from '@/hooks/useDocumentTitle'

export default function LoginPage() {
  useDocumentTitle('Anmelden')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, signIn, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const errorParam = searchParams.get('error')

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
        subtitle="Melde dich mit deiner E-Mail und deinem Passwort an."
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
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="deine@email.de"
                    required
                    autoFocus
                    autoComplete="email"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Passwort</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dein Passwort"
                    required
                    autoComplete="current-password"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Passwort vergessen? Bitte kontaktiere{' '}
                    <a
                      href="mailto:support@bescheidboxer.de"
                      className="text-primary hover:underline"
                    >
                      support@bescheidboxer.de
                    </a>
                  </p>
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
