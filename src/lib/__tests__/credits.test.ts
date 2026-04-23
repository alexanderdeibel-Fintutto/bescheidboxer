import { describe, it, expect } from 'vitest'
import {
  PLANS,
  canAskQuestion,
  canGenerateLetter,
  canScanBescheid,
  type UserCredits,
} from '../credits'

describe('PLANS Configuration', () => {
  it('should have all four plan types defined', () => {
    expect(PLANS.schnupperer).toBeDefined()
    expect(PLANS.starter).toBeDefined()
    expect(PLANS.kaempfer).toBeDefined()
    expect(PLANS.vollschutz).toBeDefined()
  })

  it('should have correct pricing for monthly plans', () => {
    expect(PLANS.schnupperer.price).toBe(0)
    expect(PLANS.starter.price).toBe(2.99)
    expect(PLANS.kaempfer.price).toBe(4.99)
    expect(PLANS.vollschutz.price).toBe(7.99)
  })

  it('should have correct yearly pricing', () => {
    expect(PLANS.schnupperer.priceYearly).toBe(0)
    expect(PLANS.starter.priceYearly).toBe(29.99)
    expect(PLANS.kaempfer.priceYearly).toBe(49.99)
    expect(PLANS.vollschutz.priceYearly).toBe(79.99)
  })

  it('should have correct chat message limits per day', () => {
    expect(PLANS.schnupperer.chatMessagesPerDay).toBe(5)
    expect(PLANS.starter.chatMessagesPerDay).toBe(10)
    expect(PLANS.kaempfer.chatMessagesPerDay).toBe(-1) // unlimited
    expect(PLANS.vollschutz.chatMessagesPerDay).toBe(-1) // unlimited
  })

  it('should have correct letters per month', () => {
    expect(PLANS.schnupperer.lettersPerMonth).toBe(0)
    expect(PLANS.starter.lettersPerMonth).toBe(1)
    expect(PLANS.kaempfer.lettersPerMonth).toBe(3)
    expect(PLANS.vollschutz.lettersPerMonth).toBe(-1) // unlimited
  })

  it('should have correct Bescheid scans per month', () => {
    expect(PLANS.schnupperer.bescheidScansPerMonth).toBe(2)
    expect(PLANS.starter.bescheidScansPerMonth).toBe(3)
    expect(PLANS.kaempfer.bescheidScansPerMonth).toBe(-1) // unlimited
    expect(PLANS.vollschutz.bescheidScansPerMonth).toBe(-1) // unlimited
  })

  it('should have correct forum access levels', () => {
    expect(PLANS.schnupperer.forumAccess).toBe('read_post')
    expect(PLANS.starter.forumAccess).toBe('read_post_chat_limited')
    expect(PLANS.kaempfer.forumAccess).toBe('full')
    expect(PLANS.vollschutz.forumAccess).toBe('vip')
  })

  it('should have correct letter prices', () => {
    expect(PLANS.schnupperer.letterPrice).toBe(2.99)
    expect(PLANS.starter.letterPrice).toBe(1.99)
    expect(PLANS.kaempfer.letterPrice).toBe(0.99)
    expect(PLANS.vollschutz.letterPrice).toBe(0)
  })

  it('should indicate priority support correctly', () => {
    expect(PLANS.schnupperer.prioritySupport).toBe(false)
    expect(PLANS.starter.prioritySupport).toBe(false)
    expect(PLANS.kaempfer.prioritySupport).toBe(true)
    expect(PLANS.vollschutz.prioritySupport).toBe(true)
  })

  it('should have correct MieterApp inclusion', () => {
    expect(PLANS.schnupperer.mieterAppInklusive).toBe(false)
    expect(PLANS.starter.mieterAppInklusive).toBe(false)
    expect(PLANS.kaempfer.mieterAppInklusive).toBe('basic')
    expect(PLANS.vollschutz.mieterAppInklusive).toBe('premium')
  })

  it('should have correct post versand amounts', () => {
    expect(PLANS.schnupperer.postversandInklusive).toBe(0)
    expect(PLANS.starter.postversandInklusive).toBe(0)
    expect(PLANS.kaempfer.postversandInklusive).toBe(1)
    expect(PLANS.vollschutz.postversandInklusive).toBe(3)
  })

  it('should have correct tier levels', () => {
    expect(PLANS.schnupperer.tier).toBe(0)
    expect(PLANS.starter.tier).toBe(1)
    expect(PLANS.kaempfer.tier).toBe(2)
    expect(PLANS.vollschutz.tier).toBe(3)
  })

  it('should have badges for paid plans', () => {
    expect(PLANS.schnupperer.badge).toBeUndefined()
    expect(PLANS.starter.badge).toBeUndefined()
    expect(PLANS.kaempfer.badge).toBe('Beliebt')
    expect(PLANS.vollschutz.badge).toBe('VIP')
  })
})

