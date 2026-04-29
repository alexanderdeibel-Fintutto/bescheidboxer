import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import useDocumentTitle from '@/hooks/useDocumentTitle'

export default function RegisterPage() {
  useDocumentTitle('Konto erstellen')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const { user, signInWithMagicLink, loading } = useAuth()
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
      // Nach Magic-Link-Klick führt der AuthCallback den User
      // automatisch zu /onboarding/passwort, weil noch kein Passwort
      // gesetzt ist. Von dort aus dann zu next.
      await signInWithMagicLink(email, next)
      setMagicSent(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Anmelde-Link konnte nicht versendet werden.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (magicSent) {
    return (
      <>
        <PageHeader badge="Anmelde-Link versendet" title="Schau in dein Postfach." align="center" />
        <div className="container max-w-md mx-auto px-6 pb-16">
          <FadeSection>
            <Card className="rounded-2xl">
              <CardContent className="p-7 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 mb-5">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">E-Mail gesendet</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Wir haben dir einen Link an{' '}
                  <strong className="text-foreground">{email}</strong> geschickt.
                  Klick drauf — dann legst du dein Passwort fest und bist drin.
                </p>
                <div className="bg-muted/40 rounded-xl p-4 text-left text-sm space-y-2 mb-5">
                  <p>📬 <strong>Mail nicht angekommen?</strong></p>
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
        badge="Konto erstellen"
        title="2 kostenlose Scans"
        titleGradient="warten auf dich."
        subtitle="Email eingeben — wir schicken dir einen Anmelde-Link. Danach legst du dein Passwort fest."
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

              <form onSubmit={handleMagic} className="space-y-4">
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
                  Kein Passwort nötig — Email reicht. Nach Bestätigung legst du
                  dein Passwort fest.
                </p>
              </form>

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
