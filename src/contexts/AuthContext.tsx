import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { PlanType } from '@/lib/credits'

// ---------------------------------------------------------------------------
// Rollen
// ---------------------------------------------------------------------------
// Wir lesen profiles.role. Das Rollen-Set ist in der DB-Whitelist
// definiert (user, admin, superadmin, sales_agent, session_manager,
// tester, investor, press, viewer). Fuer BescheidBoxer interessieren
// uns primaer 'user' + 'admin'/'superadmin'. 'support' bleibt als
// lokaler Alias erhalten, damit alter UI-Code weiter kompiliert —
// wird aber in der DB nicht vergeben.
export type UserRole =
  | 'user'
  | 'admin'
  | 'superadmin'
  | 'support'
  | 'sales_agent'
  | 'session_manager'
  | 'tester'
  | 'investor'
  | 'press'
  | 'viewer'

interface UserProfile {
  id: string                  // profiles.id = auth.users.id (kein separater PK mehr)
  authId: string              // für Rueckwaerts-Kompatibilitaet == id
  email: string
  name: string | null
  plan: PlanType
  role: UserRole
  chatMessagesUsedToday: number
  lettersGeneratedThisMonth: number
  scansThisMonth: number
  creditsCurrent: number
  hasPassword: boolean        // True sobald der User ein Passwort gesetzt hat
                              // (via user_metadata.has_password oder signUp mit Passwort)
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signInWithMagicLink: (email: string, redirectTo?: string) => Promise<void>
  setPassword: (newPassword: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

/** Helper: hat dieser User bereits ein Passwort gesetzt?
 *  Wir prüfen primär user_metadata.has_password (eigenes Flag),
 *  fallback identities[provider='email'] (gibt es bei Magic-Link UND Passwort).
 *  Beim Magic-Link-Sign-Up setzen wir KEIN Flag — es muss nach Passwort-Setup
 *  via setPassword() gesetzt werden. Bei klassischem signUp() setzen wir
 *  has_password=true direkt. */
function userHasPassword(user: User | null): boolean {
  if (!user) return false
  return Boolean(user.user_metadata?.has_password)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ---------------------------------------------------------------------------
// Demo auth (localStorage-based, works without Supabase backend)
// ---------------------------------------------------------------------------

const DEMO_USERS_KEY = 'bescheidboxer_demo_users'
const DEMO_SESSION_KEY = 'bescheidboxer_demo_session'

interface DemoUser {
  id: string
  email: string
  name: string | null
  password: string
  plan: PlanType
  createdAt: string
}

function getDemoUsers(): DemoUser[] {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]')
  } catch { return [] }
}

function saveDemoUsers(users: DemoUser[]) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

function getDemoSession(): DemoUser | null {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveDemoSession(user: DemoUser | null) {
  if (user) {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(DEMO_SESSION_KEY)
  }
}

function generateId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// Simple password hashing for demo mode (NOT for production - use bcrypt server-side)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'bescheidboxer_salt_2026')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// True when a real Supabase anon key is provided via env
const hasRealSupabase = !!(
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !String(import.meta.env.VITE_SUPABASE_ANON_KEY).includes('placeholder')
)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasRealSupabase) {
      // Demo mode: restore session from localStorage
      const saved = getDemoSession()
      if (saved) {
        setUser({ id: saved.id, email: saved.email } as User)
        setProfile({
          id: saved.id,
          authId: saved.id,
          email: saved.email,
          name: saved.name,
          plan: saved.plan,
          role: 'user',
          chatMessagesUsedToday: 0,
          lettersGeneratedThisMonth: 0,
          scansThisMonth: 0,
          creditsCurrent: 5,
          hasPassword: true, // Demo-Mode: Passwort gilt als gesetzt
        })
      }
      setLoading(false)
      return
    }

    // Safety-Net: nach 4 Sekunden auf jeden Fall loading=false,
    // damit Header/RequireAuth nicht ewig im Loading-State haengen
    // wenn getSession() aus irgendeinem Grund nicht resolved.
    const safetyTimer = setTimeout(() => {
      setLoading(false)
    }, 4000)

