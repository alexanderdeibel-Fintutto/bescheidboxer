import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  ScanSearch,
  Calculator,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import {
  PageHero,
  SectionWrapper,
  FadeSection,
  GradientText,
  TYPE,
} from '@/lib/fintutto-design'

interface FaqItem {
  id: string
  question: string
  answer: string
}

const buergergeldFaqs: FaqItem[] = [
  {
    id: 'was-ist-buergergeld',
    question: 'Was ist Bürgergeld?',
    answer:
      'Seit dem 01.01.2023 ist das Bürgergeld der Nachfolger von Hartz IV. Es ist im SGB II geregelt und bietet eine Grundsicherung für Arbeitssuchende. Das Bürgergeld soll die Existenz sichern und Menschen dabei unterstützen, wieder in Arbeit zu kommen.',
  },
  {
    id: 'regelsatz-2025',
    question: 'Wie hoch ist der Regelsatz 2025?',
    answer:
      'Die Regelsätze 2025: Alleinstehend 563 €, Paare je 506 €, Kinder 14–17 Jahre 471 €, Kinder 6–13 Jahre 390 €, Kinder 0–5 Jahre 357 €. Die Beträge werden jährlich angepasst.',
  },
  {
    id: 'kosten-der-unterkunft',
    question: 'Was sind Kosten der Unterkunft (KdU)?',
    answer:
      'Nach § 22 SGB II werden die tatsächlichen Mietkosten plus Heizung übernommen, sofern sie angemessen sind. Es gilt eine 12-monatige Karenzzeit bei Umzug oder zu hohen Kosten — in dieser Zeit werden auch unangemessene Kosten voll übernommen.',
  },
  {
    id: 'einkommensanrechnung',
    question: 'Wie funktioniert die Einkommensanrechnung?',
    answer:
      'Nach § 11 SGB II gibt es Freibeträge bei Erwerbseinkommen: 100 € Grundfreibetrag, plus 20 % zwischen 100–520 €, plus 10 % zwischen 520–1000 €. Einkommen darüber wird voll angerechnet.',
  },
  {
    id: 'mehrbedarfe',
    question: 'Was sind Mehrbedarfe?',
    answer:
      'Nach § 21 SGB II gibt es Mehrbedarfe für besondere Lebenslagen: Schwangerschaft (ab 13. Woche), Alleinerziehende, Menschen mit Behinderung, kostenaufwändige Ernährung (z. B. medizinisch).',
  },
  {
    id: 'widerspruch-frist',
    question: 'Wie lange habe ich Zeit für einen Widerspruch?',
    answer:
      'Du hast einen Monat ab Zugang des Bescheids (§ 84 SGG). Bei postalischer Zusendung gilt die Zugangsfiktion: Der Bescheid gilt am 3. Tag nach Absendung als zugegangen — die Frist beginnt am Tag danach.',
  },
]

const platformFaqs: FaqItem[] = [
  {
    id: 'kosten',
    question: 'Was kostet BescheidBoxer?',
    answer:
      'Vier Tarife: Schnupperer (0 €, kostenlos), Starter (2,99 €/Monat), Kämpfer (4,99 €/Monat) und Vollschutz (7,99 €/Monat). Mit Code PIONIER50 sparst du 50 % lebenslang.',
  },
  {
    id: 'bescheidscan',
    question: 'Wie funktioniert der BescheidScan?',
    answer:
      'Lade deinen Bescheid als PDF oder Foto hoch. Die KI prüft automatisch auf häufige Fehler: falsche Bedarfsberechnung, fehlende Mehrbedarfe, nicht berücksichtigte Freibeträge. Du bekommst eine Übersicht der gefundenen Fehler und eine Schätzung der möglichen Nachzahlung.',
  },
  {
    id: 'datensicherheit',
    question: 'Sind meine Daten sicher?',
    answer:
      'Ja. BescheidBoxer ist DSGVO-konform. Alle Daten verschlüsselt auf EU-Servern gespeichert. Wir geben deine Daten nicht an Dritte weiter. Du kannst jederzeit Daten exportieren oder dein Konto löschen.',
  },
  {
    id: 'rechtsberatung',
    question: 'Ersetzt BescheidBoxer einen Anwalt?',
    answer:
      'Nein. BescheidBoxer bietet eine KI-gestützte Ersteinschätzung, aber keine Rechtsberatung. Für individuelle Beratung empfehlen wir Sozialverbände wie VdK, SoVD oder Caritas — die bieten oft kostenlose Beratung für Leistungsempfänger.',
  },
  {
    id: 'kostenlos-nutzen',
    question: 'Kann ich BescheidBoxer kostenlos nutzen?',
    answer:
      'Ja. Der Schnupperer-Tarif ist dauerhaft kostenlos und enthält 5 Chat-Nachrichten pro Tag, 2 BescheidScans pro Monat und Forum-Zugang. So testest du die Plattform in Ruhe.',
  },
]

