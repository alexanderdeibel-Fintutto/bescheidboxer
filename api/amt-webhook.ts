import Stripe from 'stripe'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
// HINWEIS: Email-Helper ist temporaer rausgezogen, weil Vercel den
// 'api/_lib/'-Subfolder nicht ins Function-Bundle inkludiert
// (FUNCTION_INVOCATION_FAILED zur Runtime). Mails sind nice-to-have und
// kommen wieder rein, sobald wir _lib auf einen anderen Pfad migriert haben.
async function sendSubscriptionConfirmedMail(_to: string, _planId: string, _credits: number) { /* stub */ }
async function sendSubscriptionCancelledMail(_to: string) { /* stub */ }

// Lazy-Init: ENV-Asserts auf Top-Level fuehrten bei fehlenden ENVs zu
// FUNCTION_INVOCATION_FAILED, weil das Modul beim Laden crasht. Stattdessen
// Init im Handler — dann koennen wir saubere 500-Responses zurueckgeben.
let _stripe: Stripe | null = null
let _supabase: SupabaseClient | null = null

function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY env var missing')
  _stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' })
  return _stripe
}

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing')
  _supabase = createClient(url, key)
  return _supabase
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

// --- Webhook deduplication ---
const processedEvents = new Set<string>()
const MAX_PROCESSED_EVENTS = 1000

// Credit amounts per plan
const PLAN_CREDITS: Record<string, number> = {
  starter: 10,
  kaempfer: 25,
  vollschutz: 50,
}

/**
 * Finde die user_id (== profiles.id == auth.users.id) fuer einen
 * BescheidBoxer-Account. Reihenfolge:
 *   1. metadata.userId  (auth.users.id — so schickt es das Frontend)
 *   2. customerEmail    (Fallback, falls Metadata fehlt)
 *
 * Wir schauen in profiles nach, nicht in auth.users direkt — so
 * stellen wir sicher, dass es auch ein UAR-Profil gibt.
 */
async function resolveBbUser(
  userIdFromMeta: string | undefined,
  customerEmail: string | null | undefined,
): Promise<string | null> {
  if (userIdFromMeta) {
    const { data: p } = await getSupabase()
      .from('profiles')
      .select('id')
      .eq('id', userIdFromMeta)
      .maybeSingle()
    if (p?.id) return p.id
  }

  if (customerEmail) {
    const { data: p } = await getSupabase()
      .from('profiles')
      .select('id')
      .eq('email', customerEmail)
      .maybeSingle()
    if (p?.id) return p.id
  }

  return null
}

/**
 * Liefert die bb_user_state-Zeile; legt sie bei Bedarf an. So
 * koennen Webhooks auch dann durchlaufen, wenn der Trigger fuer
 * irgendeinen Edge-Case nicht gefeuert hat.
 */
