import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, Mail, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import useDocumentTitle from '@/hooks/useDocumentTitle'

type Mode = 'magic' | 'password'

export default function RegisterPage() {
  useDocumentTitle('Konto erstellen')
  const [mode, setMode] = useState<Mode>('magic')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const { user, signUp, signInWithMagicLink, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  // Wenn schon eingeloggt: redirect
  useEffect(() => {
    if (!loading && user) {
      navigate(next, { replace: true })
    }
  }, [user, loading, navigate, next])

  const handleMagic = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await signInWithMagicLink(email, next)
      setMagicSent(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Magic-Link konnte nicht versendet werden.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }
    setIsLoading(true)
    try {
      await signUp(email, password, name)
      navigate(next, { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : ''
      if (
        msg.includes('already') ||
        msg.includes('user_already_exists') ||
        msg.includes('exists') ||
        msg.includes('registered')
      ) {
        setError(
          'Diese E-Mail ist bereits registriert. Melde dich bitte an.',
        )
      } else if (msg.includes('invalid') || msg.includes('email')) {
        setError('Bitte prüfe die E-Mail-Adresse.')
      } else if (msg.includes('password')) {
        setError('Passwort zu schwach. Mindestens 8 Zeichen, Buchstaben + Zahlen.')
      } else {
        setError(
          err instanceof Error && err.message
            ? `Registrierung fehlgeschlagen: ${err.message}`
            : 'Registrierung fehlgeschlagen. Bitte später erneut versuchen.',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (magicSent) {
    return (
      <>
        <PageHeader badge="Magic-Link versendet" title="Schau in dein Postfach." align="center" />
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
                  drauf — und du bist drin.
                </p>
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
        badge="Konto erstellen"
        title="2 kostenlose Scans"
        titleGradient="warten auf dich."
        subtitle="In unter 30 Sekunden registriert — ohne Kreditkarte, ohne Risiko."
        align="center"
      />

      <div className="container max-w-md mx-auto px-6 pb-16">
        <FadeSection delay={120}>
          <Card className="rounded-2xl">
            <CardContent className="p-6 sm:p-7">
              {/* Benefits */}
              <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm font-semibold mb-2">Kostenlos enthalten:</p>
                <ul className="space-y-1.5">
                  {[
                    '2 BescheidScans/Monat',
                    '5 KI-Fragen pro Tag',
                    'Alle Musterschreiben einsehen',
                    'Forum-Zugang lesen & posten',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

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
                <form onSubmit={handleMagic} className="space-y-4">
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
                    Funktioniert für neue + bestehende Accounts. Kein Passwort nötig.
                  </p>
                </form>
              ) : (
                <form onSubmit={handlePasswordSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dein Name"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
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
                      placeholder="Mindestens 6 Zeichen"
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
                    Kostenlos registrieren
                  </Button>
                </form>
              )}

              <div className="mt-5 text-center text-sm text-muted-foreground">
                Bereits registriert?{' '}
                <Link
                  to={`/login${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next') || '')}` : ''}`}
                  className="text-primary font-semibold hover:underline"
                >
                  Anmelden
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeSection>
      </div>
    </>
  )
}
