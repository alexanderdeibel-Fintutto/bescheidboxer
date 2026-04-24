import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import {
  CheckCircle2,
  Swords,
  Shield,
  Zap,
  Crown,
  HelpCircle,
  CreditCard,
  ArrowRight,
  Home,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLANS, CREDIT_PACKAGES, type PlanType } from '@/lib/credits'
import { useAuth } from '@/contexts/AuthContext'
import { startCheckout } from '@/lib/stripeCheckout'
import { toast } from 'sonner'

const planMeta: Record<
  PlanType,
  { icon: typeof Shield; features: string[]; cta: string }
> = {
  schnupperer: {
    icon: Shield,
    features: [
      '5 KI-Nachrichten pro Tag',
      '2 Bescheid-Scans pro Monat',
      'Forum lesen & posten',
      'Basis-Rechtsinfos zu SGB II, III, XII',
    ],
    cta: 'Kostenlos starten',
  },
  starter: {
    icon: Zap,
    features: [
      '10 KI-Nachrichten pro Tag',
      '1 personalisiertes Schreiben/Monat',
      '3 Bescheid-Scans pro Monat',
      '10 Credits monatlich inklusive',
      'Forum lesen, posten & limitierter Chat',
    ],
    cta: 'Starter waehlen',
  },
  kaempfer: {
    icon: Swords,
    features: [
      'Unbegrenzte KI-Nachrichten',
      '3 Schreiben pro Monat inklusive',
      'Unbegrenzte Bescheid-Scans',
      '25 Credits monatlich inklusive',
      '1 Postversand inklusive',
      'Voller Forum-Zugang inkl. Chat',
      'MieterApp Basic inklusive',
    ],
    cta: 'Kaempfer waehlen',
  },
  vollschutz: {
    icon: Crown,
    features: [
      'Unbegrenzte KI-Nachrichten',
      'Unbegrenzte Schreiben',
      'Unbegrenzte Bescheid-Scans',
      '50 Credits monatlich inklusive',
      '3 Postversand inklusive',
      'VIP-Forum mit Priority-Support',
      'MieterApp Premium inklusive',
    ],
    cta: 'Vollschutz waehlen',
  },
}

const faqItems = [
  {
    q: 'Was genau sind Credits und wofuer brauche ich sie?',
    a: 'Credits sind die Waehrung im BescheidBoxer. Du kannst sie fuer Detail-Analysen von Bescheiden, Postversand, personalisierte Schreiben und mehr einsetzen. Jeder Tarif enthaelt ein monatliches Credit-Guthaben \u2013 brauchst du mehr, kannst du jederzeit Pakete nachkaufen.',
  },
  {
    q: 'Was bedeutet "Bescheid-Scan" genau?',
    a: 'Mit dem Bescheid-Scan fotografierst oder laedst du deinen Bescheid hoch. Unsere KI prueft ihn automatisch auf Fehler, falsche Berechnungen und fehlende Positionen. Im Schnupperer-Tarif bekommst du 1 Scan pro Monat \u2013 ab Kaempfer sind Scans unbegrenzt.',
  },
  {
    q: 'Kann ich jederzeit kuendigen oder den Tarif wechseln?',
    a: 'Ja, du kannst dein Abo jederzeit monatlich kuendigen. Ein Upgrade ist sofort moeglich, ein Downgrade wird zum naechsten Abrechnungszeitraum wirksam. Nicht verbrauchte Credits verfallen am Ende des Monats.',
  },
  {
    q: 'Ist die KI-Beratung eine echte Rechtsberatung?',
    a: 'Nein. BescheidBoxer bietet KI-gestuetzte Informationen basierend auf SGB II, III, X und XII. Es ersetzt keine anwaltliche Beratung. Bei komplexen Faellen empfehlen wir eine Beratung beim Sozialverband (VdK, SoVD) oder einem Fachanwalt.',
  },
  {
    q: 'Was kostet der Postversand eines Briefs?',
    a: 'Im Kaempfer-Tarif ist 1 Postversand pro Monat inklusive, im Vollschutz sind es 3. Darueber hinaus kostet ein Standardversand 6 Credits, ein Einschreiben 10 Credits. Du kannst Credits jederzeit als Paket nachkaufen.',
  },
  {
    q: 'Was bringt mir die Jahresabrechnung?',
    a: 'Bei jaehrlicher Zahlung sparst du je nach Tarif bis zu 17% gegenueber der monatlichen Abrechnung. Du zahlst einmal und hast 12 Monate Ruhe \u2013 inklusive aller monatlichen Credit-Guthaben.',
  },
  {
    q: 'Was ist die MieterApp und wie haengt sie zusammen?',
    a: 'Die Fintutto MieterApp hilft bei Problemen rund um Miete, Nebenkostenabrechnung und Kosten der Unterkunft (KdU). Ab dem Kaempfer-Tarif ist sie in der Basic-Version inklusive, im Vollschutz sogar als Premium \u2013 ohne zusaetzliche Kosten.',
  },
  {
    q: 'Funktioniert BescheidBoxer auch fuer ALG I und Sozialhilfe?',
    a: 'Ja! Unser KI-Berater kennt SGB II (Buergergeld), SGB III (ALG I), SGB XII (Sozialhilfe) und SGB X (Verwaltungsrecht). Die Musterschreiben und Bescheid-Scans decken alle relevanten Bereiche ab.',
  },
]

