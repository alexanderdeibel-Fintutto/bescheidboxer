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
    letterPrice: 2.99,
    tier: 0,
  },
  starter: {
    name: 'Starter',
    price: 2.99,
    priceYearly: 29.99,
    creditsPerMonth: 10,
    chatMessagesPerDay: 10,
    lettersPerMonth: 1,
    bescheidScansPerMonth: 3,
    forumAccess: 'read_post_chat_limited',
    postversandInklusive: 0,
    prioritySupport: false,
    mieterAppInklusive: false,
    letterPrice: 1.99,
    tier: 1,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_STARTER_MONTH || '',
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_STARTER_YEAR || '',
  },
  kaempfer: {
    name: 'Kaempfer',
    price: 4.99,
    priceYearly: 49.99,
    creditsPerMonth: 25,
    chatMessagesPerDay: -1,
    lettersPerMonth: 3,
    bescheidScansPerMonth: -1,
    forumAccess: 'full',
    postversandInklusive: 1,
    prioritySupport: true,
    mieterAppInklusive: 'basic',
    letterPrice: 0.99,
    tier: 2,
    badge: 'Beliebt',
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_KAEMPFER_MONTH || '',
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_KAEMPFER_YEAR || '',
  },
  vollschutz: {
    name: 'Vollschutz',
    price: 7.99,
    priceYearly: 79.99,
    creditsPerMonth: 50,
    chatMessagesPerDay: -1,
    lettersPerMonth: -1,
    bescheidScansPerMonth: -1,
    forumAccess: 'vip',
    postversandInklusive: 3,
    prioritySupport: true,
    mieterAppInklusive: 'premium',
    letterPrice: 0,
    tier: 3,
    badge: 'VIP',
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
 * Die stripePriceId wird zur Laufzeit aus VITE_STRIPE_PRICE_CREDITS_*
 * gelesen, damit Test-Mode vs Production-Mode ohne Code-Change
 * umschaltbar sind. Setze die ENV-Variablen in Vercel fuer Preview
 * und Production jeweils auf die richtige price_*-ID.
 *
 * Fallback auf leeren String, wenn ENV nicht gesetzt ist -> Buttons
 * zeigen einen Support-Fehler an, statt zu einem leeren Checkout zu
 * leiten.
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
        reason: 'Du hast deine 5 kostenlosen Nachrichten fuer heute aufgebraucht. Upgrade auf Starter fuer 10/Tag oder Kaempfer fuer unbegrenzt.',
      }
    }
    return {
      allowed: false,
      reason: `Tageslimit von ${plan.chatMessagesPerDay} Nachrichten erreicht. Upgrade auf Kaempfer fuer unbegrenzten Chat.`,
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
      reason: 'Einzelkauf: Personalisiertes Schreiben fuer dich erstellt.',
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
      reason: `Scan-Limit (${plan.bescheidScansPerMonth}/Monat) erreicht. Upgrade fuer mehr Scans.`,
    }
  }
  return { allowed: true }
}

export function canPostInForum(): { allowed: boolean; reason?: string } {
  return { allowed: true }
}
