import { Home, MessagesSquare } from 'lucide-react'
import { FadeSection, GradientText, PrimaryButton, GhostButton } from '@/lib/fintutto-design'

export default function NotFoundPage() {
  return (
    <div className="container py-20 sm:py-28 text-center">
      <FadeSection>
        <div className="text-7xl sm:text-8xl font-extrabold mb-4">
          <GradientText>404</GradientText>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Seite nicht gefunden
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
          Diese Seite existiert nicht. Aber deine Rechte beim Amt — die existieren.
          Lass uns dir helfen, sie durchzusetzen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PrimaryButton to="/chat" showArrow={false}>
            <MessagesSquare className="w-4 h-4" />
            KI-Berater fragen
          </PrimaryButton>
          <GhostButton to="/" showArrow={false}>
            <Home className="w-4 h-4" />
            Zur Startseite
          </GhostButton>
        </div>
      </FadeSection>
    </div>
  )
}