describe('canAskQuestion', () => {
  it('should allow unlimited chat for Kaempfer plan', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'kaempfer',
      creditsAktuell: 50,
      chatMessagesUsedToday: 1000,
      lettersGeneratedThisMonth: 5,
      scansThisMonth: 10,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canAskQuestion(credits)
    expect(result.allowed).toBe(true)
  })

  it('should allow unlimited chat for Vollschutz plan', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'vollschutz',
      creditsAktuell: 50,
      chatMessagesUsedToday: 5000,
      lettersGeneratedThisMonth: 100,
      scansThisMonth: 100,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canAskQuestion(credits)
    expect(result.allowed).toBe(true)
  })

  it('should allow chat within limit for Schnupperer (5/day)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'schnupperer',
      creditsAktuell: 0,
      chatMessagesUsedToday: 3,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 0,
      periodStart: new Date('2025-03-24'),
      periodEnd: new Date('2025-03-24'),
    }
    const result = canAskQuestion(credits)
    expect(result.allowed).toBe(true)
  })

  it('should deny chat when Schnupperer reaches daily limit', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'schnupperer',
      creditsAktuell: 0,
      chatMessagesUsedToday: 5,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 0,
      periodStart: new Date('2025-03-24'),
      periodEnd: new Date('2025-03-24'),
    }
    const result = canAskQuestion(credits)
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('5 kostenlosen Nachrichten')
  })

  it('should allow chat within limit for Starter (10/day)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'starter',
      creditsAktuell: 10,
      chatMessagesUsedToday: 8,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 1,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canAskQuestion(credits)
    expect(result.allowed).toBe(true)
  })

  it('should deny chat when Starter reaches daily limit', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'starter',
      creditsAktuell: 10,
      chatMessagesUsedToday: 10,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 1,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canAskQuestion(credits)
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Tageslimit')
  })
})

describe('canGenerateLetter', () => {
  it('should allow unlimited letters for Vollschutz plan', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'vollschutz',
      creditsAktuell: 50,
      chatMessagesUsedToday: 50,
      lettersGeneratedThisMonth: 100,
      scansThisMonth: 50,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canGenerateLetter(credits)
    expect(result.allowed).toBe(true)
    expect(result.cost).toBe(0)
  })

  it('should allow free letters for Kaempfer within monthly limit', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'kaempfer',
      creditsAktuell: 25,
      chatMessagesUsedToday: 20,
      lettersGeneratedThisMonth: 2,
      scansThisMonth: 10,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canGenerateLetter(credits)
    expect(result.allowed).toBe(true)
    expect(result.cost).toBe(0)
  })

  it('should charge for extra letters after Kaempfer limit (3/month)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'kaempfer',
      creditsAktuell: 25,
      chatMessagesUsedToday: 20,
      lettersGeneratedThisMonth: 3,
      scansThisMonth: 10,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canGenerateLetter(credits)
    expect(result.allowed).toBe(true)
    expect(result.cost).toBe(0.99)
  })

  it('should allow letter for Starter within monthly limit', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'starter',
      creditsAktuell: 10,
      chatMessagesUsedToday: 10,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 1,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canGenerateLetter(credits)
    expect(result.allowed).toBe(true)
    expect(result.cost).toBe(0)
  })

  it('should charge for extra letters after Starter limit (1/month)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'starter',
      creditsAktuell: 10,
      chatMessagesUsedToday: 10,
      lettersGeneratedThisMonth: 1,
      scansThisMonth: 1,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canGenerateLetter(credits)
    expect(result.allowed).toBe(true)
    expect(result.cost).toBe(1.99)
  })

  it('should charge individual price for Schnupperer (free plan)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'schnupperer',
      creditsAktuell: 0,
      chatMessagesUsedToday: 3,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 1,
      periodStart: new Date('2025-03-24'),
      periodEnd: new Date('2025-03-24'),
    }
    const result = canGenerateLetter(credits)
    expect(result.allowed).toBe(true)
    expect(result.cost).toBe(2.99)
  })
})

