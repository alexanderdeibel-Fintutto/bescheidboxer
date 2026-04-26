/**
 * Resend-Mail-Helper (ohne npm-Dependency).
 *
 * ENV:
 *   RESEND_API_KEY        - API-Key von resend.com
 *   RESEND_FROM_EMAIL     - Absender (Default: noreply@bescheidboxer.de)
 *
 * Alle Funktionen loggen Fehler, werfen aber NICHT. Mail-Fehler duerfen
 * den eigentlichen Ablauf (Signup, Checkout, Cancel) niemals blockieren.
 */

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'BescheidBoxer <noreply@bescheidboxer.de>'
const RESEND_API_URL = 'https://api.resend.com/emails'

interface SendMailParams {
  to: string
  subject: string
  html: string
  text?: string
}

async function sendMail(params: SendMailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY nicht gesetzt — Mail wird uebersprungen:', params.subject)
    return
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      console.error('[email] Resend-Fehler', res.status, txt)
      return
    }
  } catch (err) {
    console.error('[email] Resend-Exception', err)
  }
}

// -------------------------------------------------------------------
// Templates
// -------------------------------------------------------------------

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f5f5f5; margin:0; padding:24px; color:#1a1a1a;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:32px; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="font-size:22px; font-weight:700; color:#111; margin-bottom:16px;">BescheidBoxer</div>
    ${bodyHtml}
    <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />
    <div style="font-size:12px; color:#777;">
      BescheidBoxer &middot; Dein digitaler Helfer bei Behoerden-Bescheiden<br/>
      <a href="https://app.bescheidboxer.de" style="color:#4f46e5;">app.bescheidboxer.de</a>
    </div>
  </div>
</body>
</html>`
}

const PLAN_NAMES: Record<string, string> = {
  starter: 'Starter',
  kaempfer: 'Kaempfer',
  vollschutz: 'Vollschutz',
}

export async function sendWelcomeMail(to: string, name?: string): Promise<void> {
  const greet = name ? `Hallo ${name},` : 'Hallo,'
  const body = `
    <p style="font-size:16px; line-height:1.5;">${greet}</p>
    <p style="font-size:16px; line-height:1.5;">
      willkommen bei <strong>BescheidBoxer</strong>! Du hast ab sofort Zugriff auf:
    </p>
    <ul style="font-size:15px; line-height:1.6; padding-left:20px;">
      <li>KI-Assistent fuer deine Behoerden-Bescheide</li>
      <li>Bescheid-Scan (bis zu 2 pro Monat im Schnupperer-Plan)</li>
      <li>Forum mit tausenden Erfahrungen anderer Nutzer</li>
    </ul>
    <p style="font-size:16px; line-height:1.5;">
      Starte direkt mit dem <strong>Bescheid-Scan</strong> oder einer Frage im Chat.
    </p>
    <p style="margin-top:24px;">
      <a href="https://app.bescheidboxer.de/dashboard"
         style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:8px; font-weight:600;">
        Zum Dashboard
      </a>
    </p>
    <p style="font-size:14px; line-height:1.5; color:#555; margin-top:24px;">
      Fragen? Antworte einfach auf diese Mail.
    </p>
  `
  await sendMail({
    to,
    subject: 'Willkommen bei BescheidBoxer',
    html: layout('Willkommen bei BescheidBoxer', body),
    text: `Willkommen bei BescheidBoxer! Ab sofort hast du Zugriff auf den KI-Assistenten, Bescheid-Scan und das Forum. Zum Dashboard: https://app.bescheidboxer.de/dashboard`,
  })
}

export async function sendSubscriptionConfirmedMail(
  to: string,
  planId: string,
  creditsPerMonth: number
): Promise<void> {
  const planName = PLAN_NAMES[planId] || planId
  const body = `
    <p style="font-size:16px; line-height:1.5;">Hallo,</p>
    <p style="font-size:16px; line-height:1.5;">
      dein <strong>${planName}-Abo</strong> ist aktiv. Du hast jetzt
      <strong>${creditsPerMonth} Credits</strong> pro Monat und alle
      Leistungen deines Plans freigeschaltet.
    </p>
    <p style="font-size:16px; line-height:1.5;">
      Die Abrechnung laeuft automatisch ueber Stripe. Rechnungen findest du
      jederzeit im Dashboard.
    </p>
    <p style="margin-top:24px;">
      <a href="https://app.bescheidboxer.de/dashboard"
         style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:8px; font-weight:600;">
        Zum Dashboard
      </a>
    </p>
    <p style="font-size:14px; line-height:1.5; color:#555; margin-top:24px;">
      Du kannst dein Abo jederzeit im Dashboard kuendigen.
    </p>
  `
  await sendMail({
    to,
    subject: `Dein ${planName}-Abo ist aktiv`,
    html: layout(`Dein ${planName}-Abo ist aktiv`, body),
    text: `Dein ${planName}-Abo ist aktiv. Du hast jetzt ${creditsPerMonth} Credits pro Monat. Zum Dashboard: https://app.bescheidboxer.de/dashboard`,
  })
}

export async function sendSubscriptionCancelledMail(to: string): Promise<void> {
  const body = `
    <p style="font-size:16px; line-height:1.5;">Hallo,</p>
    <p style="font-size:16px; line-height:1.5;">
      dein Abo wurde beendet. Dein Account ist auf den kostenlosen
      <strong>Schnupperer-Plan</strong> zurueckgesetzt.
    </p>
    <p style="font-size:16px; line-height:1.5;">
      Du kannst BescheidBoxer weiter nutzen: bis zu 5 Chat-Nachrichten pro
      Tag und 2 Bescheid-Scans pro Monat bleiben kostenlos.
    </p>
    <p style="margin-top:24px;">
      <a href="https://app.bescheidboxer.de/preise"
         style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:8px; font-weight:600;">
        Plaene ansehen
      </a>
    </p>
    <p style="font-size:14px; line-height:1.5; color:#555; margin-top:24px;">
      Falls die Kuendigung versehentlich passiert ist, kannst du jederzeit
      wieder upgraden.
    </p>
  `
  await sendMail({
    to,
    subject: 'Dein Abo wurde beendet',
    html: layout('Dein Abo wurde beendet', body),
    text: `Dein Abo wurde beendet. Dein Account ist auf den kostenlosen Schnupperer-Plan zurueckgesetzt. Plaene: https://app.bescheidboxer.de/preise`,
  })
}
