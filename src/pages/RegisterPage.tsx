import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, KeyRound, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import { getLastEmail } from '@/lib/last-email'
import useDocumentTitle from '@/hooks/useDocumentTitle'

/**
 * RegisterPage — Erstanmeldung primär via Magic-Link.
 *
 * Standard-Flow: User gibt nur Email ein → Magic-Link → AuthCallback →
 * Pflicht-Passwort-Setup auf /onboarding/passwort.
 *
 * Fallback-Flow: User klickt "Lieber direkt mit Passwort?" → klassische
 * Email+Passwort-Form via signUp().
 */
export default function RegisterPage() {
  useDocumentTitle('Konto erstellen')
  const [mode, setMode] = useState<'magic' | 'password'>('magic')

  // gemeinsam — Email aus localStorage prefillen falls schon mal genutzt
  const [name, setName] = useState('')
  const [email, setEmail] = useState(() => getLastEmail())
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

  // Magic-Link senden
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein.')
      return
    }
    setIsLoading(true)
    try {
      // Nach Klick auf Magic-Link: AuthCallback → SetPasswordPage (Pflicht)
      // → dann zum eigentlichen Ziel (next)
      await signInWithMagicLink(email, next)
      setMagicSent(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(
        msg
          ? `Anmelde-Link konnte nicht gesendet werden: ${msg}`
          : 'Anmelde-Link konnte nicht gesendet werden. Bitte später erneut versuchen.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Klassische Passwort-Registrierung
  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.')
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
        setError('Diese E-Mail ist bereits registriert. Bitte melde dich an.')
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

  // -------- "Email-Link versendet"-Erfolgsstate --------
  if (magicSent) {
    return (
      <>
        <PageHeader
          badge="Konto erstellen"
          title="Schau in dein"
          titleGradient="Postfach."
          align="center"
        />
        <div className="container max-w-md mx-auto px-6 pb-16">
          <FadeSection>
            <Card className="rounded-2xl">
              <CardContent className="p-7 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 mb-5">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Anmelde-Link gesendet</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Wir haben dir einen Link an{' '}
                  <strong className="text-foreground">{email}</strong> geschickt.
                  Klick drauf und du landest direkt in deinem Konto. Im
                  nächsten Schritt legst du ein Passwort fest — dann brauchst du
                  beim nächsten Mal keinen Link mehr.
                </p>
                <p className="text-xs text-muted-foreground mb-5">
                  Keine Mail nach 2 Min? Schau im Spam-Ordner oder probiere
                  es erneut.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setMagicSent(false)
                      setError('')
                    }}
                  >
                    Andere E-Mail
                  </Button>
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link to="/login">Zurück zur Anmeldung</Link>
                  </Button>
                </div>
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

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                </div>
              )}

              {mode === 'magic' ? (
                /* ---------------- Magic-Link Flow (Default) ---------------- */
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-Mail-Adresse</Label>
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
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Wir schicken dir einen Anmelde-Link. Kein Passwort
                      nötig — das legst du gleich danach fest.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full gradient-boxer text-white border-0 hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Anmelde-Link schicken
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('password')
                      setError('')
                    }}
                    className="w-full text-xs text-muted-foreground hover:text-primary transition-colors pt-1"
                  >
                    Lieber direkt mit Passwort registrieren?
                  </button>
                </form>
              ) : (
                /* ---------------- Passwort-Fallback ---------------- */
                <form onSubmit={handlePasswordSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dein Name"
                      autoComplete="name"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail-Adresse</Label>
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
                      placeholder="Mindestens 8 Zeichen"
                      required
                      autoComplete="new-password"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Mindestens 8 Zeichen. Tipp: Passwort-Manager nutzen.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full gradient-boxer text-white border-0 hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <KeyRound className="mr-2 h-4 w-4" />
                    Kostenlos registrieren
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('magic')
                      setError('')
                    }}
                    className="w-full text-xs text-muted-foreground hover:text-primary transition-colors pt-1 inline-flex items-center justify-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Doch lieber Anmelde-Link per E-Mail?
                  </button>
                </form>
              )}

              <div className="mt-6 pt-5 border-t border-border text-center text-sm text-muted-foreground">
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
