import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, KeyRound, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { toast } from 'sonner'

/**
 * SetPasswordPage — Nach Magic-Link-Anmeldung legt der User hier sein
 * Passwort fest. Wird auch für Passwort-Reset verwendet.
 *
 * Flow:
 *   1. User klickt Magic-Link in der Mail
 *   2. AuthCallback erkennt: User hat noch kein Passwort
 *   3. Redirect hierher mit ?next=<urspruengliche-Seite>
 *   4. User legt Passwort fest → updateUser → fertig → next
 */
export default function SetPasswordPage() {
  useDocumentTitle('Passwort festlegen')
  const [password, setPassword2] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, profile, setPassword, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const isReset = searchParams.get('reset') === '1'

  // Nicht eingeloggt → /login
  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?next=${encodeURIComponent('/onboarding/passwort')}`, {
        replace: true,
      })
    }
  }, [user, loading, navigate])

  // Wenn User schon ein Passwort hat und nicht im Reset-Flow → weg von hier
  useEffect(() => {
    if (!loading && profile?.hasPassword && !isReset) {
      navigate(next, { replace: true })
    }
  }, [profile, loading, isReset, navigate, next])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }
    if (password !== confirm) {
      setError('Die beiden Passwörter stimmen nicht überein.')
      return
    }

    setIsLoading(true)
    try {
      await setPassword(password)
      toast.success(
        isReset ? 'Passwort wurde geändert' : 'Passwort gesetzt — willkommen!',
      )
      navigate(next, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Passwort konnte nicht gesetzt werden.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        badge={isReset ? 'Passwort zurücksetzen' : 'Letzter Schritt'}
        title={isReset ? 'Neues Passwort' : 'Leg dein'}
        titleGradient={isReset ? 'festlegen.' : 'Passwort fest.'}
        subtitle={
          isReset
            ? 'Wähle ein neues Passwort. Beim nächsten Mal meldest du dich damit an.'
            : 'Damit du dich künftig schnell einloggen kannst — ohne Magic-Link.'
        }
        align="center"
      />

      <div className="container max-w-md mx-auto px-6 pb-16">
        <FadeSection delay={120}>
          <Card className="rounded-2xl">
            <CardContent className="p-6 sm:p-7">
              {!isReset && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <p className="font-semibold text-sm">
                      Anmeldung erfolgreich
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user?.email} ist verifiziert. Jetzt nur noch Passwort
                    festlegen.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Neues Passwort</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Mindestens 8 Zeichen"
                    required
                    autoFocus
                    autoComplete="new-password"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm">Passwort bestätigen</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Nochmal eingeben"
                    required
                    autoComplete="new-password"
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
                  {isReset ? 'Passwort ändern' : 'Passwort festlegen'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Mindestens 8 Zeichen. Tipp: Passwort-Manager nutzen.
                </p>
              </form>
            </CardContent>
          </Card>
        </FadeSection>
      </div>
    </>
  )
}
