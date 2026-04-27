import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Info, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { berechneMehrbedarf, MehrbedarfErgebnis, REGELSAETZE_2025 } from '@/lib/rechner-logik'
import { generateRechnerPdf, RechnerSection } from '@/lib/pdf-export'
import { saveRechnerErgebnis } from '@/lib/rechner-verlauf'
import { shareResult } from '@/lib/share'
import Breadcrumbs from '@/components/Breadcrumbs'
import SaveCalculationButton from '@/components/SaveCalculationButton'

export default function MehrbedarfRechner() {
  const [regelsatz, setRegelsatz] = useState<number>(REGELSAETZE_2025.RS1)
  const [schwanger, setSchwanger] = useState(false)
  const [alleinerziehend, setAlleinerziehend] = useState(false)
  const [anzahlKinder, setAnzahlKinder] = useState(1)
  const [kinderAlter, setKinderAlter] = useState<number[]>([0])
  const [behindert, setBehindert] = useState(false)
  const [kostenaufwaendigeErnaehrung, setKostenaufwaendigeErnaehrung] = useState(false)
  const [ernaehrungstyp, setErnaehrungstyp] = useState('')
  const [dezentraleWarmwasser, setDezentraleWarmwasser] = useState(false)
  const [result, setResult] = useState<MehrbedarfErgebnis | null>(null)
  const [calculated, setCalculated] = useState(false)

  const handleBerechnen = () => {
    const ergebnis = berechneMehrbedarf({
      regelsatz,
      schwanger,
      alleinerziehend,
      kinderAnzahl: alleinerziehend ? anzahlKinder : 0,
      kinderAlter: alleinerziehend ? kinderAlter : [],
      behindert,
      erwerbsgemindert: behindert,
      kostenaufwaendigeErnaehrung,
      ernaehrungArt: kostenaufwaendigeErnaehrung ? ernaehrungstyp : undefined,
      dezentraleWarmwasser,
    })
    setResult(ergebnis)
    setCalculated(true)
    if (ergebnis.gesamt > 0) {
      saveRechnerErgebnis('Mehrbedarf-Rechner', 'mehrbedarf', {
        gesamt: ergebnis.gesamt,
        regelsatz,
        positionen: ergebnis.details.length,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: 'Rechner', href: '/rechner' }, { label: 'Mehrbedarf-Rechner' }]} className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Mehrbedarf-Rechner</h1>
          <p className="text-gray-600 mt-2">Berechne deinen Anspruch auf Mehrbedarf nach § 21 SGB II</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Deine Angaben</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dein Regelsatz</label>
            <select
              value={regelsatz}
              onChange={(e) => setRegelsatz(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value={563}>RS1: 563 EUR - Alleinstehend</option>
              <option value={506}>RS2: 506 EUR - Paar (je Person)</option>
              <option value={451}>RS3: 451 EUR - Erwachsene in BG</option>
              <option value={471}>RS4: 471 EUR - Jugendliche 14-17</option>
              <option value={390}>RS5: 390 EUR - Kinder 6-13</option>
              <option value={357}>RS6: 357 EUR - Kinder 0-5</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <input type="checkbox" id="schwanger" checked={schwanger} onChange={(e) => setSchwanger(e.target.checked)} className="mt-1 mr-3 w-4 h-4 text-blue-600" />
              <label htmlFor="schwanger" className="text-sm cursor-pointer">
                <span className="font-medium text-gray-900">Schwangerschaft</span>
                <p className="text-gray-600">Ab der 13. Schwangerschaftswoche</p>
              </label>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start">
                <input type="checkbox" id="alleinerziehend" checked={alleinerziehend} onChange={(e) => setAlleinerziehend(e.target.checked)} className="mt-1 mr-3 w-4 h-4 text-blue-600" />
                <label htmlFor="alleinerziehend" className="text-sm flex-1 cursor-pointer">
                  <span className="font-medium text-gray-900">Alleinerziehend</span>
                  <p className="text-gray-600">Du erziehst ein oder mehrere Kinder allein</p>
                </label>
              </div>
              {alleinerziehend && (
                <div className="ml-6 mt-4 space-y-3 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anzahl Kinder</label>
                    <select value={anzahlKinder} onChange={(e) => { const c = parseInt(e.target.value); setAnzahlKinder(c); setKinderAlter(Array(c).fill(0)) }} className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alter der Kinder (0-17)</label>
                    <div className="space-y-2">
                      {Array.from({ length: anzahlKinder }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-16">Kind {i + 1}:</span>
                          <input type="number" min="0" max="17" value={kinderAlter[i] || 0} onChange={(e) => { const a = [...kinderAlter]; a[i] = parseInt(e.target.value) || 0; setKinderAlter(a) }} className="border border-gray-300 rounded-md px-3 py-2 w-24" />
                          <span className="text-sm text-gray-600">Jahre</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start">
                <input type="checkbox" id="behindert" checked={behindert} onChange={(e) => setBehindert(e.target.checked)} className="mt-1 mr-3 w-4 h-4 text-blue-600" />
                <label htmlFor="behindert" className="text-sm cursor-pointer">
                  <span className="font-medium text-gray-900">Behinderung / Erwerbsminderung</span>
                  <p className="text-gray-600">GdB ab 50 oder Erwerbsminderungsrente</p>
                </label>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start">
                <input type="checkbox" id="ernaehrung" checked={kostenaufwaendigeErnaehrung} onChange={(e) => setKostenaufwaendigeErnaehrung(e.target.checked)} className="mt-1 mr-3 w-4 h-4 text-blue-600" />
                <label htmlFor="ernaehrung" className="text-sm flex-1 cursor-pointer">
                  <span className="font-medium text-gray-900">Kostenaufwaendige Ernaehrung</span>
                  <p className="text-gray-600">Krankheitsbedingt notwendige besondere Ernaehrung</p>
                </label>
              </div>
              {kostenaufwaendigeErnaehrung && (
                <div className="ml-6 mt-3">
                  <select value={ernaehrungstyp} onChange={(e) => setErnaehrungstyp(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="">Bitte waehlen...</option>
                    <option value="niereninsuffizienz">Niereninsuffizienz</option>
                    <option value="zoeliakie">Zoeliakie</option>
                    <option value="colitis">Colitis ulcerosa / Morbus Crohn</option>
                    <option value="diabetes">Diabetes mellitus</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start">
                <input type="checkbox" id="warmwasser" checked={dezentraleWarmwasser} onChange={(e) => setDezentraleWarmwasser(e.target.checked)} className="mt-1 mr-3 w-4 h-4 text-blue-600" />
                <label htmlFor="warmwasser" className="text-sm cursor-pointer">
                  <span className="font-medium text-gray-900">Dezentrale Warmwassererzeugung</span>
                  <p className="text-gray-600">Boiler/Durchlauferhitzer in der Wohnung</p>
                </label>
              </div>
            </div>
          </div>

          <Button onClick={handleBerechnen} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3">Berechnen</Button>
        </div>

        {calculated && result && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Dein Ergebnis</h2>
            {result.gesamt > 0 ? (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                  <p className="text-sm text-blue-800 mb-1">Gesamter Mehrbedarf</p>
                  <p className="text-3xl font-bold text-blue-900">{result.gesamt.toFixed(2)} EUR</p>
                  <p className="text-sm text-blue-700 mt-1">pro Monat zusaetzlich zu deinem Regelsatz</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Art</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Betrag</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rechtsgrundlage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.details.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.erklaerung}</p>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">{item.betrag.toFixed(2)} EUR</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.paragraph}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {ernaehrungstyp === 'diabetes' && (
                  <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Hinweis zu Diabetes</p>
                        <p className="mt-1">Seit 2014 wird fuer Diabetes in der Regel kein Mehrbedarf mehr gewaehrt (BSG-Rechtsprechung).</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      const sections: RechnerSection[] = result.details.map(d => ({
                        label: `${d.label} (${d.paragraph})`,
                        value: `${d.betrag.toFixed(2)} EUR`,
                      }))
                      generateRechnerPdf('Mehrbedarf-Berechnung (§ 21 SGB II)', sections, { label: 'Gesamter Mehrbedarf', value: `${result.gesamt.toFixed(2)} EUR` })
                    }}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />Als PDF
                  </Button>
                  <Button
                    onClick={() => shareResult({
                      title: 'Mehrbedarf-Berechnung',
                      text: `Mein Mehrbedarf nach § 21 SGB II: ${result.gesamt.toFixed(2)} EUR / Monat`,
                      url: window.location.href,
                    })}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />Teilen
                  </Button>
                  <Link to="/scan" className="flex-1"><Button variant="outline" className="w-full"><Heart className="w-4 h-4 mr-2" />Bescheid pruefen</Button></Link>
                  <Link to="/rechner" className="flex-1"><Button variant="outline" className="w-full">Alle Rechner</Button></Link>
                  <SaveCalculationButton
                    toolId="mehrbedarf"
                    toolType="rechner"
                    inputData={{ regelsatz, schwanger, alleinerziehend, anzahlKinder, kinderAlter, behindert, kostenaufwaendigeErnaehrung, ernaehrungstyp, dezentraleWarmwasser }}
                    resultData={{
                      gesamt_mehrbedarf: result.gesamt,
                      anzahl_positionen: result.details.length,
                      details: result.details,
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">Kein Mehrbedarf ermittelt</p>
                <p className="text-sm text-gray-500">Basierend auf deinen Angaben besteht kein Anspruch auf Mehrbedarf.</p>
              </div>
            )}
          </div>
        )}

        {/* === SEO-CONTENT-BLOCK ============================================
             Optimiert fuer Domain mehrbedarf-rechner.de.
             ============================================================== */}
        <article className="mt-12 space-y-8 max-w-3xl mx-auto">

          <header className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Mehrbedarfs-Rechner — § 21 SGB II
            </h2>
            <p className="text-lg text-gray-600">
              Pruefe in unter einer Minute, welche Mehrbedarfe dir zustehen — Alleinerziehende,
              Schwangere, Behinderte, kostenaufwaendige Ernaehrung, dezentrale Warmwasser-Erzeugung.
            </p>
          </header>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-3 text-gray-900">Was sind Mehrbedarfe nach § 21 SGB II?</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Mehrbedarfe</strong> sind Zuschlaege zum normalen Regelsatz, die das
              Buergergeld in besonderen Lebenslagen ergaenzen — weil bestimmte Personengruppen
              regelmaessig hoehere Kosten haben als der Regelsatz abdeckt.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Wichtig:</strong> Mehrbedarfe werden <em>nicht automatisch</em> gewaehrt.
              Du musst sie aktiv beantragen — aber rueckwirkend ab Antragstellung.
            </p>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-4 text-gray-900">Diese 5 Mehrbedarfe gibt es</h3>
            <ul className="list-decimal pl-6 text-gray-700 space-y-3">
              <li>
                <strong>Alleinerziehende</strong> (§ 21 Abs. 3 SGB II) — gestaffelt nach Anzahl + Alter der Kinder.
                Mit 2 Kindern unter 16: 36% des Regelsatzes (~202 EUR).
              </li>
              <li>
                <strong>Schwangerschaft ab der 13. Woche</strong> (§ 21 Abs. 2 SGB II) — 17% des Regelsatzes (~96 EUR).
              </li>
              <li>
                <strong>Kostenaufwaendige Ernaehrung</strong> (§ 21 Abs. 5 SGB II) — bei medizinisch
                notwendiger Diaet (Diabetes, Niereninsuffizienz, Zoeliakie, Krebs, etc.) 5-30% Aufschlag,
                je nach Erkrankung. Aerztliches Attest zwingend.
              </li>
              <li>
                <strong>Behinderung mit Erwerbsminderung</strong> (§ 21 Abs. 4 SGB II) — 35% Aufschlag fuer
                Personen, die wegen Behinderung an Massnahmen zur Eingliederung in Arbeit teilnehmen.
              </li>
              <li>
                <strong>Dezentrale Warmwasser-Erzeugung</strong> (§ 21 Abs. 7 SGB II) — Pauschale je nach Alter:
                Erwachsene 2,3% des Regelsatzes (~13 EUR/Monat).
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-3 text-amber-900">
              Mehrbedarf vergessen? Der haeufigste Fehler im Bescheid.
            </h3>
            <p className="text-gray-800 leading-relaxed mb-3">
              In der Praxis fehlen Mehrbedarfe in <strong>fast jedem dritten Bescheid</strong>.
              Das Jobcenter prueft sie nicht aktiv. Wenn dein Bescheid weniger zeigt als unser Rechner ergibt,
              gibt's gute Chancen mit einem Widerspruch oder Ueberpruefungsantrag — der geht bis zu 1 Jahr rueckwirkend.
            </p>
            <Link to="/scan">
              <Button variant="amt" size="lg" className="gap-2">Bescheid pruefen lassen</Button>
            </Link>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-4 text-gray-900">FAQ Mehrbedarf</h3>
            <div className="space-y-5">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Wie beantrage ich Mehrbedarf?</h4>
                <p className="text-sm text-gray-700">
                  Formloser Antrag reicht — schriftlich oder via Online-Portal des Jobcenters.
                  Nachweise: aerztliches Attest (Ernaehrung, Behinderung), Mutterpass (Schwangerschaft),
                  Schulbescheinigungen der Kinder (Alleinerziehend).
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Werden Mehrbedarfe rueckwirkend gezahlt?</h4>
                <p className="text-sm text-gray-700">
                  Ja — ab dem Monat der Antragstellung. Beim <strong>Ueberpruefungsantrag</strong> nach § 44 SGB X
                  sogar bis zu <strong>1 Jahr rueckwirkend</strong>, wenn der Mehrbedarf von Anfang an haette beruecksichtigt werden muessen.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Kann ich mehrere Mehrbedarfe gleichzeitig bekommen?</h4>
                <p className="text-sm text-gray-700">
                  Ja, Mehrbedarfe sind kumulierbar — z.B. alleinerziehend + dezentrale Warmwasser-Erzeugung.
                  Begrenzung: Summe darf nicht mehr als der Regelsatz betragen (§ 21 Abs. 8 SGB II).
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Was bei Krankheit ohne Diagnose?</h4>
                <p className="text-sm text-gray-700">
                  Hier wird's kniffelig: Das Jobcenter folgt meist den
                  „Empfehlungen des Deutschen Vereins" — Liste der anerkannten Krankheiten mit Pauschal-Saetzen.
                  Bei seltenen Erkrankungen lohnt sich anwaltliche Hilfe oder Beratung beim Sozialverband.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-4 text-gray-900">Verwandte Rechner</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/rechner/buergergeld" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">Buergergeld-Rechner</div>
                <div className="text-xs text-muted-foreground">Komplette Anspruchsberechnung</div>
              </Link>
              <Link to="/rechner/kdu" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">KdU-Rechner</div>
                <div className="text-xs text-muted-foreground">Wohnkosten-Pruefung</div>
              </Link>
              <Link to="/rechner/freibetrag" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">Freibetrags-Rechner</div>
                <div className="text-xs text-muted-foreground">Einkommens-Anrechnung</div>
              </Link>
              <Link to="/rechner/erstausstattung" className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="font-medium text-gray-900">Erstausstattungs-Rechner</div>
                <div className="text-xs text-muted-foreground">Einmalige Leistungen</div>
              </Link>
            </div>
          </section>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 text-center">
            Rechtsgrundlage: § 21 SGB II — Mehrbedarfe
          </div>
        </article>
      </div>
    </div>
  )
}
