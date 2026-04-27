import { Link } from 'react-router-dom'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import {
  ScanSearch,
  ArrowRight,
  Swords,
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    description:
      'Bescheid-Prüfung in Sekunden statt Stunden — durch intelligente KI-Technologie.',
  },
  {
    icon: MessageCircle,
    title: 'Verständliche Erklärungen',
    description:
      'Amtsdeutsch wird in einfache, klare Sprache übersetzt. Ohne Jurastudium.',
  },
  {
    icon: FileText,
    title: 'Personalisierte Schreiben',
    description:
      'Fertige Widersprüche und Anträge — statt leere Formulare.',
  },
  {
    icon: Calculator,
    title: '13 Rechner für deine Ansprüche',
    description:
      'Sofort sehen, was dir zusteht — präzise und nachvollziehbar.',
  },
]

const FINTUTTO_PRODUKTE = [
  { name: 'Vermietify', desc: 'Professionelle Immobilienverwaltung für Vermieter' },
  { name: 'HausmeisterPro', desc: 'Digitale Objektbetreuung und Wartungsmanagement' },
  { name: 'MieterApp', desc: 'Das moderne Mieterportal für einfache Kommunikation' },
  { name: 'Zähler-App', desc: 'KI-gestützte Zählerablesung mit OCR-Technologie' },
  { name: 'Formulare-Suite', desc: 'Rechtssichere Dokumente für jeden Bedarf' },
]

const WERTE = [
  {
    icon: Heart,
    title: 'Zugänglichkeit',
    description:
      'Sozialrecht-Hilfe darf kein Privileg sein. BescheidBoxer ist ab 0 € nutzbar — für immer. Rechtliche Unterstützung ist ein Grundrecht, keine Frage des Geldbeutels.',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-900/40',
  },
  {
    icon: Eye,
    title: 'Verständlichkeit',
    description:
      'Wir übersetzen Amtsdeutsch in einfache Sprache. Jeder Mensch hat das Recht zu verstehen, was ihm zusteht — ohne Jurastudium.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900/40',
  },
  {
    icon: Lock,
    title: 'Datenschutz',
    description:
      'DSGVO-konform, Hosting in Deutschland, keine Datenweitergabe. Deine Bescheide gehören dir — nicht uns. Deine Privatsphäre ist unantastbar.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-900/40',
  },
]

