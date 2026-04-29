import useDocumentTitle from '@/hooks/useDocumentTitle'
import {
  ScanSearch,
  AlertTriangle,
  Calculator,
  FileText,
  MessageCircle,
  Heart,
  Eye,
  Lock,
  Sparkles,
  ExternalLink,
  Quote,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  PageHero,
  SectionWrapper,
  SectionHeader,
  FadeSection,
  PrimaryButton,
  GhostButton,
  TYPE,
} from '@/lib/fintutto-design'

const HAEUFIGSTE_FEHLER = [
  {
    title: 'Falsche Regelsätze',
    description:
      'Grundlegende Berechnungen werden fehlerhaft durchgeführt — und du bekommst weniger als dir zusteht.',
  },
  {
    title: 'Nicht anerkannte Mehrbedarfe',
    description:
      'Berechtigte Zusatzleistungen für Alleinerziehende, Schwangere oder Menschen mit Behinderung werden übersehen.',
  },
  {
    title: 'Rechtswidrige Mietkürzungen',
    description:
      'Wohnkosten werden ohne ausreichende Begründung nicht vollständig übernommen.',
  },
  {
    title: 'Überhöhte Rückforderungen',
    description:
      'Ungerechtfertigte Forderungen nach Rückzahlung bereits erhaltener Leistungen.',
  },
  {
    title: 'Unzulässige Sanktionen',
    description:
      'Kürzungen, die gegen aktuelle Rechtsprechung verstoßen oder formal fehlerhaft sind.',
  },
]

const MISSION_FEATURES = [
  {
    icon: ScanSearch,
    title: 'Automatische Analyse',
    description: 'Bescheid-Prüfung in Sekunden statt Stunden — durch intelligente KI.',
  },
  {
    icon: MessageCircle,
    title: 'Verständliche Erklärungen',
    description: 'Amtsdeutsch wird in einfache, klare Sprache übersetzt. Ohne Jurastudium.',
  },
  {
    icon: FileText,
    title: 'Personalisierte Schreiben',
    description: 'Fertige Widersprüche und Anträge — statt leere Formulare.',
  },
  {
    icon: Calculator,
    title: '13 Rechner für deine Ansprüche',
    description: 'Sofort sehen, was dir zusteht — präzise und nachvollziehbar.',
  },
]

const FINTUTTO_PRODUKTE = [
  { name: 'Vermietify', desc: 'Professionelle Immobilienverwaltung für Vermieter' },
  { name: 'HausmeisterPro', desc: 'Digitale Objektbetreuung und Wartungsmanagement' },
  { name: 'MieterApp', desc: 'Das moderne Mieterportal für einfache Kommunikation' },
  { name: 'Zähler-App', desc: 'KI-gestützte Zählerablesung mit OCR-Technologie' },
  { name: 'Formulare-Suite', desc: 'Sorgfältig vorbereitete Dokumente für jeden Bedarf' },
]

const WERTE = [
  {
    icon: Heart,
    title: 'Zugänglichkeit',
    description:
      'Sozialrecht-Hilfe darf kein Privileg sein. BescheidBoxer ist ab 0 € nutzbar — für immer.',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-900/40',
  },
  {
    icon: Eye,
    title: 'Verständlichkeit',
    description:
      'Wir übersetzen Amtsdeutsch in einfache Sprache. Du verstehst, was dir zusteht — ohne Jurastudium.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900/40',
  },
  {
    icon: Lock,
    title: 'Datenschutz',
    description:
      'DSGVO-konform, Hosting in Deutschland, keine Datenweitergabe. Deine Bescheide gehören dir.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-900/40',
  },
]

