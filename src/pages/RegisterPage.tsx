import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, name)
      navigate('/dashboard')
    } catch (err) {
      // Fehler-Message von Supabase parsen
      const msg = err instanceof Error ? err.message.toLowerCase() : ''
      if (
        msg.includes('already') ||
        msg.includes('user_already_exists') ||
        msg.includes('exists') ||
        msg.includes('registered')
      ) {
        setError(
          'Diese E-Mail ist bereits registriert. Logge dich bitte ein statt neu zu registrieren.',
        )
      } else if (msg.includes('invalid') || msg.includes('email')) {
        setError('Bitte prüfe die E-Mail-Adresse.')
      } else if (msg.includes('password')) {
        setError('Passwort zu schwach. Bitte mindestens 8 Zeichen, Buchstaben + Zahlen.')
      } else {
        setError(
          err instanceof Error && err.message
            ? `Registrierung fehlgeschlagen: ${err.message}`
            : 'Registrierung fehlgeschlagen. Bitte versuche es später erneut.',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        badge="Konto erstellen"
        title="2 kostenlose Scans"
        titleGradient="warten auf dich"
        subtitle="Erstelle dein BescheidBoxer-Konto in unter einer Minute. Keine Kreditkarte, kein Risiko."
        align="center"
      />

      <div className="container max-w-md mx-auto px-6 pb-16">
        <FadeSection delay={120}>
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              {/* Benefits */}
              <div className="mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium mb-2">Kostenlos enthalten:</p>
                <ul className="space-y-1">
                  {['1 KI-Frage pro Tag', 'Alle Musterschreiben einsehen', 'Forum-Zugang (lesen)'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
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
                  variant="amt"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kostenlos registrieren
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Bereits registriert?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
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
