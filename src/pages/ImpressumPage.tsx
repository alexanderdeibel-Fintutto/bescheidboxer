import { Link } from 'react-router-dom'
import { PageHeader, FadeSection } from '@/lib/fintutto-design'

export default function ImpressumPage() {
  return (
    <>
      <PageHeader
        badge="Rechtliches"
        title="Impressum"
        subtitle="Angaben gemäß § 5 TMG"
        align="center"
      />

      <FadeSection delay={120} className="container max-w-4xl mx-auto px-6 pb-16 space-y-10">
        {/* TODO BANNER — vor Live-Schaltung muss alles ergänzt sein */}
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/30 p-5">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
            ⚠️ Hinweis (intern, vor Live-Schaltung entfernen):
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            Dieses Impressum enthält noch Platzhalter. Vor Beta-Skalierung
            müssen Vertretungsberechtigter, Adresse, USt-Status / Handelsregister
            und Verantwortlicher nach § 18 MStV mit echten Daten gefüllt
            werden — sonst Abmahnungs-Risiko nach § 5 TMG / § 5a UWG.
          </p>
        </div>

        {/* Angaben gemaess § 5 TMG */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Angaben gemaess &sect; 5 TMG
          </h2>
          <div className="space-y-2 text-gray-600">
            <p className="font-semibold text-gray-900">
              Fintutto UG (haftungsbeschraenkt) &ndash; i.G. (in Gruendung)
            </p>
            <p>
              <strong className="text-gray-900">Vertreten durch:</strong>{' '}
              [Name wird ergaenzt]
            </p>
            <p>
              <strong className="text-gray-900">Adresse:</strong>{' '}
              [Wird nach Eintragung ergaenzt]
            </p>
          </div>
        </section>

        {/* Kontakt */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong className="text-gray-900">E-Mail:</strong>{' '}
              <a
                href="mailto:kontakt@fintutto.de"
                className="text-primary hover:underline"
              >
                kontakt@fintutto.de
              </a>
            </p>
          </div>
        </section>

        {/* Umsatzsteuer-ID */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Umsatzsteuer-ID
          </h2>
          <p className="text-gray-600">
            Umsatzsteuer-Identifikationsnummer gemaess &sect; 27 a
            Umsatzsteuergesetz: [Wird nach Anmeldung ergaenzt]
          </p>
        </section>

        {/* Handelsregister */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Handelsregister
          </h2>
          <p className="text-gray-600">[Wird nach Eintragung ergaenzt]</p>
        </section>

        {/* Verantwortlich für den Inhalt */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verantwortlich für den Inhalt nach &sect; 18 Abs. 2 MStV
          </h2>
          <p className="text-gray-600">[Wird ergaenzt]</p>
        </section>

        {/* EU-Streitschlichtung */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            EU-Streitschlichtung
          </h2>
          <p className="text-gray-600">
            Die Europaeische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht
            bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        {/* Haftungsausschluss */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Haftungsausschluss
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Haftung für Inhalte
              </h3>
              <p className="text-gray-600">
                Als Diensteanbieter sind wir gemaess &sect; 7 Abs. 1 TMG für
                eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, uebermittelte oder
                gespeicherte fremde Informationen zu ueberwachen oder nach
                Umstaenden zu forschen, die auf eine rechtswidrige Taetigkeit
                hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
                Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
                hiervon unberuehrt. Eine diesbezuegliche Haftung ist jedoch erst
                ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                moeglich. Bei Bekanntwerden von entsprechenden
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Haftung für Links
              </h3>
              <p className="text-gray-600">
                Unser Angebot enthaelt Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb koennen wir
                für diese fremden Inhalte auch keine Gewaehr uebernehmen. Fuer
                die Inhalte der verlinkten Seiten ist stets der jeweilige
                Anbieter oder Betreiber der Seiten verantwortlich. Die
                verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
                moegliche Rechtsverstoesse überprüft. Rechtswidrige Inhalte
                waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
                permanente inhaltliche Kontrolle der verlinkten Seiten ist
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
                derartige Links umgehend entfernen.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Urheberrecht
              </h3>
              <p className="text-gray-600">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen
                der schriftlichen Zustimmung des jeweiligen Autors bzw.
                Erstellers. Downloads und Kopien dieser Seite sind nur für den
                privaten, nicht kommerziellen Gebrauch gestattet. Soweit die
                Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden,
                werden die Urheberrechte Dritter beachtet. Insbesondere werden
                Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem
                auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir
                um einen entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Inhalte umgehend
                entfernen.
              </p>
            </div>
          </div>
        </section>

        {/* Hinweis BescheidBoxer */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Wichtiger Hinweis
          </h2>
          <p className="text-gray-600">
            BescheidBoxer bietet keine Rechtsberatung im Sinne des RDG
            (Rechtsdienstleistungsgesetz). Die KI-gestuetzten Analysen dienen
            lediglich der Information und ersetzen nicht die Beratung durch
            einen Fachanwalt. Bei konkreten Rechtsfragen wenden Sie sich bitte
            an einen Rechtsanwalt oder eine anerkannte Beratungsstelle.
          </p>
        </section>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
          <Link
            to="/datenschutz"
            className="text-primary hover:underline text-sm"
          >
            Datenschutzerklärung
          </Link>
          <Link to="/agb" className="text-primary hover:underline text-sm">
            Allgemeine Geschäftsbedingungen
          </Link>
        </div>
      </FadeSection>
    </>
  )
}
