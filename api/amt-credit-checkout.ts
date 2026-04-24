import Stripe from 'stripe'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

/**
 * Einmalkauf von Credit-Paketen (Top-up).
 * - mode: 'payment' (KEINE Subscription, nur ein Einmalkauf)
 * - metadata.kind: 'credits' (Webhook verzweigt darauf)
 * - metadata.creditsAmount: Anzahl der zu gutschreibenden Credits
 * - metadata.userId: auth.users.id == profiles.id == bb_user_state.user_id
 *   (seit der Konsolidierung 2026-04-23 ist das dieselbe UUID).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { priceId, userId, userEmail, creditsAmount } = req.body

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' })
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required for credit top-up' })
    }

    const creditsInt = parseInt(String(creditsAmount), 10)
    if (!creditsInt || creditsInt <= 0 || ![5, 15, 40].includes(creditsInt)) {
      return res.status(400).json({
        error: 'Invalid creditsAmount. Must be 5, 15 or 40.',
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/dashboard?checkout=success&kind=credits&credits=${creditsInt}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/preise?checkout=cancel`,
      customer_email: userEmail || undefined,
      metadata: {
        app: 'bescheidboxer',
        kind: 'credits',
        userId: userId,
        creditsAmount: String(creditsInt),
      },
      // Credits sind Einmalkaeufe — Promo-Codes brauchen wir hier nicht
      // standardmaessig, Billing-Address jedoch schon (Rechnung).
      billing_address_collection: 'required',
      locale: 'de',
      tax_id_collection: { enabled: true },
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('BescheidBoxer credit-checkout error:', error)
    return res.status(500).json({
      error: 'Failed to create credit-checkout session',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