const widerspruchFaqs: FaqItem[] = [
  {
    id: 'nach-widerspruch',
    question: 'Was passiert nach meinem Widerspruch?',
    answer:
      'Das Jobcenter hat 3 Monate Zeit zur Bearbeitung. Du bekommst entweder einen Abhilfebescheid (Widerspruch erfolgreich) oder einen Widerspruchsbescheid (abgelehnt). Bei Ablehnung kannst du innerhalb eines Monats Klage beim Sozialgericht einreichen.',
  },
  {
    id: 'klage-kosten',
    question: 'Was kostet eine Klage beim Sozialgericht?',
    answer:
      'Klagen beim Sozialgericht sind für Leistungsempfänger grundsätzlich kostenlos — keine Gerichtskosten. Bei Bedarf kannst du Prozesskostenhilfe (PKH) für einen Anwalt beantragen. Auch bei Verlust entstehen dir keine Kosten.',
  },
  {
    id: 'alte-bescheide',
    question: 'Kann ich alte Bescheide noch prüfen lassen?',
    answer:
      'Ja. Per Überprüfungsantrag nach § 44 SGB X können Fehler bis zu 4 Jahre rückwirkend korrigiert werden — du bekommst dann auch Nachzahlungen für die Vergangenheit.',
  },
  {
    id: 'sanktion',
    question: 'Was mache ich bei einer Sanktion?',
    answer:
      'Seit 2023 sind Sanktionen auf maximal 30 % des Regelsatzes begrenzt. Lege umgehend Widerspruch ein und mache wichtige Gründe geltend (z. B. Krankheit, fehlende Kinderbetreuung). Bei drohender Obdachlosigkeit hilft ein Eilantrag beim Sozialgericht.',
  },
]

const technischesFaqs: FaqItem[] = [
  {
    id: 'mobile',
    question: 'Funktioniert BescheidBoxer auf dem Handy?',
    answer:
      'Ja. BescheidBoxer ist vollständig responsive — alle Funktionen (Chat, Scan, Rechner, Briefgenerator) laufen auf Smartphone und Tablet.',
  },
  {
    id: 'daten-export',
    question: 'Kann ich meine Daten exportieren?',
    answer:
      'Ja. Unter Profil → Daten & Datenschutz findest du den Datenexport. Alle Daten als JSON-Download — Chat-Verläufe, Scan-Ergebnisse, generierte Briefe.',
  },
  {
    id: 'konto-loeschen',
    question: 'Wie lösche ich mein Konto?',
    answer:
      'Profil → Konto löschen. Alle Daten werden innerhalb von 30 Tagen vollständig und unwiderruflich gelöscht. Du bekommst eine Bestätigung per E-Mail.',
  },
]

const QUICK_LINKS = [
  { icon: ScanSearch, title: 'BescheidScan', desc: 'Bescheid prüfen lassen', to: '/scan' },
  { icon: Calculator, title: 'Rechner', desc: 'Anspruch berechnen', to: '/rechner' },
  { icon: HelpCircle, title: 'Preise', desc: 'Tarife vergleichen', to: '/preise' },
]

export default function FaqPage() {
  useDocumentTitle('Häufige Fragen')
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id)
  }

  const renderFaqItem = (item: FaqItem) => (
    <Card
      key={item.id}
      className="cursor-pointer rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
      onClick={() => toggleQuestion(item.id)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base sm:text-lg font-semibold flex-1">{item.question}</h3>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 mt-0.5 ${
              openQuestion === item.id ? 'rotate-180' : ''
            }`}
          />
        </div>
        {openQuestion === item.id && (
          <div className="mt-3 text-muted-foreground leading-relaxed text-sm">
            {item.answer}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderSection = (
    title: string,
    titleGradient: string,
    items: FaqItem[],
    delay = 0,
  ) => (
    <FadeSection delay={delay} className="mb-12">
      <h2 className={`${TYPE.h2sm} mb-6`}>
        {title} <GradientText>{titleGradient}</GradientText>
      </h2>
      <div className="space-y-3">{items.map(renderFaqItem)}</div>
    </FadeSection>
  )

  return (
    <div>
      {/* HERO */}
      <PageHero
        badge="Häufige Fragen"
        title="Antworten auf"
        titleGradient="alles, was zählt."
        subtitle="Bürgergeld, BescheidBoxer, Widerspruch, Technik — die häufigsten Fragen, kompakt beantwortet."
        ambientGlow={false}
      />

      {/* FAQ SECTIONS */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          {renderSection('Bürgergeld', '& Rechte', buergergeldFaqs, 0)}
          {renderSection('BescheidBoxer', 'nutzen', platformFaqs, 80)}
          {renderSection('Widerspruch', '& Klage', widerspruchFaqs, 160)}
          {renderSection('Technisches', '& Konto', technischesFaqs, 240)}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper bg="muted">
        <FadeSection className="max-w-3xl mx-auto">
          <Card className="rounded-3xl gradient-boxer text-white border-0 shadow-xl">
            <CardContent className="p-8 sm:p-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Frage nicht dabei?
              </h3>
              <p className="text-white/90 mb-7 max-w-md mx-auto">
                Stell sie direkt unserem KI-Assistenten — kostenlos, sofort, rund um die Uhr.
              </p>
              <Link to="/chat">
                <Button
                  size="lg"
                  className="bg-white text-red-700 hover:bg-white/90 rounded-full font-bold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Zum Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
        </FadeSection>
      </SectionWrapper>

      {/* QUICK LINKS */}
      <SectionWrapper>
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {QUICK_LINKS.map((q, i) => (
            <FadeSection key={q.title} delay={i * 80}>
              <Link to={q.to} className="block h-full group">
                <Card className="rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-boxer text-white mx-auto mb-3 shadow-md shadow-red-500/20">
                      <q.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {q.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{q.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>
    </div>
  )
}