describe('canScanBescheid', () => {
  it('should allow unlimited scans for Kaempfer plan', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'kaempfer',
      creditsAktuell: 25,
      chatMessagesUsedToday: 20,
      lettersGeneratedThisMonth: 2,
      scansThisMonth: 100,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canScanBescheid(credits)
    expect(result.allowed).toBe(true)
  })

  it('should allow unlimited scans for Vollschutz plan', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'vollschutz',
      creditsAktuell: 50,
      chatMessagesUsedToday: 50,
      lettersGeneratedThisMonth: 50,
      scansThisMonth: 1000,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canScanBescheid(credits)
    expect(result.allowed).toBe(true)
  })

  it('should allow scans within limit for Schnupperer (2/month)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'schnupperer',
      creditsAktuell: 0,
      chatMessagesUsedToday: 2,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 1,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canScanBescheid(credits)
    expect(result.allowed).toBe(true)
  })

  it('should deny scan when Schnupperer reaches limit (2/month)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'schnupperer',
      creditsAktuell: 0,
      chatMessagesUsedToday: 2,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 2,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canScanBescheid(credits)
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Scan-Limit')
  })

  it('should allow scans within limit for Starter (3/month)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'starter',
      creditsAktuell: 10,
      chatMessagesUsedToday: 10,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 2,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canScanBescheid(credits)
    expect(result.allowed).toBe(true)
  })

  it('should deny scan when Starter reaches limit (3/month)', () => {
    const credits: UserCredits = {
      userId: 'user123',
      plan: 'starter',
      creditsAktuell: 10,
      chatMessagesUsedToday: 10,
      lettersGeneratedThisMonth: 0,
      scansThisMonth: 3,
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
    }
    const result = canScanBescheid(credits)
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('3/Monat')
  })
})

describe('Plan Feature Comparison', () => {
  it('should have progressive feature unlock across plans', () => {
    const chatMessagesSchnupperer = PLANS.schnupperer.chatMessagesPerDay
    const chatMessagesStarter = PLANS.starter.chatMessagesPerDay
    const chatMessagesKaempfer = PLANS.kaempfer.chatMessagesPerDay

    expect(chatMessagesSchnupperer).toBeLessThan(chatMessagesStarter)
    // Starter (10) has a limit, Kaempfer (-1) is unlimited
    expect(chatMessagesStarter).toBeGreaterThan(0)
    expect(chatMessagesKaempfer).toBe(-1)
  })

  it('should have progressive pricing', () => {
    expect(PLANS.schnupperer.price).toBeLessThan(PLANS.starter.price)
    expect(PLANS.starter.price).toBeLessThan(PLANS.kaempfer.price)
    expect(PLANS.kaempfer.price).toBeLessThan(PLANS.vollschutz.price)
  })

  it('should have consistent yearly discount (~20%)', () => {
    const starterDiscount = (PLANS.starter.price * 12 - PLANS.starter.priceYearly) / (PLANS.starter.price * 12)
    const kaempferDiscount = (PLANS.kaempfer.price * 12 - PLANS.kaempfer.priceYearly) / (PLANS.kaempfer.price * 12)
    const vollschutzDiscount = (PLANS.vollschutz.price * 12 - PLANS.vollschutz.priceYearly) / (PLANS.vollschutz.price * 12)

    expect(starterDiscount).toBeGreaterThan(0.15)
    expect(starterDiscount).toBeLessThan(0.35)
    expect(kaempferDiscount).toBeGreaterThan(0.15)
    expect(vollschutzDiscount).toBeGreaterThan(0.15)
  })
})
