import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, Mail, KeyRound, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import useDocumentTitle from '@/hooks/useDocumentTitle'

type Mode = 'magic' | 'password'

export default function LoginPage() {
  useDocumentTitle('Anmelden')
  const [mode, setMode] = useState<Mode>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const { user, signIn, signInWithMagicLink, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  // Wenn schon eingeloggt: direkt redirect
  useEffect(() => {
    if (!loading && user) {
      navigate(next, { replace: true })
    }
  }, [user, loading, navigate, next])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await signInWithMagicLink(email, next)
      setMagicSent(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Magic-Link konnte nicht versendet werden.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await signIn(email, password)
      navigate(next, { replace: true })
    } catch {
      setError('E-Mail oder Passwort falsch. Bitte erneut versuchen.')
    } finally {
      setIsLoading(false)
    }
  }

  // Magic-Link wurde versendet — Erfolgs-State
  if (magicSent) {
    return (
      <>
        <PageHeader
          badge="Magic-Link versendet"
          title="Schau in dein Postfach."
          align="center"
        />
        <div className="container max-w-md mx-auto px-6 pb-16">
          <FadeSection>
            <Card className="rounded-2xl">
              <CardContent className="p-7 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 mb-5">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">E-Mail gesendet</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Wir haben dir einen Anmelde-Link an{' '}
                  <strong className="text-foreground">{email}</strong> geschickt. Klick
                  auf den Link in der Mail — du wirst automatisch eingeloggt.
                </p>
                <div className="bg-muted/40 rounded-xl p-4 text-left text-sm space-y-2 mb-5">
                  <p>
                    📬 <strong>Mail nicht angekommen?</strong>
                  </p>
                  <ul className="text-muted-foreground text-xs space-y-1 ml-4 list-disc">
                    <li>Prüfe deinen Spam-Ordner</li>
                    <li>Der Link gilt 1 Stunde</li>
                    <li>Achte auf den Absender „BescheidBoxer"</li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setMagicSent(false)
                    setEmail('')
                  }}
                >
                  Andere E-Mail verwenden
                </Button>
              </CardContent>
            </Card>
          </FadeSection>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        badge="Anmelden"
        title="Willkommen"
        titleGradient="zurück."
        subtitle="Wir schicken dir einen Magic-Link — kein Passwort nötig."
        align="center"
      />

      <div className="container max-w-md mx-auto px-6 pb-16">
        <FadeSection delay={120}>
          <Card className="rounded-2xl">
            <CardContent className="p-6 sm:p-7">
              {/* Mode-Toggle */}
              <div className="flex gap-2 p-1 bg-muted/50 rounded-full mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('magic')
                    setError('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    mode === 'magic'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Magic-Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('password')
                    setError('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    mode === 'password'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <KeyRound className="h-4 w-4" />
                  Passwort
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                </div>
              )}

              {mode === 'magic' ? (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <Label htmlFor="email-magic">E-Mail-Adresse</Label>
                    <Input
                      id="email-magic"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deine@email.de"
                      required
                      autoFocus
                      className="mt-1.5"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full gradient-boxer text-white border-0 hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Mail className="mr-2 h-4 w-4" />
                    Anmelde-Link schicken
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Du bekommst eine E-Mail mit einem Anmelde-Link. Kein Passwort, kein
                    Stress.
                  </p>
                </form>
              ) : (
                <form onSubmit={handlePasswordSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email-pw">E-Mail</Label>
                    <Input
                      id="email-pw"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deine@email.de"
                      required
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
                      className="mt-1.5"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full gradient-boxer text-white border-0 hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Anmelden
                  </Button>
                </form>
              )}

              <div className="mt-5 text-center text-sm text-muted-foreground">
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
