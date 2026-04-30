import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CookieConsent from '@/components/CookieConsent'
import BackToTop from '@/components/BackToTop'
import SpotlightSearch from '@/components/SpotlightSearch'
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp'
import PageTransition from '@/components/PageTransition'
import MobileNavBar from '@/components/MobileNavBar'
import DeadlineBanner from '@/components/DeadlineBanner'
import PasswordSetGuard from '@/components/PasswordSetGuard'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Globaler Pflicht-Guard: User ohne Passwort werden auf
          /onboarding/passwort gezwungen — egal über welchen Pfad sie
          reinkommen (Magic-Link, Direkt-URL, alter Cache, etc.) */}
      <PasswordSetGuard />
      <a href="#main-content" className="skip-to-content">
        Zum Inhalt springen
      </a>
      <Header />
      {/* Globaler Frist-Banner — zeigt sich nur wenn akute Frist (<= 7 Tage) */}
      <DeadlineBanner />
      <main id="main-content" className="flex-1 pb-16 md:pb-0" role="main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <MobileNavBar />
      <BackToTop />
      <SpotlightSearch />
      <KeyboardShortcutsHelp />
      <CookieConsent />
    </div>
  )
}