async function ensureBbUserState(userId: string) {
  const { data } = await getSupabase()
    .from('bb_user_state')
    .select('user_id, plan, credits_current')
    .eq('user_id', userId)
    .maybeSingle()
  if (data) return data

  const { data: created, error } = await getSupabase()
    .from('bb_user_state')
    .insert({ user_id: userId })
    .select('user_id, plan, credits_current')
    .maybeSingle()
  if (error) {
    console.error('ensureBbUserState failed:', error)
    return null
  }
  return created
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_AMT_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    const buf = await buffer(req)
    event = getStripe().webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    // Deduplicate webhook events
    if (processedEvents.has(event.id)) {
      return res.status(200).json({ received: true, deduplicated: true })
    }
    processedEvents.add(event.id)
    if (processedEvents.size > MAX_PROCESSED_EVENTS) {
      const entries = Array.from(processedEvents)
      for (let i = 0; i < entries.length - 500; i++) {
        processedEvents.delete(entries[i])
      }
    }

    // Only process BescheidBoxer events
    const metadata = (event.data.object as unknown as Record<string, unknown>)?.metadata as Record<string, string> | undefined
    if (metadata?.app !== 'bescheidboxer' && metadata?.app !== 'amtshilfe') {
      return res.status(200).json({ received: true, skipped: true })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const userIdFromMeta = session.metadata?.userId
        const kind = session.metadata?.kind || 'subscription'
        const customerEmail = session.customer_email

        // --- Credit-Top-up (Einmalkauf) ---
        if (kind === 'credits') {
          const creditsAmount = parseInt(session.metadata?.creditsAmount || '0', 10)

          if (!creditsAmount || creditsAmount <= 0) {
            console.error('BescheidBoxer credit top-up: invalid creditsAmount', session.metadata)
            break
          }

          console.log('BescheidBoxer credit top-up completed:', {
            userIdFromMeta,
            creditsAmount,
            customerEmail,
          })

          const userId = await resolveBbUser(userIdFromMeta, customerEmail)
          if (!userId) {
            console.error('BescheidBoxer credit top-up: user not found', {
              userIdFromMeta,
              customerEmail,
            })
            break
          }

          const state = await ensureBbUserState(userId)
          if (!state) break

          const currentCredits = Number(state.credits_current) || 0
          const newBalance = currentCredits + creditsAmount

          const { error: updErr } = await getSupabase()
            .from('bb_user_state')
            .update({ credits_current: newBalance })
            .eq('user_id', userId)

          if (updErr) {
            console.error('BescheidBoxer credit top-up: update failed', updErr)
            break
          }

          await getSupabase().from('bb_credit_transactions').insert({
            user_id: userId,
            amount: creditsAmount,
            type: 'topup',
            description: `Credit-Top-up: +${creditsAmount} Credits`,
            balance_after: newBalance,
          })

          break
        }

        // --- Subscription-Checkout (Default) ---
        const planId = session.metadata?.planId || 'starter'
        const creditsPerMonth = PLAN_CREDITS[planId] || 0

        console.log('BescheidBoxer checkout completed:', {
          userIdFromMeta,
          planId,
          customerEmail,
        })

        const userId = await resolveBbUser(userIdFromMeta, customerEmail)
        if (!userId) {
          console.error('BescheidBoxer subscription: user not found', {
            userIdFromMeta,
            customerEmail,
          })
          break
        }

        await ensureBbUserState(userId)

        const updateData = {
          plan: planId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          credits_current: creditsPerMonth,
          letters_generated_this_month: 0,
          scans_this_month: 0,
          chat_messages_used_today: 0,
          period_start: new Date().toISOString(),
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }

        const { error: updateErr } = await getSupabase()
          .from('bb_user_state')
          .update(updateData)
          .eq('user_id', userId)

        if (updateErr) {
          console.error('Error updating bb_user_state:', updateErr)
        }

        await getSupabase().from('bb_credit_transactions').insert({
          user_id: userId,
          amount: creditsPerMonth,
          type: 'subscription_credit',
          description: `${planId}-Plan monatliche Credits`,
          balance_after: creditsPerMonth,
        })

        // Confirmation-Mail (nicht blockierend)
        if (customerEmail) {
          await sendSubscriptionConfirmedMail(customerEmail, planId, creditsPerMonth)
        }
        break
      }

      case 'invoice.paid': {
        // Monthly renewal - reset limits and add credits
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: state } = await getSupabase()
          .from('bb_user_state')
          .select('user_id, plan')
          .eq('stripe_customer_id', customerId)
          .single()

        if (state && state.plan !== 'schnupperer') {
          const creditsPerMonth = PLAN_CREDITS[state.plan] || 0

          await getSupabase()
            .from('bb_user_state')
            .update({
              credits_current: creditsPerMonth,
              letters_generated_this_month: 0,
              scans_this_month: 0,
              period_start: new Date().toISOString(),
              period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('user_id', state.user_id)

          await getSupabase().from('bb_credit_transactions').insert({
            user_id: state.user_id,
            amount: creditsPerMonth,
            type: 'subscription_credit',
            description: `${state.plan}-Plan monatliche Erneuerung`,
            balance_after: creditsPerMonth,
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: state } = await getSupabase()
          .from('bb_user_state')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (state) {
          await getSupabase()
            .from('bb_user_state')
            .update({
              plan: 'schnupperer',
              stripe_subscription_id: null,
              credits_current: 0,
              letters_generated_this_month: 0,
              scans_this_month: 0,
            })
            .eq('user_id', state.user_id)

          // Fuer die Abo-Cancel-Mail brauchen wir die E-Mail aus profiles.
          const { data: p } = await getSupabase()
            .from('profiles')
            .select('email')
            .eq('id', state.user_id)
            .maybeSingle()

          console.log('BescheidBoxer subscription cancelled, downgraded to schnupperer:', state.user_id)

          if (p?.email) {
            await sendSubscriptionCancelledMail(p.email)
          }
        }
        break
      }
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('BescheidBoxer webhook error:', error)
    return res.status(500).json({
      error: 'Webhook handler failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5).join(' | ') : undefined,
    })
  }
}
