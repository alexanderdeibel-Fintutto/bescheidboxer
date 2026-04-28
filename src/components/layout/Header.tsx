import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Swords, MessageCircle, FileText, Users, Menu, X, CreditCard, ScanSearch, Calculator, ClipboardList, User, Sun, Moon, Monitor, Zap, StickyNote, FolderOpen, BookOpen, CheckSquare, BarChart3, Calendar, Briefcase, AlertTriangle, FolderKanban, Scale, GraduationCap, Archive, Wallet, Bell, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import FristAlarm from '@/components/FristAlarm'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const navigation = [
  { name: 'BescheidScan', href: '/scan', icon: ScanSearch },
  { name: 'KI-Berater', href: '/chat', icon: MessageCircle },
  { name: 'Rechner', href: '/rechner', icon: Calculator },
  { name: 'Dokumenten-Werkstatt', href: '/musterschreiben', icon: FileText },
  { name: 'Tracker', href: '/tracker', icon: ClipboardList },
  { name: 'Community', href: '/forum', icon: Users },
  { name: 'Preise', href: '/preise', icon: CreditCard },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const cycle = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(next)
  }
  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      title={theme === 'light' ? 'Hell (klick für Dunkel)' : theme === 'dark' ? 'Dunkel (klick für System)' : 'System (klick für Hell)'}
    >
      {theme === 'light' && <Sun className="h-4 w-4" />}
      {theme === 'dark' && <Moon className="h-4 w-4" />}
      {theme === 'system' && <Monitor className="h-4 w-4" />}
    </button>
  )
}

const schnellzugriffItems = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Meine Faelle', href: '/faelle', icon: FolderKanban },
  { name: 'Termine', href: '/termine', icon: Calendar },
  { name: 'Bewerbungen', href: '/bewerbungen', icon: Briefcase },
  { name: 'Dokumente', href: '/dokumente', icon: FolderOpen },
  { name: 'Notizen', href: '/notizen', icon: StickyNote },
  { name: 'Lernbereich', href: '/lernen', icon: GraduationCap },
  { name: 'Anwaltssuche', href: '/anwaltssuche', icon: Scale },
  { name: 'Bescheid-Archiv', href: '/bescheid-archiv', icon: Archive },
  { name: 'Kosten-Uebersicht', href: '/kosten', icon: Wallet },
  { name: 'Erinnerungen', href: '/erinnerungen', icon: Bell },
  { name: 'Checklisten', href: '/checklisten', icon: CheckSquare },
  { name: 'Glossar', href: '/glossar', icon: BookOpen },
  { name: 'Notfall-Hilfe', href: '/notfall', icon: AlertTriangle },
]

function AuthArea() {
  const { user, profile, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSignOut = async () => {
    try {
      await signOut()
      setOpen(false)
      toast.success('Abgemeldet')
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Abmeldung fehlgeschlagen')
    }
  }

  if (loading) {
    return <div className="h-9 w-24 rounded-full bg-muted animate-pulse" />
  }

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Anmelden</Link>
        </Button>
        <Button size="sm" variant="amt" className="rounded-full" asChild>
          <Link to="/register">Kostenlos starten</Link>
        </Button>
      </>
    )
  }

  // Eingeloggt — Dropdown-Menu
  const initials = (profile?.name || profile?.email || user.email || '?')
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  const planLabel = profile?.plan
    ? profile.plan === 'schnupperer'
      ? 'Schnupperer'
      : profile.plan === 'starter'
      ? 'Starter'
      : profile.plan === 'kaempfer'
      ? 'Kämpfer'
      : 'Vollschutz'
    : null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-border px-2 py-1 hover:bg-muted transition-colors"
        aria-label="Mein Konto"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full gradient-boxer text-white text-xs font-bold">
          {initials || <User className="h-3.5 w-3.5" />}
        </span>
        <span className="text-sm font-medium hidden lg:inline max-w-[120px] truncate">
          {profile?.name || user.email?.split('@')[0]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-xs text-muted-foreground">Angemeldet als</p>
            <p className="font-semibold text-sm truncate">{user.email}</p>
            {planLabel && (
              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {planLabel}-Plan
              </span>
            )}
          </div>
          <div className="py-1">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              <BarChart3 className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              to="/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4" /> Profil
            </Link>
            <Link
              to="/preise"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              <CreditCard className="h-4 w-4" /> Plan & Preise
            </Link>
          </div>
          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      onClose()
      toast.success('Abgemeldet')
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Abmeldung fehlgeschlagen')
    }
  }

  if (!user) {
    return (
      <>
        <Button variant="outline" className="w-full rounded-full" asChild>
          <Link to="/login" onClick={onClose}>
            Anmelden
          </Link>
        </Button>
        <Button className="w-full rounded-full" variant="amt" asChild>
          <Link to="/register" onClick={onClose}>
            Kostenlos starten
          </Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <div className="px-3 py-2 mb-2 rounded-lg bg-muted/50">
        <p className="text-xs text-muted-foreground">Angemeldet als</p>
        <p className="font-semibold text-sm truncate">
          {profile?.name || user.email}
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full rounded-full text-destructive border-destructive/30 hover:bg-destructive/5"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Abmelden
      </Button>
    </>
  )
}

function Schnellzugriff() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        title="Schnellzugriff"
        aria-expanded={open}
      >
        <Zap className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-xl shadow-lg py-2 z-50">
          <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Schnellzugriff</p>
          {schnellzugriffItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="container flex items-center justify-between py-3" aria-label="Hauptnavigation">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="BescheidBoxer Startseite">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-boxer">
            <Swords className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg gradient-text-boxer">Bescheid</span>
            <span className="font-extrabold text-lg text-foreground/80">Boxer</span>
            <span className="text-xs block text-muted-foreground -mt-1">Dein KI-Assistent gegen falsche Bescheide</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link flex items-center gap-1.5 ${
                location.pathname.startsWith(item.href) ? 'nav-link-active' : ''
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <FristAlarm />
          <Schnellzugriff />
          <ThemeToggle />
          <AuthArea />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Menue schliessen' : 'Menue oeffnen'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 p-3 rounded-lg hover:bg-muted ${
                  location.pathname.startsWith(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Schnellzugriff</p>
              {schnellzugriffItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 space-y-2 border-t border-border">
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-muted-foreground">Erscheinungsbild</span>
                <ThemeToggle />
              </div>
              <Link
                to="/profil"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                Mein Profil
              </Link>
              <MobileAuthButtons onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
