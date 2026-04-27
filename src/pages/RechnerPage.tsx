import { Link } from 'react-router-dom'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import {
  Calculator,
  Home,
  Heart,
  TrendingUp,
  AlertTriangle,
  PiggyBank,
  Clock,
  Scale,
  ShoppingBag,
  Truck,
  MessageCircle,
  GitCompare,
  Wallet,
  MapPin,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import RechtlicherHinweis from '@/components/RechtlicherHinweis'
import {
  PageHero,
  SectionWrapper,
  FadeSection,
  PrimaryButton,
} from '@/lib/fintutto-design'

const calculators = [
  {
    id: 'buergergeld',
    title: 'Bürgergeld-Rechner',
    description:
      'Voller Bürgergeld-Anspruch inkl. Regelbedarf, KdU und Mehrbedarf — in 60 Sekunden.',
    icon: Calculator,
    route: '/rechner/buergergeld',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    id: 'kdu',
    title: 'KdU-Rechner',
    description: 'Sind deine Mietkosten angemessen? Prüfe es für deine Stadt.',
    icon: Home,
    route: '/rechner/kdu',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    id: 'mehrbedarf',
    title: 'Mehrbedarf-Rechner',
    description: 'Schwanger, alleinerziehend, behindert? Berechne deinen Mehrbedarf.',
    icon: Heart,
    route: '/rechner/mehrbedarf',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
  },
  {
    id: 'freibetrag',
    title: 'Freibetrags-Rechner',
    description: 'Wie viel darfst du verdienen ohne Kürzung? Hier ist die Antwort.',
    icon: TrendingUp,
    route: '/rechner/freibetrag',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    id: 'sanktion',
    title: 'Sanktions-Rechner',
    description:
      'Sanktion bekommen? Prüfe ob sie rechtmäßig ist und wie hoch sie maximal sein darf.',
    icon: AlertTriangle,
    route: '/rechner/sanktion',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
  },
  {
    id: 'schonvermoegen',
    title: 'Schonvermögens-Rechner',
    description: 'Wie viel Vermögen darfst du behalten? Prüfe deine Freibeträge.',
    icon: PiggyBank,
    route: '/rechner/schonvermoegen',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'fristen',
    title: 'Fristen-Rechner',
    description:
      'Wann läuft deine Frist ab? Widerspruch, Klage, Anhörung — alles berechnet.',
    icon: Clock,
    route: '/rechner/fristen',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    id: 'pkh',
    title: 'PKH-Rechner',
    description:
      'Prozesskostenhilfe: Anspruch auf kostenlose Anwaltshilfe beim Sozialgericht?',
    icon: Scale,
    route: '/rechner/pkh',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
  },
  {
    id: 'erstausstattung',
    title: 'Erstausstattungs-Rechner',
    description: 'Erste Wohnung, Baby oder Trennung? Dein Anspruch nach § 24 SGB II.',
    icon: ShoppingBag,
    route: '/rechner/erstausstattung',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    id: 'umzugskosten',
    title: 'Umzugskosten-Rechner',
    description:
      'Erstattungsfähige Umzugskosten nach § 22 Abs. 6 SGB II inkl. Kaution als Darlehen.',
    icon: Truck,
    route: '/rechner/umzugskosten',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
  },
  {
    id: 'vergleich',
    title: 'Bescheid-Vergleich',
    description: 'Zwei Bescheide nebeneinander. Abweichungen? Sofort sichtbar.',
    icon: GitCompare,
    route: '/rechner/vergleich',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
  },
  {
    id: 'einkommen',
    title: 'Einkommens-Übersicht',
    description:
      'Erfasse dein Monatseinkommen und sieh, wie viel davon auf dein Bürgergeld angerechnet wird.',
    icon: Wallet,
    route: '/rechner/einkommen',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
  },
  {
    id: 'haushalt',
    title: 'Haushalts-Planer',
    description: 'Plane dein Budget: Einnahmen und Ausgaben im Überblick — mit Spar-Tipps.',
    icon: Home,
    route: '/rechner/haushalt',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    id: 'mietspiegel',
    title: 'Mietspiegel-Rechner',
    description: 'Ist deine Miete angemessen? Prüfe die KdU-Grenzen für deine Stadt.',
    icon: MapPin,
    route: '/rechner/mietspiegel',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
  },
]

export default function RechnerPage() {
  useDocumentTitle('AmtsRechner-Suite')

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO                                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <PageHero
        badge="14 Rechner · Kostenlos · Anonym"
        title="AmtsRechner."
        titleGradient="Was dir wirklich zusteht."
        subtitle="Bürgergeld, KdU, Mehrbedarf, Freibetrag, Sanktion, Schonvermögen, Fristen, PKH und mehr — sofort die Zahl, die zählt."
        ambientGlow={false}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. CALCULATOR GRID                                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, i) => (
            <FadeSection key={calc.id} delay={i * 50}>
              <Link to={calc.route} className="block h-full group">
                <Card className="h-full rounded-2xl border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex p-3 rounded-xl ${calc.bgColor} mb-4`}
                    >
                      <calc.icon className={`h-6 w-6 ${calc.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {calc.description}
                    </p>
                    <div className="inline-flex items-center text-primary font-semibold text-sm gap-1.5 group-hover:gap-2.5 transition-all">
                      Jetzt berechnen
                      <span aria-hidden>→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. CTA — KI-Berater Anschluss                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <FadeSection className="max-w-3xl mx-auto">
          <Card className="rounded-3xl border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-boxer text-white mb-6 shadow-lg shadow-red-500/20">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Rechner reichen dir nicht?
              </h2>
              <p className="text-muted-foreground text-lg mb-7 max-w-xl mx-auto">
                Unsere KI-Rechtsberatung beantwortet deine individuellen Fragen — zu
                Bürgergeld, Widerspruch, Mehrbedarf und allem dazwischen.
              </p>
              <PrimaryButton to="/chat" showArrow={false}>
                <MessageCircle className="w-5 h-5" />
                Frage stellen
              </PrimaryButton>
            </CardContent>
          </Card>
        </FadeSection>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. LEGAL DISCLAIMER                                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="container py-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <RechtlicherHinweis />
        </div>
      </section>
    </div>
  )
}
