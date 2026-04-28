import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Info, MapPin, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { berechneKdu, KduRechnerErgebnis } from '@/lib/rechner-logik'
import { KDU_TABELLEN } from '@/lib/kdu-tabellen'
import { generateRechnerPdf } from '@/lib/pdf-export'
import { saveRechnerErgebnis } from '@/lib/rechner-verlauf'
import { shareResult } from '@/lib/share'
import Breadcrumbs from '@/components/Breadcrumbs'
import SaveCalculationButton from '@/components/SaveCalculationButton'
import { PageHeader } from '@/lib/fintutto-design'

export default function KduRechner() {
  const [plz, setPlz] = useState('')
  const [bgGroesse, setBgGroesse] = useState(1)
  const [kaltmiete, setKaltmiete] = useState(0)
  const [nebenkosten, setNebenkosten] = useState(0)
  const [heizkosten, setHeizkosten] = useState(0)
  const [wohnflaeche, setWohnflaeche] = useState(0)
  const [ergebnis, setErgebnis] = useState<KduRechnerErgebnis | null>(null)
  const [fehler, setFehler] = useState('')

  const staedte = KDU_TABELLEN.map(k => k.stadt)

  const handleStadtSelect = (stadt: string) => {
    const kdu = KDU_TABELLEN.find(k => k.stadt === stadt)
    if (kdu && kdu.plzRange.length > 0) {
      setPlz(kdu.plzRange[0])
    }
  }

  const handleBerechnen = () => {
    setFehler('')
    if (!plz) {
      setFehler('Bitte gib eine PLZ ein oder wähle eine Stadt.')
      return
    }
    const result = berechneKdu({ plz, bgGroesse, kaltmiete, nebenkosten, heizkosten, qm: wohnflaeche })
    if (!result) {
      setFehler('PLZ nicht in unserer Datenbank. Frag unseren KI-Berater!')
      setErgebnis(null)
    } else {
      setErgebnis(result)
      saveRechnerErgebnis('KdU-Rechner', 'kdu', {
        kaltmieteAngemessen: result.kaltmieteAngemessen ? 'Ja' : 'Nein',
        heizkostenAngemessen: result.heizkostenAngemessen ? 'Ja' : 'Nein',
        kaltmieteGrenze: result.kaltmieteGrenze,
        plz,
      })
    }
  }

  const getAmpel = () => {
    if (!ergebnis) return null
    const problems = [!ergebnis.kaltmieteAngemessen, !ergebnis.heizkostenAngemessen, !ergebnis.qmAngemessen].filter(Boolean).length
    if (problems === 0) return { color: 'green', icon: CheckCircle, text: 'Alles im grünen Bereich!', desc: 'Deine Wohnkosten liegen innerhalb der Angemessenheitsgrenzen.' }
    if (problems >= 2) return { color: 'red', icon: AlertTriangle, text: 'Warnung: Kosten deutlich über Angemessenheit', desc: 'Mehrere deiner Wohnkosten übersteigen die Grenzen.' }
    return { color: 'yellow', icon: Info, text: 'Achtung: Teilweise über den Grenzen', desc: 'Einige deiner Wohnkosten übersteigen die Angemessenheitsgrenzen.' }
  }

  const renderBar = (titel: string, ist: number, grenze: number, einheit: string, ok: boolean) => {
    const pct = grenze > 0 ? Math.min((ist / grenze) * 100, 150) : 0
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">{titel}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center"><span className="text-gray-600">Dein Wert:</span><span className="font-semibold text-lg">{ist} {einheit}</span></div>
          <div className="flex justify-between items-center"><span className="text-gray-600">Grenzwert:</span><span className="font-semibold text-lg">{grenze} {einheit}</span></div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className={`h-full transition-all ${ok ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <div className="flex items-center gap-2">
            {ok ? <><CheckCircle className="w-5 h-5 text-green-600" /><span className="text-green-600 font-medium">Angemessen</span></>
              : <><AlertTriangle className="w-5 h-5 text-red-600" /><span className="text-red-600 font-medium">Über Grenzwert</span></>}
          </div>
        </div>
      </div>
    )
  }

  const ampel = getAmpel()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Breadcrumbs items={[{ label: 'Rechner', href: '/rechner' }, { label: 'KdU-Rechner' }]} className="pt-6" />
      </div>
      <PageHeader
        badge="KdU-Check"
        title="Sind deine Wohnkosten"
        titleGradient="angemessen?"
        subtitle="Prüfe Kaltmiete, Nebenkosten und Heizkosten gegen die Angemessenheitsgrenze nach § 22 SGB II."
      />
      <div className="max-w-4xl mx-auto px-4 pb-8 mt-4">

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Deine Angaben</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" />Postleitzahl</label>
              <input type="text" value={plz} onChange={(e) => setPlz(e.target.value)} placeholder="z.B. 10115" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">oder Stadt</label>
              <select onChange={(e) => handleStadtSelect(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Stadt wählen...</option>
                {staedte.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedarfsgemeinschaft</label>
              <select value={bgGroesse} onChange={(e) => setBgGroesse(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kaltmiete (EUR)</label>
              <input type="number" value={kaltmiete || ''} onChange={(e) => setKaltmiete(Number(e.target.value))} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nebenkosten (EUR)</label>
              <input type="number" value={nebenkosten || ''} onChange={(e) => setNebenkosten(Number(e.target.value))} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heizkosten (EUR)</label>
              <input type="number" value={heizkosten || ''} onChange={(e) => setHeizkosten(Number(e.target.value))} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wohnflaeche (qm)</label>
              <input type="number" value={wohnflaeche || ''} onChange={(e) => setWohnflaeche(Number(e.target.value))} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <Button onClick={handleBerechnen} className="mt-6 w-full gradient-boxer text-white font-semibold py-3 rounded-lg">Berechnen</Button>
        </div>

        {fehler && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">{fehler}</p>
              <Link to="/chat" className="text-red-600 hover:text-red-700 underline text-sm mt-1 inline-block">Zum KI-Berater</Link>
            </div>
          </div>
        )}

        {ergebnis && ampel && (
          <div className="space-y-6">
            <div className={`rounded-xl shadow-lg p-8 ${ampel.color === 'green' ? 'bg-green-50 border-2 border-green-500' : ampel.color === 'yellow' ? 'bg-yellow-50 border-2 border-yellow-500' : 'bg-red-50 border-2 border-red-500'}`}>
              <div className="flex items-center gap-4 mb-3">
                <ampel.icon className={`w-12 h-12 ${ampel.color === 'green' ? 'text-green-600' : ampel.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`} />
                <h2 className="text-2xl font-bold text-gray-900">{ampel.text}</h2>
              </div>
              <p className="text-gray-700 text-lg">{ampel.desc}</p>
              {ergebnis.stadt && <p className="text-sm text-gray-500 mt-2">Stadt: {ergebnis.stadt}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderBar('Kaltmiete', kaltmiete, ergebnis.kaltmieteGrenze, 'EUR', ergebnis.kaltmieteAngemessen)}
              {renderBar('Wohnflaeche', wohnflaeche, ergebnis.qmGrenze, 'qm', ergebnis.qmAngemessen)}
              {renderBar('Heizkosten', heizkosten, ergebnis.heizkostenGrenze, 'EUR', ergebnis.heizkostenAngemessen)}
            </div>

            {!ergebnis.schluessigesKonzept && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Kein schluessiges Konzept</h3>
                    <p className="text-blue-800">In dieser Stadt gibt es kein schluessiges Konzept. Du hast bessere Chancen, auch hoehere Kosten erstattet zu bekommen!</p>
                  </div>
                </div>
              </div>
            )}

            {ergebnis.hinweise.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">Hinweise</h3>
                <ul className="space-y-2">
                  {ergebnis.hinweise.map((h, i) => <li key={i} className="flex items-start gap-2"><Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{h}</span></li>)}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  generateRechnerPdf('KdU-Prüfung (§ 22 SGB II)', [
                    { label: 'PLZ / Stadt', value: ergebnis.stadt || plz },
                    { label: 'BG-Groesse', value: `${bgGroesse} Person${bgGroesse > 1 ? 'en' : ''}` },
                    { label: 'Kaltmiete', value: `${kaltmiete} EUR`, highlight: !ergebnis.kaltmieteAngemessen },
                    { label: 'Kaltmiete-Grenze', value: `${ergebnis.kaltmieteGrenze} EUR` },
                    { label: 'Heizkosten', value: `${heizkosten} EUR`, highlight: !ergebnis.heizkostenAngemessen },
                    { label: 'Heizkosten-Grenze', value: `${ergebnis.heizkostenGrenze} EUR` },
                    { label: 'Wohnflaeche', value: `${wohnflaeche} qm`, highlight: !ergebnis.qmAngemessen },
                    { label: 'Wohnflaeche-Grenze', value: `${ergebnis.qmGrenze} qm` },
                  ])
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />Als PDF
              </Button>
              <Button
                onClick={() => shareResult({
                  title: 'KdU-Prüfung',
                  text: `KdU-Prüfung: Gesamt-KdU ${ergebnis.gesamtKdu} EUR, Angemessene KdU ${ergebnis.angemesseneKdu} EUR (${ergebnis.stadt})`,
                  url: window.location.href,
                })}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />Teilen
              </Button>
              <Link to="/chat" className="flex-1"><Button className="w-full gradient-boxer text-white font-semibold py-3 rounded-lg">Widerspruch prüfen</Button></Link>
              <SaveCalculationButton
                toolId="kdu"
                toolType="rechner"
                inputData={{ plz, bgGroesse, kaltmiete, nebenkosten, heizkosten, wohnflaeche }}
                resultData={{
                  stadt: ergebnis.stadt,
                  kaltmiete_angemessen: ergebnis.kaltmieteAngemessen,
                  kaltmiete_grenze: ergebnis.kaltmieteGrenze,
                  heizkosten_angemessen: ergebnis.heizkostenAngemessen,
                  heizkosten_grenze: ergebnis.heizkostenGrenze,
                  qm_angemessen: ergebnis.qmAngemessen,
                  qm_grenze: ergebnis.qmGrenze,
                  gesamt_kdu: ergebnis.gesamtKdu,
                  angemessene_kdu: ergebnis.angemesseneKdu,
                }}
              />
            </div>
          </div>
        )}

        {/* === SEO-CONTENT-BLOCK ============================================
             Optimiert für Domains kdu-rechner.de + kosten-der-unterkunft-rechner.de.
             Long-form Content, FAQ-Schema-tauglich, Internal Links zu verwandten Tools.
             ============================================================== */}
        <article className="mt-12 space-y-8 max-w-3xl mx-auto">

          <header className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Kosten der Unterkunft (KdU) Rechner — § 22 SGB II
            </h2>
            <p className="text-lg text-gray-600">
              Pruefe in 30 Sekunden, ob das Jobcenter deine Miete und Heizkosten
              vollstaendig uebernehmen muss. Mit aktuellen Mietspiegeln aus über 100 Staedten.
            </p>
          </header>

          {/* Was sind KdU */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">
              Was sind Kosten der Unterkunft (KdU)?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Die <strong>Kosten der Unterkunft und Heizung (KdU)</strong> umfassen nach
              § 22 SGB II alle laufenden Wohnkosten, die das Jobcenter bei Bürgergeld-
              und Sozialhilfe-Empfaengern uebernimmt:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Kaltmiete</strong> (Grundmiete ohne Nebenkosten)</li>
              <li><strong>Kalte Betriebskosten</strong> (Wasser, Muell, Hausmeister, etc.)</li>
              <li><strong>Heizkosten</strong> (Gas, Oel, Fernwaerme, Strom für Warmwasser bei dezentraler Erwaermung)</li>
              <li><strong>Nebenkosten-Nachzahlungen</strong> (einmalig)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Stromkosten für Beleuchtung und Haushaltsgeraete sind <em>nicht</em> Teil der KdU —
              die werden aus dem Regelsatz bezahlt.
            </p>
          </section>

          {/* Wer hat Anspruch */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">
              Wer hat Anspruch auf KdU-Uebernahme?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Jeder Bürgergeld- oder Sozialhilfe-Empfaenger hat grundsaetzlich Anspruch auf
              die Uebernahme der <strong>angemessenen</strong> Kosten der Unterkunft.
              „Angemessen" heisst dabei: Die Wohnung muss sowohl in der <strong>Groesse</strong>
              (z.B. 50 qm für Einzelpersonen, 60 qm für Paare) als auch im <strong>Mietpreis</strong>
              (orientiert am lokalen Mietspiegel) im akzeptierten Rahmen liegen.
            </p>
          </section>

          {/* Was tun wenn KdU gekürzt wird */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-3 text-amber-900">
              Das Jobcenter haelt deine Miete für „unangemessen"?
            </h3>
            <p className="text-gray-800 leading-relaxed mb-3">
              In den allermeisten Faellen lohnt sich ein Widerspruch. Drei haeufige Gruende,
              warum eine Kürzung rechtswidrig ist:
            </p>
            <ol className="list-decimal pl-6 text-gray-800 space-y-2">
              <li>
                <strong>Kein schluessiges Konzept:</strong> Das Jobcenter muss seine
                Angemessenheits-Tabelle wissenschaftlich begruenden. Viele Konzepte halten
                gerichtlicher Prüfung nicht stand (BSG-Rechtsprechung).
              </li>
              <li>
                <strong>6-Monats-Frist nicht beachtet:</strong> Bei zu hoher Miete musst du
                erst <strong>6 Monate</strong> Zeit bekommen, die Kosten zu senken — solange
                werden die vollen Kosten weiter gezahlt (§ 22 Abs. 1 Satz 3 SGB II).
              </li>
              <li>
                <strong>Heizkosten falsch gekürzt:</strong> Ein bundesweiter Heizspiegel
                gilt nur als Pruefmassstab — eine pauschale Kürzung darunter ist meist
                rechtswidrig.
              </li>
            </ol>
            <div className="mt-4">
              <Link to="/scan">
                <Button variant="amt" size="lg" className="gap-2">
                  Bescheid jetzt prüfen lassen <Info className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-4 text-gray-900">Haeufig gestellte Fragen</h3>
            <div className="space-y-5">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Was passiert, wenn meine Miete zu hoch ist?
                </h4>
                <p className="text-sm text-gray-700">
                  Das Jobcenter fordert dich auf, die Kosten zu senken. Du hast <strong>6 Monate</strong>
                  Zeit — waehrenddessen werden die vollen Kosten noch uebernommen. In dieser Zeit kannst
                  du eine guenstigere Wohnung suchen, untervermieten, umziehen oder die Miete senken.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Werden Heizkosten immer voll uebernommen?
                </h4>
                <p className="text-sm text-gray-700">
                  Heizkosten werden in <strong>tatsaechlicher Höhe</strong> uebernommen, solange sie
                  angemessen sind. Als Orientierung dient der bundesweite Heizspiegel. Bei Verbrauch
                  über dem Wert der Kategorie „zu hoch" droht eine Kürzung — du kannst aber Gruende nennen
                  (z.B. schlechte Daemmung, Krankheit, Familiengroesse).
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Gilt die KdU-Prüfung auch für Wohneigentum?
                </h4>
                <p className="text-sm text-gray-700">
                  Ja. Bei Wohneigentum werden Hauslasten (Zinsen, Grundsteuer, Versicherungen, Heizung)
                  uebernommen, aber keine Tilgungsanteile (Bundessozialgericht).
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Was zaehlt zur Bedarfsgemeinschaft (BG)?
                </h4>
                <p className="text-sm text-gray-700">
                  Zur BG gehoeren alle Personen im selben Haushalt, die wirtschaftlich
                  zusammenleben — also Ehepartner, eingetragene Lebenspartner, unverheiratete
                  Paare in eheaehnlicher Gemeinschaft und minderjaehrige Kinder.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Wie genau ist dieser KdU-Rechner?
                </h4>
                <p className="text-sm text-gray-700">
                  Der Rechner basiert auf den aktuellen Mietspiegel-Tabellen aus über 100 deutschen
                  Staedten und den Wohnflaechengrenzen der Wohnraumfoerderungsgesetze.
                  Die Grenzwerte koennen sich kommunal unterscheiden — bei Streitfaellen
                  zaehlt die Tabelle deines Jobcenters.
                </p>
              </div>
            </div>
          </section>

          {/* Verwandte Rechner */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-4 text-gray-900">Weitere passende Rechner</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/rechner/buergergeld" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">Bürgergeld-Rechner</div>
                <div className="text-xs text-muted-foreground">Vollstaendige Anspruchsberechnung mit BG, Einkommen, Mehrbedarfen</div>
              </Link>
              <Link to="/rechner/mehrbedarf" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">Mehrbedarfs-Rechner</div>
                <div className="text-xs text-muted-foreground">Alleinerziehend, schwanger, Behinderung, kostenaufwaendige Ernaehrung</div>
              </Link>
              <Link to="/rechner/freibetrag" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">Freibetrags-Rechner</div>
                <div className="text-xs text-muted-foreground">Wieviel von deinem Einkommen wird angerechnet?</div>
              </Link>
              <Link to="/rechner/sanktion" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">Sanktions-Rechner</div>
                <div className="text-xs text-muted-foreground">Kürzung bei Pflichtversaeumnis berechnen</div>
              </Link>
            </div>
          </section>

          {/* Bescheid-Scan CTA */}
          <section className="rounded-lg p-6 gradient-boxer text-white">
            <h3 className="text-xl font-bold mb-2">Du hast einen Bescheid mit gekuerzten KdU?</h3>
            <p className="opacity-90 mb-4">
              Lade ihn hoch — unsere KI prüft in unter einer Minute, ob die Kürzung
              rechtmaessig ist und erstellt dir den passenden Widerspruch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/scan">
                <Button size="lg" className="bg-white text-red-700 hover:bg-white/90">
                  Bescheid jetzt scannen
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  KI-Berater fragen
                </Button>
              </Link>
            </div>
          </section>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 text-center">
            <Info className="w-4 h-4 inline mr-2" />
            Rechtsgrundlage: § 22 SGB II — Bedarfe für Unterkunft und Heizung
          </div>
        </article>
      </div>
    </div>
  )
}