    // Real Supabase mode — mit defensivem Error-Handling
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          // fetchProfile darf scheitern ohne loading zu blockieren
          fetchProfile(session.user.id, session.user.email ?? null).catch((err) =>
            console.error('fetchProfile failed:', err),
          )
        }
      })
      .catch((err) => {
        console.error('Supabase getSession() failed:', err)
      })
      .finally(() => {
        clearTimeout(safetyTimer)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email ?? null).catch((err) =>
          console.error('fetchProfile (onAuthStateChange) failed:', err),
        )
      } else {
        setProfile(null)
      }
      // Auch hier sicherstellen, dass loading false wird
      setLoading(false)
    })

    return () => {
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Profil laden.
   *
   * Wir lesen aus zwei Quellen:
   *   - profiles         : zentraler UAR (E-Mail, Name, Rolle)
   *   - bb_user_state    : BescheidBoxer-spezifischer State
   *                        (Plan, Credits, Verbrauch)
   *
   * Beide Tabellen sind über profiles.id = bb_user_state.user_id
   * verknuepft. Der Trigger handle_new_user() auf auth.users legt
   * die profiles-Zeile an; ein Trigger auf profiles legt bei
   * app_source='bescheidboxer' automatisch eine bb_user_state-Zeile
   * an. Fehlt bb_user_state trotzdem (z.B. Self-Heal bei User, die
   * vor der Migration angelegt wurden), legen wir ihn hier nach.
   */
  const fetchProfile = async (userId: string, fallbackEmail: string | null) => {
    // 1) profiles laden
    const { data: profileRow, error: profileErr } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, app_source')
      .eq('id', userId)
      .maybeSingle()

    if (profileErr) {
      console.error('Error fetching profiles:', profileErr)
    }

    // 2) bb_user_state laden (lazy-create, falls fehlt)
    let stateRow = await readBbState(userId)
    if (!stateRow) {
      const { data: inserted, error: insertErr } = await supabase
        .from('bb_user_state')
        .insert({ user_id: userId })
        .select('plan, credits_current, chat_messages_used_today, letters_generated_this_month, scans_this_month')
        .maybeSingle()
      if (insertErr) {
        console.warn('Konnte bb_user_state nicht anlegen (evtl. RLS):', insertErr)
      }
      stateRow = inserted ?? null
    }

    const email = profileRow?.email ?? fallbackEmail ?? ''
    const name = profileRow?.full_name ?? null
    const role = ((profileRow?.role as UserRole) || 'user')

    // Aktuellen User-State aus Supabase ziehen, damit user_metadata frisch ist
    const { data: { user: freshUser } } = await supabase.auth.getUser()

    setProfile({
      id: userId,
      authId: userId,
      email,
      name,
      plan: (stateRow?.plan as PlanType) || 'schnupperer',
      role,
      chatMessagesUsedToday: stateRow?.chat_messages_used_today || 0,
      lettersGeneratedThisMonth: stateRow?.letters_generated_this_month || 0,
      scansThisMonth: stateRow?.scans_this_month || 0,
      creditsCurrent: stateRow?.credits_current || 0,
      hasPassword: userHasPassword(freshUser),
    })
  }

  const readBbState = async (userId: string) => {
    const { data } = await supabase
      .from('bb_user_state')
      .select('plan, credits_current, chat_messages_used_today, letters_generated_this_month, scans_this_month')
      .eq('user_id', userId)
      .maybeSingle()
    return data ?? null
  }

  const refreshProfile = async () => {
    if (!hasRealSupabase) return
    if (user) {
      await fetchProfile(user.id, user.email ?? null)
    }
  }

  // ---- signIn ----
  const signIn = async (email: string, password: string) => {
    if (!hasRealSupabase) {
      const users = getDemoUsers()
      const hashedInput = await hashPassword(password)
      const found = users.find(u => u.email === email && u.password === hashedInput)
      if (!found) throw new Error('E-Mail oder Passwort falsch.')
      setUser({ id: found.id, email: found.email } as User)
      setProfile({
        id: found.id,
        authId: found.id,
        email: found.email,
        name: found.name,
        plan: found.plan,
        role: 'user',
        chatMessagesUsedToday: 0,
        lettersGeneratedThisMonth: 0,
        scansThisMonth: 0,
        creditsCurrent: 5,
        hasPassword: true, // Demo-Mode: Passwort gilt als gesetzt
      })
      saveDemoSession(found)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  // ---- signUp ----
  const signUp = async (email: string, password: string, name?: string) => {
    if (!hasRealSupabase) {
      const users = getDemoUsers()
      if (users.find(u => u.email === email)) {
        throw new Error('Diese E-Mail ist bereits registriert.')
      }
      const newUser: DemoUser = {
        id: generateId(),
        email,
        name: name || null,
        password: await hashPassword(password),
        plan: 'schnupperer',
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      saveDemoUsers(users)
      setUser({ id: newUser.id, email: newUser.email } as User)
      setProfile({
        id: newUser.id,
        authId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: 'schnupperer',
        role: 'user',
        chatMessagesUsedToday: 0,
        lettersGeneratedThisMonth: 0,
        scansThisMonth: 0,
        creditsCurrent: 5,
        hasPassword: true, // Demo-Mode: Passwort gilt als gesetzt
      })
      saveDemoSession(newUser)
      return
    }

    // Wichtig: app_source in user_metadata setzen, damit
    // handle_new_user() in der DB profiles.app_source='bescheidboxer'
    // anlegt. Dadurch feuert der Trigger ensure_bb_user_state()
    // automatisch und bb_user_state wird angelegt.
    // has_password=true wird gesetzt, weil bei signUp() ein Passwort
    // direkt mitgegeben wurde — User muss nicht mehr zum Setup.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          app_source: 'bescheidboxer',
          app_name: 'BescheidBoxer',
          app_url: 'https://bescheidboxer.de',
          full_name: name || null,
          display_name: name || null,
          has_password: true,
        },
      },
    })
    if (error) throw error

    if (data.user) {
      // Willkommens-Mail fire-and-forget. Fehler beim Mail-Versand
      // duerfen den Signup-Flow NIE blockieren.
      fetch('/api/amt-welcome-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || null }),
      }).catch((err) => {
        console.warn('Welcome-Mail konnte nicht getriggert werden:', err)
      })

      // Profil direkt nachladen. fetchProfile legt bb_user_state
      // als Fallback an, falls der DB-Trigger aus irgendeinem Grund
      // noch nicht gelaufen ist (z.B. bei bestehenden auth.users).
      await fetchProfile(data.user.id, email)
    }
  }

  // ---- signInWithMagicLink ----
  // Schickt einen Magic-Link an die E-Mail. User klickt drauf, wird
  // automatisch eingeloggt + zu redirectTo weitergeleitet (oder Default).
  const signInWithMagicLink = async (email: string, redirectTo?: string) => {
    if (!hasRealSupabase) {
      // Demo-Mode: erstelle/lade User direkt ohne Mail-Versand
      const users = getDemoUsers()
      let found = users.find(u => u.email === email)
      if (!found) {
        // Create new demo user without password
        found = {
          id: generateId(),
          email,
          name: null,
          password: '',
          plan: 'schnupperer',
          createdAt: new Date().toISOString(),
        }
        users.push(found)
        saveDemoUsers(users)
      }
      setUser({ id: found.id, email: found.email } as User)
      setProfile({
        id: found.id,
        authId: found.id,
        email: found.email,
        name: found.name,
        plan: found.plan,
        role: 'user',
        chatMessagesUsedToday: 0,
        lettersGeneratedThisMonth: 0,
        scansThisMonth: 0,
        creditsCurrent: 5,
        hasPassword: true, // Demo-Mode: Passwort gilt als gesetzt
      })
      saveDemoSession(found)
      return
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const emailRedirectTo = `${baseUrl}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
        // user_metadata für DB + Email-Template:
        // - app_source: technische ID (handle_new_user() in DB nutzt das)
        // - app_name + app_url: vom Supabase-Email-Template als
        //   {{ .Data.app_name }} / {{ .Data.app_url }} ausgelesen,
        //   damit die Mail "Anmelde-Link für BescheidBoxer" sagt
        //   und nicht generisch "Fintutto" — Multi-App-skalierbar:
        //   jede Fintutto-App schickt eigenen app_name/app_url mit.
        data: {
          app_source: 'bescheidboxer',
          app_name: 'BescheidBoxer',
          app_url: 'https://bescheidboxer.de',
        },
      },
    })
    if (error) throw error
  }

  // ---- setPassword ----
  // Wird auf der SetPasswordPage genutzt nach Erstanmeldung via Magic-Link.
  // Setzt Passwort + has_password=true im user_metadata.
  const setPassword = async (newPassword: string) => {
    if (!hasRealSupabase) {
      // Demo-Mode: Passwort lokal updaten
      const session = getDemoSession()
      if (!session) throw new Error('Nicht eingeloggt.')
      const users = getDemoUsers()
      const idx = users.findIndex((u) => u.id === session.id)
      if (idx === -1) throw new Error('User nicht gefunden.')
      users[idx].password = await hashPassword(newPassword)
      saveDemoUsers(users)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { has_password: true },
    })
    if (error) throw error

    // Profil refresh damit hasPassword=true im UI sichtbar wird
    if (user) {
      await fetchProfile(user.id, user.email ?? null).catch((err) =>
        console.error('fetchProfile after setPassword failed:', err),
      )
    }
  }

  // ---- signOut ----
  const signOut = async () => {
    if (!hasRealSupabase) {
      setUser(null)
      setProfile(null)
      saveDemoSession(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signInWithMagicLink,
        setPassword,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
