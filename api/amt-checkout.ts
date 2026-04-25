import Stripe from 'stripe'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

// Plan limits matching credits.ts PLANS config
const PLAN_LIMITS: Record<string, {
  chatMessagesPerDay: number
  lettersPerMonth: number
  bescheidScansPerMonth: number
  creditsPerMonth: number
}> = {
  starter: {
    chatMessagesPerDay: 10,
    lettersPerMonth: 1,
    bescheidScansPerMonth: 3,
    creditsPerMonth: 10,
  },
  kaempfer: {
    chatMessagesPerDay: -1,
    lettersPerMonth: 3,
    bescheidScansPerMonth: -1,
    creditsPerMonth: 25,
  },
  vollschutz: {
    chatMessagesPerDay: -1,
    lettersPerMonth: -1,
    bescheidScansPerMonth: -1,
    creditsPerMonth: 50,
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { priceId, userId, userEmail, planId, interval } = req.body

    if (!priceId || !planId) {
      return res.status(400).json({ error: 'Price ID and Plan ID are required' })
    }

    if (!['starter', 'kaempfer', 'vollschutz'].includes(planId)) {
      return res.status(400).json({ error: 'Invalid plan ID. Must be starter, kaempfer, or vollschutz.' })
    }

    const planLimits = PLAN_LIMITS[planId]

    // Robuster Origin-Fallback: Browser sendet 'origin' nur bei Cross-Origin
    // Requests; bei Same-Origin-POSTs ist er ggf. undefined.
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https'
    const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string)
    const origin =
      (req.headers.origin as string) ||
      (host ? `${proto}://${host}` : 'https://app.bescheidboxer.de')

    // Stripe Accounts V2 verlangt einen pre-existing Customer (statt nur
    // customer_email) im Checkout. Wir suchen oder erstellen einen.
    let customerId: string | undefined
    if (userEmail) {
      const existing = await stripe.customers.list({ email: userEmail, limit: 1 })
      if (existing.data.length > 0) {
        customerId = existing.data[0].id
      } else {
        const created = await stripe.customers.create({
          email: userEmail,
          metadata: { app: 'bescheidboxer', userId: userId || '' },
        })
        customerId = created.id
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?checkout=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/preise?checkout=cancel`,
      ...(customerId ? { customer: customerId } : { customer_email: userEmail || undefined }),
      metadata: {
        app: 'bescheidboxer',
        userId: userId || '',
        planId,
        interval: interval || 'monthly',
        chatMessagesPerDay: String(planLimits.chatMessagesPerDay),
        lettersPerMonth: String(planLimits.lettersPerMonth),
        bescheidScansPerMonth: String(planLimits.bescheidScansPerMonth),
        creditsPerMonth: String(planLimits.creditsPerMonth),
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'de',
      tax_id_collection: { enabled: true },
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('BescheidBoxer checkout error:', error)
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
