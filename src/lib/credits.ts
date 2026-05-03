/**
 * Plan- und Credit-Konfiguration für BescheidBoxer.
 *
 * NEUE PREISGESTALTUNG (Stand 2026-05-01):
 *
 *   Schnupperer  0,00 €      Test-Tier, keine Bestandskunden zu schützen
 *   Starter      7,99 €/Mo   Einzel-Widerspruch-Workflow
 *   Profi       14,99 €/Mo   Highlight, "Beliebt" — unbegrenzt
 *   Premium     29,99 €/Mo   Alles + Frühzugang zu Coming-Soon-Features
 *
 * Die TypeScript-IDs (schnupperer/starter/kaempfer/vollschutz) bleiben
 * erhalten, damit die DB-Migration trivial bleibt — nur Display-Names,
 * Preise und Limits werden geändert. kaempfer = neuer "Profi"-Tier.
 *
 * Coming-Soon-Features (NICHT als verfügbar verkaufen, UWG-Risiko):
 *   - Einschreiben-Versand → in Premium als "Frühzugang" beworben
 *   - Anwalt-Hotline 15 Min/Mo → ebenfalls Premium-Frühzugang
 *   Stripe-Beschreibung muss "geplant für Q3 2026" enthalten.
 */
export type PlanType = 'schnupperer' | 'starter' | 'kaempfer' | 'vollschutz'

export interface PlanConfig {
  name: string
  price: number
  priceYearly: number
  creditsPerMonth: number
  chatMessagesPerDay: number
  lettersPerMonth: number
  bescheidScansPerMonth: number
  forumAccess: 'read_post' | 'read_post_chat_limited' | 'full' | 'vip'
  postversandInklusive: number
  prioritySupport: boolean
  mieterAppInklusive: boolean | 'basic' | 'premium'
  letterPrice: number
  tier: number
  badge?: string
  /** Liste mit "Coming Soon"-Features die im Tier als Frühzugang
   *  beworben werden. Wird NICHT als "jetzt verfügbar" verkauft. */
  comingSoonFeatures?: string[]
  stripePriceIdMonthly?: string
  stripePriceIdYearly?: string
}

export const PLANS: Record<PlanType, PlanConfig> = {
  schnupperer: {
    name: 'Schnupperer',
    price: 0,
    priceYearly: 0,
    creditsPerMonth: 0,
    chatMessagesPerDay: 5,
    lettersPerMonth: 0,
    bescheidScansPerMonth: 2,
    forumAccess: 'read_post',
    postversandInklusive: 0,
    prioritySupport: false,
    mieterAppInklusive: false,
    letterPrice: 9.99,
    tier: 0,
  },
  starter: {
    name: 'Starter',
    price: 7.99,
    priceYearly: 69,
    creditsPerMonth: 10,
    chatMessagesPerDay: 25,
    lettersPerMonth: 1,
    bescheidScansPerMonth: 5,
    forumAccess: 'read_post_chat_limited',
    postversandInklusive: 0,
    prioritySupport: false,
    mieterAppInklusive: false,
    letterPrice: 4.99,
    tier: 1,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_STARTER_MONTH || '',
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_STARTER_YEAR || '',
  },
  kaempfer: {
    name: 'Profi',
    price: 14.99,
    priceYearly: 129,
    creditsPerMonth: 50,
    chatMessagesPerDay: -1,
    lettersPerMonth: -1,
    bescheidScansPerMonth: -1,
    forumAccess: 'full',
    postversandInklusive: 0,
    prioritySupport: true,
    mieterAppInklusive: 'basic',
    letterPrice: 0,
    tier: 2,
    badge: 'Beliebt',
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_KAEMPFER_MONTH || '',
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_KAEMPFER_YEAR || '',
  },
  vollschutz: {
    name: 'Premium',
    price: 29.99,
    priceYearly: 249,
    creditsPerMonth: 150,
    chatMessagesPerDay: -1,
    lettersPerMonth: -1,
    bescheidScansPerMonth: -1,
    forumAccess: 'vip',
    postversandInklusive: 0,
    prioritySupport: true,
    mieterAppInklusive: 'premium',
    letterPrice: 0,
    tier: 3,
    badge: 'Premium',
    comingSoonFeatures: [
      'Einschreiben-Versand (Frühzugang, geplant Q3 2026)',
      'Anwalt-Hotline 15 Min/Monat (Frühzugang, geplant Q3 2026)',
      'Eigenes Dokumenten-Archiv mit Cloud-Backup',
    ],
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_VOLLSCHUTZ_MONTH || '',
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_VOLLSCHUTZ_YEAR || '',
  },
}

