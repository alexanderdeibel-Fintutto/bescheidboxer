import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('E-Mail oder Passwort falsch. Bitte versuche es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        badge="Anmelden"
        title="Willkommen"
        titleGradient="zurück"
        subtitle="Melde dich bei deinem BescheidBoxer-Konto an und kämpfe weiter für deine Rechte."
        align="center"
      />

      <div className="container max-w-md mx-auto px-6 pb-16">
        <FadeSection delay={120}>
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
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
                    placeholder="Dein Passwort"
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
                  Anmelden
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Noch kein Konto?{' '}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
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
