import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, KeyRound, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
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
  const [resending, setResending] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const { user, signIn, signInWithMagicLink, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const errorParam = searchParams.get('error')
  const passwordRef = useRef<HTMLInputElement>(null)
  const hasPrefilledEmail = email.length > 0
  const isLinkError = errorParam === 'link-expired' || errorParam === 'link-invalid'

  // Wenn Email schon vorausgefüllt ist und kein Link-Error → Cursor ins Passwort
  useEffect(() => {
    if (hasPrefilledEmail && !isLinkError) {
      const t = setTimeout(() => passwordRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [hasPrefilledEmail, isLinkError])

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
      setError('Der Anmelde-Link ist abgelaufen.')
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

  // Magic-Link direkt von /login aus neu anfordern — bei expired/invalid
  // muss der User nicht erst auf /passwort-vergessen oder /register
  const handleMagicLinkResend = async () => {
    if (!email) {
      setError('Bitte zuerst die E-Mail-Adresse eintragen.')
      return
    }
    setError('')
    setResending(true)
    try {
      await signInWithMagicLink(email, next)
      setResendSent(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg ? `Link konnte nicht versendet werden: ${msg}` : 'Link konnte nicht versendet werden.')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <PageHeader
        badge="Anmelden"
        title={isLinkError ? 'Link' : 'Willkommen'}
        titleGradient={isLinkError ? 'abgelaufen.' : 'zurück.'}
        subtitle={
          isLinkError
            ? 'Kein Stress — du kannst dich entweder mit deinem Passwort einloggen oder einen neuen Anmeldelink anfordern.'
            : hasPrefilledEmail
              ? `Eingeloggt als ${email}. Gib dein Passwort ein.`
              : 'Melde dich mit deiner E-Mail und deinem Passwort an.'
        }
        align="center"
      />

      <div className="container max-w-md mx-auto px-6 pb-16">
        <FadeSection delay={120}>
          <Card className="rounded-2xl">
            <CardContent className="p-6 sm:p-7">

              {/* Bei expired/invalid Link: Re-Send-Block GANZ OBEN */}
              {isLinkError && !resendSent && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-start gap-2.5 mb-3">
                    <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Anmeldelink abgelaufen</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Mail-Client hat den Link evtl. vorab geprüft, oder die 60&nbsp;Min sind um.
                        Hier ist ein neuer mit einem Klick:
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deine@email.de"
                      autoComplete="email"
                      className="bg-white dark:bg-background"
                    />
                    <Button
                      type="button"
                      onClick={handleMagicLinkResend}
                      disabled={resending || !email}
                      className="w-full rounded-full gradient-boxer text-white border-0 hover:opacity-90"
                    >
                      {resending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="mr-2 h-4 w-4" />
                      )}
                      Neuen Anmeldelink schicken
                    </Button>
                  </div>
                </div>
              )}

              {/* Erfolgs-State nach Re-Send */}
              {resendSent && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Neuer Link unterwegs</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Wir haben einen neuen Anmeldelink an{' '}
                        <strong className="text-foreground">{email}</strong>{' '}
                        geschickt. Tipp: öffne die Mail im selben Browser, in
                        dem du jetzt bist — sonst ist der Link beim Klick
                        wieder ungültig.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Allgemeiner Fehler (nicht-Link) */}
              {error && !isLinkError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Falls Link-Error: kleine Trennlinie und "Oder mit Passwort einloggen:" */}
              {isLinkError && (
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="bg-background px-2 text-muted-foreground">
                      oder mit Passwort
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <Label htmlFor="email">E-Mail</Label>
                    {hasPrefilledEmail && !isLinkError && (
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
                    autoFocus={!hasPrefilledEmail && !isLinkError}
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
