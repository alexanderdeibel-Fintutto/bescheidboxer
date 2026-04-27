import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  PlanType,
  UserCredits,
  canAskQuestion,
  canGenerateLetter,
  canScanBescheid,
  canPostInForum,
} from '@/lib/credits'
import { useAuth } from '@/contexts/AuthContext'
import { incrementChat, incrementLetter, incrementScan } from '@/lib/quota'

interface CreditsContextType {
  credits: UserCredits | null
  checkQuestion: () => { allowed: boolean; reason?: string }
  checkLetter: () => { allowed: boolean; reason?: string; cost: number }
  checkScan: () => { allowed: boolean; reason?: string }
  checkForum: () => { allowed: boolean; reason?: string }
  consumeQuestion: () => Promise<void>
  consumeLetter: () => Promise<void>
  consumeScan: () => Promise<void>
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

/**
 * Default für Besucher ohne eingeloggten Account (Schnupperer).
 * Wird genutzt, solange AuthContext.profile === null ist.
 */
const GUEST_CREDITS: UserCredits = {
  userId: 'guest',
  plan: 'schnupperer' as PlanType,
  creditsAktuell: 5,
  chatMessagesUsedToday: 0,
  lettersGeneratedThisMonth: 0,
  scansThisMonth: 0,
  periodStart: new Date(),
  periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
}

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { profile, user, refreshProfile } = useAuth()
  const [credits, setCredits] = useState<UserCredits>(GUEST_CREDITS)

  // Profil -> Credits spiegeln. Single-Source-of-Truth ist das
  // Datenbank-Profil aus AuthContext.
  useEffect(() => {
    if (!profile) {
      setCredits(GUEST_CREDITS)
      return
    }
    setCredits({
      userId: profile.id,
      plan: profile.plan,
      creditsAktuell: profile.creditsCurrent,
      chatMessagesUsedToday: profile.chatMessagesUsedToday,
      lettersGeneratedThisMonth: profile.lettersGeneratedThisMonth,
      scansThisMonth: profile.scansThisMonth,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
  }, [profile])

  const checkQuestion = () => canAskQuestion(credits)
  const checkLetter = () => canGenerateLetter(credits)
  const checkScan = () => canScanBescheid(credits)
  const checkForum = () => canPostInForum()

  // Hinweis: Die eigentliche Buchhaltung läuft DB-seitig.
  // Nach erfolgreichem Increment laden wir das Profil neu, damit
  // die UI den Stand aus der DB spiegelt.
  const consumeQuestion = async () => {
    setCredits((prev) => ({
      ...prev,
      chatMessagesUsedToday: prev.chatMessagesUsedToday + 1,
    }))
    if (user?.id) {
      await incrementChat(user.id)
      await refreshProfile()
    }
  }

  const consumeLetter = async () => {
    setCredits((prev) => ({
      ...prev,
      lettersGeneratedThisMonth: prev.lettersGeneratedThisMonth + 1,
    }))
    if (user?.id) {
      await incrementLetter(user.id)
      await refreshProfile()
    }
  }

  const consumeScan = async () => {
    setCredits((prev) => ({
      ...prev,
      scansThisMonth: prev.scansThisMonth + 1,
    }))
    if (user?.id) {
      await incrementScan(user.id)
      await refreshProfile()
    }
  }

  return (
    <CreditsContext.Provider
      value={{
        credits,
        checkQuestion,
        checkLetter,
        checkScan,
        checkForum,
        consumeQuestion,
        consumeLetter,
        consumeScan,
      }}
    >
      {children}
    </CreditsContext.Provider>
  )
}

export function useCreditsContext() {
  const context = useContext(CreditsContext)
  if (context === undefined) {
    throw new Error('useCreditsContext must be used within a CreditsProvider')
  }
  return context
}