export default function UeberUnsPage() {
  useDocumentTitle('Über BescheidBoxer — Warum wir das hier machen')

  return (
    <div>
      {/* ============================================================= */}
      {/* 1. HERO                                                       */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-boxer opacity-5" />
        <div className="container py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 text-sm px-4 py-1 bg-red-100 text-red-800 border-red-200">
              <Swords className="mr-1.5 h-3.5 w-3.5" />
              Warum es uns gibt
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Warum BescheidBoxer?{' '}
              <br />
              <span className="gradient-text-boxer">
                Weil jeder zweite Bescheid falsch ist.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Und die meisten Menschen das nicht wissen. Wir ändern das.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="gradient-boxer text-white border-0 hover:opacity-90" asChild>
                <Link to="/scan">
                  <ScanSearch className="mr-2 h-5 w-5" />
                  Bescheid prüfen
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <a href="https://fintutto.de" target="_blank" rel="noopener noreferrer">
                  Mehr über FinTuttO
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 2. DAS PROBLEM                                                */}
      {/* ============================================================= */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
              500.000 fehlerhafte Bescheide. <span className="gradient-text-boxer">Pro Jahr.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold">Das Problem</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Jedes Jahr verschicken die 400 Jobcenter in Deutschland Millionen Bescheide.
                    Studien zeigen: Mindestens jeder zweite enthält Fehler.
                  </p>
                </CardContent>
              </Card>
              <div className="flex flex-col justify-center">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Millionen Bürgerinnen und Bürger bekommen fehlerhafte Bescheide — und wissen
                  nichts davon. Das bedeutet nicht nur verlorenes Geld, sondern auch existenzielle
                  Unsicherheit.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Sozialrecht ist komplex, die Sprache der Bescheide unverständlich, und ein
                  Anwalt kostet Geld, das du nicht hast. Ergebnis:{' '}
                  <strong className="text-foreground">
                    Milliarden Euro, die Betroffenen zustehen, werden nie ausgezahlt.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 3. HÄUFIGSTE FEHLER                                           */}
      {/* ============================================================= */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Die häufigsten Fehler in Bescheiden</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Diese fünf Kategorien finden wir immer wieder — und genau danach sucht unsere KI als Erstes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {HAEUFIGSTE_FEHLER.map((fehler) => (
            <Card key={fehler.title} className="h-full">
              <CardContent className="p-6">
                <div className="inline-flex p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{fehler.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{fehler.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/* 4. MISSION                                                    */}
      {/* ============================================================= */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Unsere Mission
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              KI für alle — nicht nur für die, die es sich leisten können.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              BescheidBoxer macht Schluss damit, dass Sozialrecht ein Privileg der Vermögenden ist.
              Wir nutzen künstliche Intelligenz, um jedem Betroffenen die Werkzeuge in die Hand zu
              geben, die bisher nur Anwälte und Sozialverbände hatten.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {MISSION_FEATURES.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-boxer text-white mb-4">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="max-w-3xl mx-auto mt-10">
            <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 dark:border-orange-900/50">
              <CardContent className="p-6 text-center">
                <p className="text-base md:text-lg">
                  <strong className="text-foreground">Kostenlos zugänglich:</strong> Ab 0 € nutzbar —
                  weil gerade die, die es brauchen, es sich am wenigsten leisten können. Voller
                  Zugang zur Bescheid-Analyse, ohne versteckte Kosten.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 5. STORY: ALEXANDER + FINTUTTO                                */}
      {/* ============================================================= */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-200">
              Teil des FinTuttO-Ökosystems
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gegründet von einem, der Tempo macht.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BescheidBoxer ist Teil von <strong className="text-foreground">FinTuttO</strong> —
                einem wachsenden Ökosystem digitaler Tools für den deutschen Immobilien- und
                Sozialmarkt. Gegründet von <strong className="text-foreground">Alexander Deibel</strong>,
                der in nur 54 Tagen ein komplettes SaaS-Ökosystem mit KI-Unterstützung aufgebaut hat.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Diese Geschwindigkeit zeigt unsere Innovationskraft und unser Engagement, praktische
                Lösungen für echte Probleme zu schaffen. Jedes FinTuttO-Produkt vereinfacht komplexe
                Prozesse und ermächtigt Menschen.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Weitere FinTuttO-Produkte</h3>
              <ul className="space-y-3">
                {FINTUTTO_PRODUKTE.map((p) => (
                  <li key={p.name} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full gradient-boxer flex-shrink-0" />
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
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline mt-4"
              >
                Mehr erfahren auf fintutto.de
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 6. WERTE                                                      */}
      {/* ============================================================= */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Wofür wir stehen</h2>
            <p className="text-muted-foreground">
              Unsere Werte sind nicht nur Worte auf einer Webseite — sie sind das Fundament jeder
              Entscheidung, die wir treffen.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {WERTE.map((wert) => (
              <Card
                key={wert.title}
                className={`h-full border-2 ${wert.borderColor} ${wert.bgColor}`}
              >
                <CardContent className="p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background mb-4">
                    <wert.icon className={`h-6 w-6 ${wert.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{wert.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {wert.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 7. GEMEINSAM FÜR DEIN RECHT (FINAL CTA)                       */}
      {/* ============================================================= */}
      <section className="gradient-amt text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Gemeinsam für dein Recht</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Egal ob es dein erster Bescheid ist oder du schon Erfahrung mit Widersprüchen hast —
              wir stehen an deiner Seite. Mit moderner KI, klaren Erklärungen und konkreten
              Handlungsempfehlungen.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 backdrop-blur">
              <Quote className="h-6 w-6 mx-auto mb-3 opacity-70" />
              <p className="text-lg md:text-xl italic font-medium">
                Wissen ist Macht — besonders wenn es um deine gesetzlichen Ansprüche geht.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-white text-red-700 hover:bg-white/90 font-bold"
                asChild
              >
                <Link to="/scan">
                  <ScanSearch className="mr-2 h-5 w-5" />
                  Jetzt Bescheid prüfen
                </Link>
              </Button>
              <Button
                size="xl"
                className="bg-white/15 text-white border border-white/30 hover:bg-white/25"
                asChild
              >
                <Link to="/preise">
                  Pionier werden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
