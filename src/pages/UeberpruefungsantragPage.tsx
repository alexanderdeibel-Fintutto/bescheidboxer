/**
 * UeberpruefungsantragPage — § 44 SGB X als Killer-USP-Landing.
 *
 * Route: /ueberpruefungsantrag
 *
 * Kerngedanke: Der § 44 SGB X Überprüfungsantrag erlaubt es, Bescheide
 * der letzten 4 Jahre rückwirkend prüfen zu lassen — auch wenn die
 * Widerspruchsfrist längst abgelaufen ist. Das ist für Millionen
 * Deutsche relevant, die nie gewusst haben, dass sie noch Ansprüche
 * haben können.
 *
 * Diese Page bündelt:
 *   - Großer Hero "Auch alte Bescheide können noch Geld bringen"
 *   - 4-Jahre-Rückwirkung-Erklärung mit Beispiel-Rechnungen
 *   - Wie funktioniert es technisch (Scan → KI → Antrag)
 *   - Häufige Fragen (FAQ)
 *   - CTA zum BescheidScan
 */
import { Link } from 'react-router-dom'
import {
  ScanSearch,
  FileText,
  ArrowRight,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { PageHero, FadeSection, SectionHeader } from '@/lib/fintutto-design'

export default function UeberpruefungsantragPage() {
  useDocumentTitle('§ 44 SGB X — Alte Bescheide bis zu 4 Jahre rückwirkend prüfen')

  return (
    <div>
      {/* Hero */}
      <PageHero
        badge="§ 44 SGB X · Überprüfungsantrag · Bis zu 4 Jahre rückwirkend"
        title="Auch alte Bescheide"
        titleGradient="können noch Geld bringen."
        subtitle="Du hast die 1-Monats-Widerspruchsfrist verpasst? Macht nichts. Mit dem Überprüfungsantrag nach § 44 SGB X lässt sich jeder Bescheid bis zu 4 Jahre rückwirkend nochmal prüfen — und falsch berechnete Leistungen nachzahlen lassen."
        primaryCta={{
          label: 'Alten Bescheid scannen lassen',
          to: '/scan',
          icon: <ScanSearch className="w-5 h-5" />,
        }}
        secondaryCta={{
          label: 'Antrag-Vorlage ansehen',
          to: '/generator/ueberpruefungsantrag',
          icon: <FileText className="w-5 h-5" />,
        }}
        hint="2 kostenlose Scans · kein Account nötig für die Prüfung"
      />

      <div className="container max-w-4xl py-8 px-4">

        {/* Quick-Hinweis: Was ist § 44 SGB X */}
        <Card className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 mb-12 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6 flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-lg mb-1">
                Das vergessene Supervermögen im SGB X
              </h2>
              <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">
                <strong>§ 44 SGB X</strong> ist ein wenig bekannter Paragraph mit gewaltigem
                Potenzial: Ein Sozialleistungsträger (Jobcenter, Krankenkasse,
                Rentenversicherung, …) muss Bescheide nachträglich aufheben oder
                korrigieren, wenn das Recht falsch angewendet oder Sachverhalte falsch
                berücksichtigt wurden. Und das gilt rückwirkend für{' '}
                <strong>bis zu 4 Jahre</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Beispiel-Rechnungen */}
        <FadeSection>
          <SectionHeader
            badge="Beispiele aus der Praxis"
            title="So viel Geld kannst du"
            titleGradient="rückwirkend bekommen."
            subtitle="Drei typische Fälle, die wir oft sehen — und wieviel jeweils nachgezahlt werden konnte."
          />

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="rounded-2xl border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40 mb-4">
                  <Calendar className="h-5 w-5 text-amber-700" />
                </div>
                <h3 className="font-bold text-base mb-2">Mehrbedarf vergessen</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Alleinerziehende Mutter, 2 Kinder. Mehrbedarf-Pauschale wurde 2022-2024
                  nie gewährt, obwohl sie zustand.
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Nachzahlung
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">~ 2.880&nbsp;€</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    24 Monate × ~120&nbsp;€ Mehrbedarf
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/40 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-700" />
                </div>
                <h3 className="font-bold text-base mb-2">Heizkosten zu niedrig</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Single-Haushalt. Jobcenter zahlt nur 60&nbsp;€/Monat Heizkosten,
                  tatsächlich 95&nbsp;€. Differenz seit 2022 nie nachgefordert.
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Nachzahlung
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">~ 1.260&nbsp;€</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    36 Monate × ~35&nbsp;€ Differenz
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/40 mb-4">
                  <AlertCircle className="h-5 w-5 text-rose-700" />
                </div>
                <h3 className="font-bold text-base mb-2">Sanktion war fehlerhaft</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  30%-Sanktion 2023 — die Mitwirkungspflichtverletzung war aber nie
                  ordentlich begründet. Sanktion könnte rückgängig gemacht werden.
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Nachzahlung
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">~ 506&nbsp;€</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 Monate × ~169&nbsp;€ einbehalten
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground text-center mb-16">
            Beispielrechnungen auf Basis typischer Konstellationen. Jeder Einzelfall ist
            anders — die KI prüft deinen konkreten Bescheid auf Position, Paragraph und
            Berechnung.
          </p>
        </FadeSection>

        {/* So funktioniert's */}
        <FadeSection>
          <SectionHeader
            badge="So einfach geht's"
            title="In 3 Schritten zum"
            titleGradient="Überprüfungsantrag."
          />

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-boxer text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Alten Bescheid hochladen</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Foto oder PDF des Bescheids — egal ob 2022, 2023 oder 2024.
                Auch Bescheide bis zum 1. Januar des laufenden Jahres minus
                4 Jahre sind drin (Stand 2026 = bis 01.01.2022).
              </p>
            </div>

            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-boxer text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">KI prüft jede Position</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Die KI vergleicht jeden Posten mit den Regelsätzen, Mehrbedarfen,
                KdU-Limits des damaligen Jahres. Findet sie Abweichungen, sind das
                potenzielle Nachzahlungen.
              </p>
            </div>

            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-boxer text-white font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Antrag automatisch erstellt</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Du bekommst einen formal korrekten Überprüfungsantrag nach § 44 SGB X
                mit allen Paragraphen, Berechnungen und Begründungen — fertig zum
                Ausdrucken oder Versenden.
              </p>
            </div>
          </div>
        </FadeSection>

        {/* Wichtige Eckdaten */}
        <Card className="border-2 mb-16 rounded-2xl">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Die wichtigsten Eckdaten zu § 44 SGB X
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  k: 'Rückwirkungs-Zeitraum',
                  v: 'Bis zu 4 Jahre rückwirkend ab Antragstellung',
                },
                {
                  k: 'Frist für den Antrag',
                  v: 'Keine — du kannst ihn jederzeit stellen',
                },
                {
                  k: 'Wer kann ihn stellen',
                  v: 'Jeder Leistungsberechtigte oder bevollmächtigter Dritter',
                },
                {
                  k: 'Bei welchen Bescheiden',
                  v: 'Bürgergeld, Sozialhilfe, Renten, Krankengeld, … (alle Sozialleistungen)',
                },
                {
                  k: 'Welche Behörde',
                  v: 'Die Behörde, die den ursprünglichen Bescheid erlassen hat',
                },
                {
                  k: 'Kosten',
                  v: 'Antrag und Verfahren sind kostenfrei',
                },
              ].map((item) => (
                <div key={item.k} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                      {item.k}
                    </p>
                    <p className="text-sm font-medium">{item.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <FadeSection>
          <SectionHeader
            badge="Häufige Fragen"
            title="§ 44 SGB X"
            titleGradient="in Klartext."
          />

          <div className="space-y-4 mb-16">
            {[
              {
                q: 'Was, wenn ich die 1-Monats-Widerspruchsfrist verpasst habe?',
                a: 'Genau dafür ist der Überprüfungsantrag gemacht. Während der Widerspruch nur innerhalb 1 Monat nach Bescheid-Zugang möglich ist, läuft der Überprüfungsantrag nach § 44 SGB X auch noch Jahre später. Du verlierst kein Recht — du nutzt nur einen anderen Weg.',
              },
              {
                q: 'Wie weit zurück darf ich gehen?',
                a: 'Bis zu 4 Kalenderjahre VOR dem Jahr der Antragstellung — § 44 Abs. 4 SGB X. Beispiel: Antrag in 2026 → Leistungen ab 01.01.2022 nachforderbar. Ältere Bescheide kannst du auch noch prüfen lassen, aber Nachzahlungen gibt es maximal 4 Jahre rückwirkend.',
              },
              {
                q: 'Was kann die Behörde ablehnen?',
                a: 'Die Behörde muss den Bescheid ÜBERPRÜFEN — das kann zu Aufhebung, Korrektur oder auch zu einer schriftlichen Ablehnung führen. Gegen die Ablehnung kannst du wieder Widerspruch einlegen (dann gilt die normale 1-Monats-Frist). Eine Ablehnung ist also kein endgültiges Aus.',
              },
              {
                q: 'Welche Bescheide eignen sich besonders?',
                a: 'Bescheide mit Berechnungen — Bürgergeld-Bewilligungen, Sanktionen, KdU-Bescheide, Mehrbedarfs-Ablehnungen, Rentenberechnungen, Krankenkassen-Erstattungen. Reine Verfahrens- oder Formal-Bescheide eignen sich weniger.',
              },
              {
                q: 'Ist das wirklich kostenlos?',
                a: 'Ja — der Antrag selbst und das Verwaltungsverfahren sind kostenfrei. Auch BescheidBoxer prüft im Schnupperer-Plan kostenlos (2 Scans/Monat). Wenn du mehr brauchst, gibt es Tarife ab 7,99 €/Monat oder einen Einmal-Kauf.',
              },
              {
                q: 'Brauche ich einen Anwalt?',
                a: 'Nein. Der Überprüfungsantrag ist bewusst so formuliert, dass jeder ihn ohne Anwalt stellen kann. BescheidBoxer ersetzt aber keine Rechtsberatung im Einzelfall — bei sehr komplexen Bescheiden oder hohen Streitwerten ist ein Sozialverband (VdK, SoVD) oder Fachanwalt sinnvoll.',
              },
            ].map((faq) => (
              <Card key={faq.q} className="rounded-2xl border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-2">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-base leading-snug">{faq.q}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeSection>

        {/* Final CTA */}
        <Card className="rounded-2xl gradient-boxer text-white border-0 mb-12">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Schau nach, ob in deinen alten Bescheiden Geld liegt.
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Lade einen Bescheid hoch — die KI sagt dir in 60 Sekunden, ob ein
              Überprüfungsantrag sinnvoll ist und wieviel rückwirkend drin sein könnte.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full font-semibold"
                asChild
              >
                <Link to="/scan">
                  <ScanSearch className="w-5 h-5 mr-2" />
                  Bescheid prüfen lassen
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full font-semibold border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/generator/ueberpruefungsantrag">
                  Antrag-Vorlage anschauen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-white/70 mt-4">
              2 Scans/Monat kostenlos · Kein Account für die Prüfung nötig
            </p>
          </CardContent>
        </Card>

        {/* Rechtlicher Hinweis */}
        <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          BescheidBoxer ist ein KI-gestütztes Informations- und Selbsthilfe-Werkzeug
          und ersetzt keine Rechtsberatung im Einzelfall im Sinne des Rechtsdienst-
          leistungsgesetzes (RDG). Bei komplexen Fällen wende dich an einen
          Sozialverband (VdK, SoVD), eine Beratungsstelle oder einen Fachanwalt.
          Beispielrechnungen sind illustrativ — der konkrete Erfolg hängt vom
          Einzelfall ab.
        </p>
      </div>
    </div>
  )
}
