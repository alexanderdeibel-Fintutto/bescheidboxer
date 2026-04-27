/**
 * WiderspruchJobcenterPage — SEO-Landingpage für Domain widerspruchjobcenter.de.
 *
 * Route: /widerspruch/jobcenter
 *
 * Vollstaendiger Long-form-Content + CTA zum Bescheid-Scan / Widerspruch-Generator.
 */
import { Link } from 'react-router-dom'
import {
  Swords,
  ScanSearch,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useDocumentTitle from '@/hooks/useDocumentTitle'

export default function WiderspruchJobcenterPage() {
  useDocumentTitle('Widerspruch Jobcenter — Anleitung + Vorlagen')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 py-8 px-4">
      <div className="container max-w-4xl">

        {/* Hero */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-boxer text-white mb-4">
            <Swords className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Widerspruch beim Jobcenter
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-2">
            <strong>Jeder zweite Bescheid ist fehlerhaft.</strong>
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lass deinen Bescheid in 60 Sekunden von KI prüfen. Wir finden den Fehler, du erhebst Widerspruch
            mit unserer rechtssicheren Vorlage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link to="/scan">
              <Button size="xl" className="gradient-boxer text-white border-0 hover:opacity-90">
                <ScanSearch className="mr-2 h-5 w-5" />
                Bescheid prüfen lassen
              </Button>
            </Link>
            <Link to="/musterschreiben">
              <Button size="xl" variant="outline">
                <FileText className="mr-2 h-5 w-5" />
                Vorlagen ansehen
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            2 kostenlose Scans &middot; kein Account nötig
          </p>
        </header>

        {/* Quick-Frist-Warnung */}
        <Card className="border-amber-300 bg-amber-50 mb-12">
          <CardContent className="p-6 flex items-start gap-3">
            <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-lg mb-1">Du hast nur 1 Monat Zeit!</h2>
              <p className="text-gray-800 text-sm leading-relaxed">
                Die Widerspruchsfrist betraegt <strong>1 Monat ab Zugang</strong> des Bescheids
                (§ 84 SGG). Bei Versand per Post gilt der Bescheid <strong>3 Tage nach Aufgabe</strong>
                als zugegangen (§ 37 SGB X). Wer die Frist verpasst, hat keine Chance mehr —
                ausser bei Wiedereinsetzung in den vorigen Stand.
              </p>
              <Link to="/rechner/fristen" className="inline-flex items-center gap-1 text-amber-700 hover:underline text-sm mt-2">
                Frist berechnen <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Long-form Content */}
        <article className="space-y-8">

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-3">Wann lohnt sich ein Widerspruch?</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Statistisch gesehen sind <strong>40-50 % der Bürgergeld-Bescheide fehlerhaft</strong>.
              Die haeufigsten Fehler:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Mehrbedarfe nicht beruecksichtigt</strong> (Alleinerziehend, Schwanger, Behinderung)</li>
              <li><strong>Heizkosten gekürzt</strong> ohne schluessiges Konzept (§ 22 SGB II)</li>
              <li><strong>Einkommen falsch angerechnet</strong> (Grundfreibetrag vergessen, falsche Stufe)</li>
              <li><strong>Sanktion ohne Anhoerung</strong> — fast immer rechtswidrig (§ 24 SGB X)</li>
              <li><strong>Aufhebungs-/Erstattungsbescheid</strong> ohne Verschulden — § 45 vs. § 48 SGB X falsch angewandt</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-3">So legst du Widerspruch ein — Schritt für Schritt</h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-3">
              <li>
                <strong>Bescheid prüfen lassen</strong> — KI-Scan zeigt dir in 60 Sekunden, was fehlt.
                <Link to="/scan" className="text-primary hover:underline ml-1">→ Scan starten</Link>
              </li>
              <li>
                <strong>Frist berechnen</strong> — wann genau läuft die Widerspruchsfrist ab?
                <Link to="/rechner/fristen" className="text-primary hover:underline ml-1">→ Fristen-Rechner</Link>
              </li>
              <li>
                <strong>Widerspruch verfassen</strong> — formloser Brief reicht, aber er muss bestimmte
                Punkte enthalten. Wir liefern dir die rechtssichere Vorlage.
                <Link to="/musterschreiben" className="text-primary hover:underline ml-1">→ Vorlagen</Link>
              </li>
              <li>
                <strong>Widerspruch absenden</strong> — schriftlich (per Post mit Einschreiben oder via
                Behoerden-Postfach) oder zur Niederschrift im Jobcenter. Email NICHT, weil rechtlich
                nicht ausreichend (§ 84 SGG).
              </li>
              <li>
                <strong>Begruendung nachreichen</strong> — du hast nach Eingang des Widerspruchs Zeit, die
                Begruendung ausfuehrlich nachzureichen. Tipp: Erst kurzer Widerspruch zur Fristwahrung,
                dann ausfuehrliche Begruendung.
              </li>
              <li>
                <strong>Bescheid abwarten</strong> — das Jobcenter hat 3 Monate Zeit, über den Widerspruch
                zu entscheiden. Bei Untaetigkeit: <strong>Untaetigkeitsklage</strong> moeglich.
              </li>
            </ol>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-3">Was MUSS in den Widerspruch?</h2>
            <Card className="bg-blue-50 border-blue-200 mb-3">
              <CardContent className="p-4">
                <ul className="space-y-2 text-sm text-gray-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Vollstaendiger Name</strong> + Anschrift + Aktenzeichen + Geburtsdatum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Eindeutige Bezugnahme auf den Bescheid</strong> (Datum, Aktenzeichen)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Wort <strong>„Widerspruch"</strong> oder gleichbedeutend</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Ortsangabe + Datum + handschriftliche Unterschrift</strong> (Pflicht!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Optional aber empfohlen: <strong>kurze Begruendung</strong> + Ankuendigung der ausfuehrlichen Begruendung</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <p className="text-sm text-gray-600">
              <Info className="h-4 w-4 inline mr-1" />
              Eine Email reicht nicht — gerichtliche Verfahren verlangen schriftliche Form mit Unterschrift.
            </p>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-3">FAQ Widerspruch Jobcenter</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Was kostet ein Widerspruch?</h3>
                <p className="text-sm text-gray-700">
                  Das <strong>Widerspruchsverfahren ist kostenlos</strong>. Bei Erfolg muss das Jobcenter
                  notwendige Auslagen erstatten (Porto, ggf. Anwaltskosten gemaess § 63 SGB X).
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Brauche ich einen Anwalt?</h3>
                <p className="text-sm text-gray-700">
                  Im Widerspruchsverfahren <strong>nein</strong> — du kannst alles selbst machen.
                  Falls Klage notwendig wird, lohnt sich anwaltliche Hilfe (PKH ist meist moeglich).
                  <Link to="/rechner/pkh" className="text-primary hover:underline ml-1">PKH-Anspruch berechnen</Link>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Was wenn das Jobcenter den Widerspruch ablehnt?</h3>
                <p className="text-sm text-gray-700">
                  Du kannst <strong>innerhalb von 1 Monat</strong> Klage beim Sozialgericht einreichen
                  (§ 87 SGG). Auch hier: Verfahren grundsaetzlich kostenlos.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Wirkt der Widerspruch aufschiebend?</h3>
                <p className="text-sm text-gray-700">
                  Bei <strong>Bewilligungsbescheiden</strong> ja (Hilfe wird weiter gezahlt).
                  Bei <strong>Sanktionen, Aufhebung, Erstattung</strong> NEIN — die werden trotz
                  Widerspruch sofort wirksam. Hier braucht's einen <strong>Eilantrag</strong>.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Was ist ein Ueberpruefungsantrag?</h3>
                <p className="text-sm text-gray-700">
                  Wenn die <strong>1-Monats-Frist abgelaufen</strong> ist, kannst du noch einen
                  Ueberpruefungsantrag nach § 44 SGB X stellen — <strong>bis zu 1 Jahr rueckwirkend</strong>,
                  für manche Faelle sogar 4 Jahre.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">Verwandte Tools</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/scan" className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <ScanSearch className="h-5 w-5 text-primary" />
                  <div className="font-medium">Bescheid-Scan</div>
                </div>
                <div className="text-xs text-muted-foreground">KI prüft deinen Bescheid in 60 Sekunden</div>
              </Link>
              <Link to="/rechner/fristen" className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-primary" />
                  <div className="font-medium">Fristen-Rechner</div>
                </div>
                <div className="text-xs text-muted-foreground">Wann genau läuft deine Frist ab?</div>
              </Link>
              <Link to="/musterschreiben" className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="font-medium">Widerspruchs-Vorlagen</div>
                </div>
                <div className="text-xs text-muted-foreground">20+ rechtssichere Templates</div>
              </Link>
              <Link to="/tracker" className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <div className="font-medium">Widerspruchs-Tracker</div>
                </div>
                <div className="text-xs text-muted-foreground">Behalte alle Verfahren im Blick</div>
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-lg p-8 gradient-boxer text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Lass deinen Bescheid in 60 Sekunden prüfen</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Kein Lesen, kein Recherchieren — die KI findet jeden Fehler.
              Und schreibt dir den Widerspruch gleich mit.
            </p>
            <Link to="/scan">
              <Button size="xl" className="bg-white text-red-700 hover:bg-white/90">
                <ScanSearch className="mr-2 h-5 w-5" />
                Bescheid jetzt prüfen
              </Button>
            </Link>
          </section>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 text-center">
            Rechtsgrundlagen: § 84 SGG (Widerspruchsfrist), § 37 SGB X (Bekanntgabe), § 24 SGB X (Anhoerung), § 44 SGB X (Überprüfung)
          </div>
        </article>
      </div>
    </div>
  )
}