type BillingInterval = 'monthly' | 'yearly'

export default function PricingPage() {
  useDocumentTitle('Preise - BescheidBoxer')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null)
  const [loadingPack, setLoadingPack] = useState<number | null>(null)
  const [interval, setInterval] = useState<BillingInterval>('monthly')

  const handlePlanClick = async (planKey: PlanType) => {
    if (planKey === 'schnupperer') {
      navigate(user ? '/dashboard' : '/register')
      return
    }

    const plan = PLANS[planKey]
    const priceId =
      interval === 'yearly' ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly
    if (!priceId) {
      toast.error('Dieser Plan ist aktuell nicht buchbar. Bitte kontaktiere den Support.')
      return
    }

    try {
      setLoadingPlan(planKey)
      await startCheckout({
        planId: planKey as 'starter' | 'kaempfer' | 'vollschutz',
        interval,
        priceId,
        user,
        navigate,
      })
    } catch (err) {
      console.error('Checkout fehlgeschlagen:', err)
      toast.error(
        err instanceof Error
          ? err.message
          : 'Checkout konnte nicht gestartet werden.',
      )
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleCreditPackClick = async (pkg: (typeof CREDIT_PACKAGES)[number]) => {
    if (!user) {
      navigate('/login?next=/preise')
      return
    }
    if (!pkg.stripePriceId) {
      toast.error('Dieses Paket ist aktuell nicht buchbar.')
      return
    }

    try {
      setLoadingPack(pkg.credits)
      const res = await fetch('/api/amt-credit-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: pkg.stripePriceId,
          userId: user.id,
          userEmail: user.email,
          creditsAmount: pkg.credits,
        }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(
          payload?.error ||
            `Credit-Checkout konnte nicht gestartet werden (HTTP ${res.status}).`,
        )
      }

      const { url } = (await res.json()) as { url?: string }
      if (!url) throw new Error('Keine Checkout-URL von Stripe erhalten.')
      window.location.href = url
    } catch (err) {
      console.error('Credit-Checkout fehlgeschlagen:', err)
      toast.error(
        err instanceof Error
          ? err.message
          : 'Credit-Checkout konnte nicht gestartet werden.',
      )
    } finally {
      setLoadingPack(null)
    }
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-boxer text-white mx-auto mb-4">
          <Swords className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Faire Preise fuer faire Rechte
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Starte kostenlos mit dem Schnupperer-Tarif und upgrade, wenn du mehr brauchst.
          Keine versteckten Kosten, jederzeit kuendbar.
        </p>
      </div>

      {/* Trial Banner */}
      <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 border border-red-200 dark:border-red-800 text-center">
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">
          Neu: 14 Tage kostenlos den Kaempfer-Plan testen!
        </p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Unbegrenzte Scans, unbegrenzter Chat, 3 Schreiben - ohne Risiko.
          Jederzeit kuendbar.
        </p>
      </div>

      {/* Monthly / Yearly Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center p-1 rounded-full border bg-muted/40">
          <button
            type="button"
            onClick={() => setInterval('monthly')}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              interval === 'monthly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Monatlich
          </button>
          <button
            type="button"
            onClick={() => setInterval('yearly')}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              interval === 'yearly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Jaehrlich
            <span className="ml-2 text-xs text-green-600 font-semibold">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
        {(Object.entries(PLANS) as [PlanType, (typeof PLANS)[PlanType]][]).map(
          ([key, plan]) => {
            const meta = planMeta[key]
            const isHighlighted = key === 'kaempfer'

            return (
              <Card
                key={key}
                className={`relative flex flex-col ${
                  isHighlighted
                    ? 'ring-2 ring-red-500 shadow-lg scale-[1.03]'
                    : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge
                      variant="secondary"
                      className={`border-0 px-4 py-0.5 text-white ${
                        key === 'kaempfer'
                          ? 'gradient-boxer'
                          : 'bg-amber-500'
                      }`}
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white mx-auto mb-3 ${
                      isHighlighted ? 'gradient-boxer' : 'gradient-amt'
                    }`}
                  >
                    <meta.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-3">
                    {plan.price === 0 ? (
                      <>
                        <span className="text-4xl font-extrabold">0</span>
                        <span className="text-muted-foreground"> EUR</span>
                      </>
                    ) : interval === 'yearly' && plan.priceYearly > 0 ? (
                      <>
                        <span className="text-4xl font-extrabold">
                          {plan.priceYearly.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-muted-foreground"> EUR/Jahr</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-extrabold">
                          {plan.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-muted-foreground"> EUR/Mo</span>
                      </>
                    )}
                  </div>
                  {plan.priceYearly > 0 && interval === 'monthly' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      oder{' '}
                      {plan.priceYearly.toFixed(2).replace('.', ',')}{' '}
                      EUR/Jahr (spare{' '}
                      {Math.round(
                        (1 - plan.priceYearly / (plan.price * 12)) * 100
                      )}
                      %)
                    </p>
                  )}
                  {plan.priceYearly > 0 && interval === 'yearly' && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      entspricht{' '}
                      {(plan.priceYearly / 12).toFixed(2).replace('.', ',')}{' '}
                      EUR/Mo
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-4 flex flex-col flex-1">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {meta.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            isHighlighted
                              ? 'text-red-500'
                              : 'text-primary'
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      isHighlighted ? 'gradient-boxer text-white hover:opacity-90' : ''
                    }`}
                    variant={
                      isHighlighted
                        ? 'default'
                        : key === 'vollschutz'
                          ? 'default'
                          : key === 'starter'
                            ? 'default'
                            : 'outline'
                    }
                    size="lg"
                    disabled={loadingPlan === key}
                    onClick={() => handlePlanClick(key)}
                  >
                    {loadingPlan === key ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Moment...
                      </>
                    ) : (
                      meta.cta
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          }
        )}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          Alle Tarife im Vergleich
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Feature</th>
                <th className="text-center py-3 px-4 font-medium">
                  Schnupperer
                </th>
                <th className="text-center py-3 px-4 font-medium">
                  Starter
                </th>
                <th className="text-center py-3 px-4 font-medium text-red-600">
                  Kaempfer
                </th>
                <th className="text-center py-3 px-4 font-medium text-amber-600">
                  Vollschutz
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ['KI-Nachrichten/Tag', '5', '10', 'Unbegrenzt', 'Unbegrenzt'],
                ['Schreiben/Monat', '\u2013', '1', '3', 'Unbegrenzt'],
                ['Bescheid-Scans', '2/Monat', '3/Monat', 'Unbegrenzt', 'Unbegrenzt'],
                ['Credits/Monat', '\u2013', '10', '25', '50'],
                ['Forum-Zugang', 'Lesen & Posten', 'Lesen, Posten & Chat (limitiert)', 'Voll', 'VIP'],
                ['Postversand inkl.', '\u2013', '\u2013', '1/Monat', '3/Monat'],
                ['MieterApp', '\u2013', '\u2013', 'Basic', 'Premium'],
                ['Priority-Support', '\u2013', '\u2013', '\u2713', '\u2713'],
              ].map(([feature, schnupperer, starter, kaempfer, vollschutz]) => (
                <tr
                  key={feature}
                  className="border-b border-border/50"
                >
                  <td className="py-3 px-4 font-medium">{feature}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">
                    {schnupperer}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {starter}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-red-600">
                    {kaempfer}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-amber-600">
                    {vollschutz}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-amt text-white mx-auto mb-3">
            <CreditCard className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Credits nachkaufen</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Brauchst du mehr Credits als dein Tarif bietet? Kauf einfach ein Paket dazu.
            Credits sind sofort verfuegbar und gelten bis Monatsende.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card
              key={pkg.credits}
              className="relative text-center hover:shadow-md transition-shadow"
            >
              {pkg.discount && (
                <div className="absolute -top-2.5 right-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-600 text-white border-0 px-3"
                  >
                    -{pkg.discount}
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <p className="text-3xl font-extrabold mb-1">
                  {pkg.credits}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Credits
                </p>
                <p className="text-2xl font-bold mb-1">
                  {pkg.price.toFixed(2).replace('.', ',')} EUR
                </p>
                <p className="text-xs text-muted-foreground mb-5">
                  {(pkg.price / pkg.credits).toFixed(2).replace('.', ',')} EUR pro Credit
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={loadingPack === pkg.credits}
                  onClick={() => handleCreditPackClick(pkg)}
                >
                  {loadingPack === pkg.credits ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Moment...
                    </>
                  ) : (
                    'Credits kaufen'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cross-sell MieterApp */}
      <div className="max-w-4xl mx-auto mb-20">
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-16 gradient-amt flex items-center justify-center py-4 md:py-0">
              <Home className="h-8 w-8 text-white" />
            </div>
            <CardContent className="p-6 flex-1">
              <h3 className="text-lg font-bold mb-2">
                Probleme mit Miete oder KdU? Die MieterApp hilft.
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Im <strong>Kaempfer</strong>-Tarif ist die MieterApp Basic inklusive, im{' '}
                <strong>Vollschutz</strong> sogar Premium. Pruefe deine Miethoehe, Nebenkosten
                und ob das Jobcenter deine Kosten der Unterkunft korrekt berechnet &ndash;
                alles in einer App.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/probleme/kdu">
                  Mehr zur MieterApp
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Haeufige Fragen zu Preisen &amp; Credits
        </h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <Card key={item.q}>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2 flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {item.q}
                </h3>
                <p className="text-sm text-muted-foreground ml-6">
                  {item.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