export const CREDIT_COSTS = {
  bescheidScan: 1,
  bescheidAnalyseDetail: 3,
  chatNachrichten5: 1,
  musterVorschau: 0,
  personalisierterBrief: 3,
  postversandStandard: 6,
  postversandEinschreiben: 10,
  privatchatProTag: 1,
}

/**
 * Credit-Top-up-Pakete (Einmalkauf, keine Subscription).
 *
 * Plus: NEU "Widerspruch-Paket Einzelfall" als Conversion-Bridge für
 * User die kein Abo wollen — 19,99 € einmalig, ein kompletter
 * Widerspruchs-Workflow (1 Scan + 1 KI-Analyse + 1 personalisierter
 * Brief). Stripe-Price separat unter VITE_STRIPE_PRICE_EINMAL_WIDERSPRUCH.
 */
export const CREDIT_PACKAGES = [
  {
    credits: 5,
    price: 4.99,
    label: '5 Credits',
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_CREDITS_S || '',
  },
  {
    credits: 15,
    price: 9.99,
    label: '15 Credits',
    discount: '11%',
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_CREDITS_M || '',
  },
  {
    credits: 40,
    price: 19.99,
    label: '40 Credits',
    discount: '25%',
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_CREDITS_L || '',
  },
]

/**
 * Einmal-Kauf "Widerspruch-Paket Einzelfall" — 19,99 € als Brücke
 * für User die kein Abo wollen, aber einmal einen Widerspruch brauchen.
 * Stripe-Produkt einmalig (keine Subscription).
 */
export const EINMAL_KAUF_WIDERSPRUCH = {
  label: 'Widerspruch-Paket Einzelfall',
  price: 19.99,
  beschreibung: 'Ein kompletter Widerspruch — Scan, KI-Analyse, personalisiertes Schreiben. Ohne Abo.',
  inkludiert: [
    '1 BescheidScan mit KI-Analyse',
    '1 personalisiertes Widerspruchs-Schreiben',
    'Frist-Tracker bis zur Erledigung',
    'Alle 14 Musterschreiben einsehbar',
  ],
  stripePriceId: import.meta.env.VITE_STRIPE_PRICE_EINMAL_WIDERSPRUCH || '',
}

export interface UserCredits {
  userId: string
  plan: PlanType
  creditsAktuell: number
  chatMessagesUsedToday: number
  lettersGeneratedThisMonth: number
  scansThisMonth: number
  periodStart: Date
  periodEnd: Date
}

export function canAskQuestion(credits: UserCredits): { allowed: boolean; reason?: string } {
  const plan = PLANS[credits.plan]
  if (plan.chatMessagesPerDay === -1) {
    return { allowed: true }
  }
  if (credits.chatMessagesUsedToday >= plan.chatMessagesPerDay) {
    if (credits.plan === 'schnupperer') {
      return {
        allowed: false,
        reason: 'Du hast deine 5 kostenlosen Nachrichten für heute aufgebraucht. Upgrade auf Starter für 25/Tag oder Profi für unbegrenzt.',
      }
    }
    return {
      allowed: false,
      reason: `Tageslimit von ${plan.chatMessagesPerDay} Nachrichten erreicht. Upgrade auf Profi für unbegrenzten Chat.`,
    }
  }
  return { allowed: true }
}

export function canGenerateLetter(credits: UserCredits): { allowed: boolean; reason?: string; cost: number } {
  const plan = PLANS[credits.plan]

  if (plan.lettersPerMonth === -1) {
    return { allowed: true, cost: 0 }
  }

  if (credits.plan === 'schnupperer') {
    return {
      allowed: true,
      cost: plan.letterPrice,
      reason: 'Einzelkauf: Personalisiertes Schreiben für dich erstellt.',
    }
  }

  if (credits.lettersGeneratedThisMonth < plan.lettersPerMonth) {
    return { allowed: true, cost: 0 }
  }

  return {
    allowed: true,
    cost: plan.letterPrice,
    reason: `Monatskontingent (${plan.lettersPerMonth}) aufgebraucht. Weitere: ${plan.letterPrice} EUR.`,
  }
}

export function canScanBescheid(credits: UserCredits): { allowed: boolean; reason?: string } {
  const plan = PLANS[credits.plan]
  if (plan.bescheidScansPerMonth === -1) {
    return { allowed: true }
  }
  if (credits.scansThisMonth >= plan.bescheidScansPerMonth) {
    return {
      allowed: false,
      reason: `Scan-Limit (${plan.bescheidScansPerMonth}/Monat) erreicht. Upgrade für mehr Scans.`,
    }
  }
  return { allowed: true }
}

export function canPostInForum(): { allowed: boolean; reason?: string } {
  return { allowed: true }
}
