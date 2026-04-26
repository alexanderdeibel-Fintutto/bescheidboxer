import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendWelcomeMail } from './_email'

/**
 * POST /api/amt-welcome-mail
 *
 * Wird vom AuthContext nach erfolgreichem Signup fire-and-forget
 * angefragt. Body: { email: string, name?: string }
 *
 * Antwortet immer 200, selbst wenn der Mail-Versand fehlschlaegt —
 * Mail-Fehler duerfen den Signup nicht blockieren. Tatsaechliche Fehler
 * stehen im Resend-Dashboard und in den Server-Logs.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, name } = req.body || {}

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email is required' })
    }

    // Fire-and-forget: send ist bereits fail-safe (wirft nicht).
    await sendWelcomeMail(email, typeof name === 'string' ? name : undefined)

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('amt-welcome-mail error:', err)
    // Trotzdem 200, damit Frontend den Fehler nicht dem Nutzer zeigt.
    return res.status(200).json({ ok: false })
  }
}