export default function UeberUnsPage() {
  useDocumentTitle('Über BescheidBoxer — Warum wir das hier machen')

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO                                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <PageHero
        badge="Warum es uns gibt"
        title="Viele Bescheide enthalten Fehler."
        titleGradient="Wir helfen, sie zu finden."
        subtitle="Studien zeigen hohe Fehlerquoten bei Sozialleistungs-Bescheiden — die meisten Menschen wissen es nicht. BescheidBoxer macht aus Sozialrecht ein Werkzeug für jeden."
        primaryCta={{
          label: 'Bescheid prüfen',
          to: '/scan',
          icon: <ScanSearch className="w-5 h-5" />,
        }}
        secondaryCta={{
          label: 'Mehr über FinTuttO',
          to: '/preise',
          icon: <ExternalLink className="w-5 h-5" />,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. DAS PROBLEM                                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="Das Problem"
          title="Hunderttausende Widersprüche."
          titleGradient="Jedes Jahr."
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FadeSection delay={100}>
            <Card className="h-full rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
              <CardContent className="p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold">Die Studienlage</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Die rund 400 Jobcenter in Deutschland verschicken jährlich Millionen
                  Bescheide. Studien (z. B. Sozialgerichtsbarkeit, BA-Statistik) deuten
                  auf hohe Fehlerquoten hin — Größenordnung etwa jeder zweite Bescheid.
                </p>
              </CardContent>
            </Card>
          </FadeSection>
          <FadeSection delay={200} className="flex flex-col justify-center">
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Millionen Bürgerinnen und Bürger bekommen fehlerhafte Bescheide — und
              wissen nichts davon. Verlorenes Geld. Existenzielle Unsicherheit.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Sozialrecht ist komplex. Ein Anwalt kostet Geld, das du nicht hast.
              Ergebnis:{' '}
              <strong className="text-foreground">
                Milliarden Euro, die Betroffenen zustehen, werden nie ausgezahlt.
              </strong>
            </p>
          </FadeSection>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. HÄUFIGSTE FEHLER                                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <SectionHeader
          badge="Was wir suchen"
          title="Die 5 häufigsten Fehler"
          titleGradient="in deinem Bescheid."
          subtitle="Genau danach durchsucht unsere KI als Erstes."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {HAEUFIGSTE_FEHLER.map((fehler, i) => (
            <FadeSection key={fehler.title} delay={i * 80}>
              <Card className="h-full rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{fehler.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {fehler.description}
                  </p>
                </CardContent>
              </Card>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. MISSION                                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="Unsere Mission"
          title="KI für alle —"
          titleGradient="nicht nur für Vermögende."
          subtitle="Wir nutzen künstliche Intelligenz, um jedem Betroffenen die Werkzeuge in die Hand zu geben, die bisher nur Anwälte und Sozialverbände hatten."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {MISSION_FEATURES.map((feature, i) => (
            <FadeSection key={feature.title} delay={i * 80}>
              <Card className="h-full rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-boxer text-white mb-4 shadow-lg shadow-red-500/20">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </FadeSection>
          ))}
        </div>
        <FadeSection delay={400} className="max-w-3xl mx-auto mt-10">
          <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 dark:border-orange-900/50 p-6 text-center">
            <p className="text-base sm:text-lg leading-relaxed">
              <Sparkles className="inline h-5 w-5 mr-1 text-orange-600" />
              <strong className="text-foreground">Kostenlos zugänglich:</strong> Ab 0 €
              nutzbar — weil gerade die, die es brauchen, es sich am wenigsten leisten
              können.
            </p>
          </div>
        </FadeSection>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. STORY: ALEXANDER + FINTUTTO                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <SectionHeader
          badge="Teil des FinTuttO-Ökosystems"
          title="Gegründet von einem,"
          titleGradient="der Tempo macht."
        />
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <FadeSection delay={100}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5">
              BescheidBoxer ist Teil von <strong className="text-foreground">FinTuttO</strong> —
              einem wachsenden Ökosystem digitaler Tools für den deutschen Immobilien- und
              Sozialmarkt. Gegründet von{' '}
              <strong className="text-foreground">Alexander Deibel</strong>, der in nur{' '}
              <strong className="text-foreground">54 Tagen</strong> ein komplettes
              SaaS-Ökosystem mit KI-Unterstützung aufgebaut hat.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Diese Geschwindigkeit zeigt, was wir wollen: praktische Lösungen für echte
              Probleme — schnell, konkret, nutzbar.
            </p>
          </FadeSection>
          <FadeSection delay={200}>
            <h3 className={`${TYPE.h3} mb-5`}>Weitere FinTuttO-Produkte</h3>
            <ul className="space-y-3 mb-5">
              {FINTUTTO_PRODUKTE.map((p) => (
                <li key={p.name} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full gradient-boxer flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">{p.name}</strong>
                    <span className="text-muted-foreground"> — {p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href="https://fintutto.de"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
            >
              Mehr erfahren auf fintutto.de
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </FadeSection>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. WERTE                                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="Wofür wir stehen"
          title="Drei Werte."
          titleGradient="Ein Fundament."
          subtitle="Unsere Werte sind nicht nur Worte auf einer Webseite — sie leiten jede Entscheidung, die wir treffen."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {WERTE.map((wert, i) => (
            <FadeSection key={wert.title} delay={i * 100}>
              <Card
                className={`h-full rounded-2xl border-2 ${wert.borderColor} ${wert.bgColor}`}
              >
                <CardContent className="p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background mb-4 shadow-sm">
                    <wert.icon className={`h-6 w-6 ${wert.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{wert.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {wert.description}
                  </p>
                </CardContent>
              </Card>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. FINAL CTA — gradient-amt dunkler Block                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="gradient-amt text-white py-20 sm:py-24">
        <div className="container">
          <FadeSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
              Gemeinsam für dein Recht.
            </h2>
            <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-xl mx-auto leading-relaxed">
              Erster Bescheid oder zehnter Widerspruch — wir stehen an deiner Seite. Mit
              moderner KI, klaren Erklärungen und konkreten Schritten.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-10 backdrop-blur">
              <Quote className="h-6 w-6 mx-auto mb-3 opacity-70" />
              <p className="text-lg sm:text-xl italic font-medium">
                Wissen ist Macht — besonders, wenn es um deine Ansprüche geht.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton to="/scan" showArrow={false} className="!bg-white !text-red-700 hover:!bg-white/95 !shadow-xl">
                <ScanSearch className="w-5 h-5" />
                Jetzt Bescheid prüfen
              </PrimaryButton>
              <GhostButton to="/preise" showArrow={false} className="!border-white/30 !text-white hover:!bg-white/15">
                Pionier werden
                <ArrowRight className="w-5 h-5" />
              </GhostButton>
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  )
}
