import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import { getLastEmail } from '@/lib/last-email'
import useDocumentTitle from '@/hooks/useDocumentTitle'

/**
 * ForgotPasswordPage — Magic-Link Reset.
 *
 * User gibt Email ein → Magic-Link wird versendet → User klickt →
 * AuthCallback erkennt ?reset=1 → redirect zu /onboarding/passwort?reset=1
 */
export default function ForgotPasswordPage() {
  useDocumentTitle('Passwort vergessen')
  const [email, setEmail] = useState(() => getLastEmail())
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { signInWithMagicLink } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      // Reset-Flow: Magic-Link mit reset=1 als next-Param
      // damit AuthCallback erkennt: User soll Passwort ändern
      await signInWithMagicLink(email, '/onboarding/passwort?reset=1')
      setSent(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Reset-Link konnte nicht versendet werden.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <>
        <PageHeader badge="Reset-Link versendet" title="Schau in dein Postfach." align="center" />
        <div className="container max-w-md mx-auto px-6 pb-16">
          <FadeSection>
            <Card className="rounded-2xl">
              <CardContent className="p-7 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 mb-5">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">E-Mail gesendet</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Wenn ein Konto mit{' '}
                  <strong className="text-foreground">{email}</strong> existiert,
                  haben wir dir einen Reset-Link geschickt. Klick drauf — du
                  landest auf einer Seite zum neuen Passwort festlegen.
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/login">Zurück zur Anmeldung</Link>
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
        badge="Passwort vergessen"
        title="Kein Stress."
        titleGradient="Wir schicken dir einen Link."
        subtitle="Email eingeben — du bekommst einen Reset-Link, mit dem du ein neues Passwort setzen kannst."
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Mail className="mr-2 h-4 w-4" />
                  Reset-Link schicken
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Zurück zur Anmeldung
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeSection>
      </div>
    </>
  )
}
