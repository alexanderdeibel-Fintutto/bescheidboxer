/**
 * Frontend-Helper für Stripe Checkout.
 *
 * Verantwortlich für:
 * - Login-Gate (wer nicht eingeloggt ist, wird auf /login umgeleitet
 *   und nach erfolgreichem Login zurück auf /preise)
 * - Aufruf der serverlosen Route /api/amt-checkout
 * - Redirect zur Stripe-Hosted-Checkout-Seite
 */

import type { NavigateFunction } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'

type Interval = 'monthly' | 'yearly'
type PlanId = 'starter' | 'kaempfer' | 'vollschutz'

interface StartCheckoutArgs {
  planId: PlanId
  interval: Interval
  priceId: string
  user: User | null
  navigate: NavigateFunction
}

/**
 * Startet den Stripe-Checkout.
 *
 * @throws nur bei expliziten Fehlern (Netzwerk, Server), Login-
 *         Weiterleitung ist ein stiller Seiteneffekt.
 */
export async function startCheckout({
  planId,
  interval,
  priceId,
  user,
  navigate,
}: StartCheckoutArgs): Promise<void> {
  if (!user) {
    // Nach dem Login zurück zur Preisseite
    navigate('/login?next=/preise')
    return
  }

  const res = await fetch('/api/amt-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId,
      userId: user.id,
      userEmail: user.email,
      planId,
      interval,
    }),
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}))
    throw new Error(
      payload?.error ||
        `Checkout konnte nicht gestartet werden (HTTP ${res.status}).`,
    )
  }

  const { url } = (await res.json()) as { url?: string }
  if (!url) {
    throw new Error('Keine Checkout-URL von Stripe erhalten.')
  }

  window.location.href = url
}
