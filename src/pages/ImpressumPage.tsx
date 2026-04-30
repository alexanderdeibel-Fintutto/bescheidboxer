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
        {/* Angaben gemäß § 5 TMG */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Angaben gemäß &sect; 5 TMG
          </h2>
          <div className="space-y-2 text-gray-600">
            <p className="font-semibold text-gray-900">
              Fintutto UG (haftungsbeschränkt) i.G.
            </p>
            <p>
              <strong className="text-gray-900">Vertreten durch:</strong>{' '}
              Alexander Deibel (Geschäftsführer)
            </p>
            <p>
              <strong className="text-gray-900">Anschrift:</strong>
              <br />
              Kolonie 2
              <br />
              18317 Saal
              <br />
              Deutschland
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
                href="mailto:mail@fintutto.de"
                className="text-primary hover:underline"
              >
                mail@fintutto.de
              </a>
            </p>
            <p className="text-sm">
              Für BescheidBoxer-spezifische Anfragen:{' '}
              <a
                href="mailto:hello@bescheidboxer.de"
                className="text-primary hover:underline"
              >
                hello@bescheidboxer.de
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
            Umsatzsteuer-Identifikationsnummer gemäß &sect; 27 a
            Umsatzsteuergesetz: <em>beantragt</em> (wird nach Erteilung durch
            das Finanzamt hier ergänzt).
          </p>
        </section>

        {/* Handelsregister */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Handelsregister
          </h2>
          <p className="text-gray-600">
            Eintragung in das Handelsregister beim Amtsgericht Stralsund
            beantragt. Die HRB-Nummer wird nach Eintragung hier ergänzt.
            Aktuell führt die Gesellschaft den Zusatz <em>i.G.</em> (in
            Gründung).
          </p>
        </section>

        {/* Verantwortlich für den Inhalt */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verantwortlich für den Inhalt nach &sect; 18 Abs. 2 MStV
          </h2>
          <p className="text-gray-600">
            Alexander Deibel
            <br />
            Kolonie 2
            <br />
            18317 Saal
          </p>
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
