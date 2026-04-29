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
import {
  PageHero,
  SectionWrapper,
  SectionHeader,
  FadeSection,
  GradientText,
  TYPE,
  SPACING,
} from '@/lib/fintutto-design'

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
    cta: 'Starter wählen',
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
    cta: 'Kämpfer wählen',
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
    cta: 'Vollschutz wählen',
  },
}

const faqItems = [
  {
    q: 'Was sind Credits und wofür brauche ich sie?',
    a: 'Credits sind die Währung im BescheidBoxer. Du kannst sie für Detail-Analysen von Bescheiden, Postversand, personalisierte Schreiben und mehr einsetzen. Jeder Tarif enthält ein monatliches Credit-Guthaben — brauchst du mehr, kannst du jederzeit Pakete nachkaufen.',
  },
  {
    q: 'Was bedeutet "Bescheid-Scan" genau?',
    a: 'Mit dem Bescheid-Scan fotografierst oder lädst du deinen Bescheid hoch. Unsere KI prüft ihn automatisch auf Fehler, falsche Berechnungen und fehlende Positionen. Im Schnupperer-Tarif bekommst du 2 Scans pro Monat — ab Kämpfer sind Scans unbegrenzt.',
  },
  {
    q: 'Kann ich jederzeit kündigen oder den Tarif wechseln?',
    a: 'Ja. Monatlich kündbar. Upgrade ist sofort möglich, ein Downgrade wird zum nächsten Abrechnungszeitraum wirksam. Nicht verbrauchte Credits verfallen am Ende des Monats.',
  },
  {
    q: 'Ist die KI-Beratung eine echte Rechtsberatung?',
    a: 'Nein. BescheidBoxer bietet KI-gestützte Informationen basierend auf SGB II, III, X und XII. Es ersetzt keine anwaltliche Beratung. Bei komplexen Fällen empfehlen wir eine Beratung beim Sozialverband (VdK, SoVD) oder einem Fachanwalt.',
  },
  {
    q: 'Was kostet der Postversand eines Briefs?',
    a: 'Im Kämpfer-Tarif ist 1 Postversand pro Monat inklusive, im Vollschutz sind es 3. Darüber hinaus kostet ein Standardversand 6 Credits, ein Einschreiben 10 Credits. Du kannst Credits jederzeit als Paket nachkaufen.',
  },
  {
    q: 'Was bringt mir die Jahresabrechnung?',
    a: 'Bei jährlicher Zahlung sparst du je nach Tarif bis zu 17 % gegenüber der monatlichen Abrechnung. Du zahlst einmal und hast 12 Monate Ruhe — inklusive aller monatlichen Credit-Guthaben.',
  },
  {
    q: 'Was ist die MieterApp und wie hängt sie zusammen?',
    a: 'Die Fintutto MieterApp hilft bei Problemen rund um Miete, Nebenkostenabrechnung und Kosten der Unterkunft (KdU). Ab dem Kämpfer-Tarif ist sie in der Basic-Version inklusive, im Vollschutz sogar als Premium — ohne zusätzliche Kosten.',
  },
  {
    q: 'Funktioniert BescheidBoxer auch für ALG I und Sozialhilfe?',
    a: 'Ja. Unser KI-Berater kennt SGB II (Bürgergeld), SGB III (ALG I), SGB XII (Sozialhilfe) und SGB X (Verwaltungsrecht). Die Musterschreiben und Bescheid-Scans decken alle relevanten Bereiche ab.',
  },
]

type BillingInterval = 'monthly' | 'yearly'

export default function PricingPage() {
  useDocumentTitle('Preise — BescheidBoxer')
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
    <div>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO                                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <PageHero
        badge="Transparenz · Fair · Jederzeit kündbar"
        title="Faire Preise."
        titleGradient="Ein Plan für jeden Kampf."
        subtitle="Starte kostenlos. Upgrade wenn du mehr Power brauchst. Keine versteckten Kosten."
        ambientGlow={false}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. TRIAL BANNER + TOGGLE + PRICING CARDS                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className={`${SPACING.sectionX} pt-4 pb-20 sm:pb-24`}>
        <div className="max-w-6xl mx-auto">
          {/* Trial Banner */}
          <FadeSection className="max-w-2xl mx-auto mb-8">
            <div className="rounded-2xl border-2 border-orange-300 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-orange-950/30 p-5 text-center shadow-sm">
              <p className="text-sm font-bold text-orange-800 dark:text-orange-200">
                🥊 14 Tage kostenlos den Kämpfer-Plan testen
              </p>
              <p className="text-xs text-orange-700/80 dark:text-orange-300/80 mt-1">
                Unbegrenzte Scans · Unbegrenzter Chat · 3 Schreiben — ohne Risiko, jederzeit kündbar.
              </p>
            </div>
          </FadeSection>

          {/* Monthly / Yearly Toggle */}
          <FadeSection className="flex justify-center mb-10">
            <div className="inline-flex items-center p-1 rounded-full border bg-muted/40">
              <button
                type="button"
                onClick={() => setInterval('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
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
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  interval === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                Jährlich
                <span className="text-xs text-emerald-600 font-bold">-17 %</span>
              </button>
            </div>
          </FadeSection>

          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.entries(PLANS) as [PlanType, (typeof PLANS)[PlanType]][]).map(
              ([key, plan], i) => {
                const meta = planMeta[key]
                const isHighlighted = key === 'kaempfer'

                return (
                  <FadeSection key={key} delay={i * 80}>
                    <Card
                      className={`relative h-full flex flex-col rounded-2xl transition-all duration-300 ${
                        isHighlighted
                          ? 'ring-2 ring-red-500/60 shadow-xl shadow-red-500/10 scale-[1.02]'
                          : 'hover:-translate-y-1 hover:shadow-lg'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge
                            variant="secondary"
                            className={`border-0 px-4 py-0.5 text-white shadow-sm ${
                              key === 'kaempfer' ? 'gradient-boxer' : 'bg-amber-500'
                            }`}
                          >
                            {plan.badge}
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pb-2">
                        <div
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mx-auto mb-4 shadow-lg ${
                            isHighlighted
                              ? 'gradient-boxer shadow-red-500/20'
                              : 'gradient-amt shadow-emerald-500/20'
                          }`}
                        >
                          <meta.icon className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="mt-3">
                          {plan.price === 0 ? (
                            <>
                              <span className="text-4xl font-extrabold">0</span>
                              <span className="text-muted-foreground"> €</span>
                            </>
                          ) : interval === 'yearly' && plan.priceYearly > 0 ? (
                            <>
                              <span className="text-4xl font-extrabold">
                                {plan.priceYearly.toFixed(2).replace('.', ',')}
                              </span>
                              <span className="text-muted-foreground"> €/Jahr</span>
                            </>
                          ) : (
                            <>
                              <span className="text-4xl font-extrabold">
                                {plan.price.toFixed(2).replace('.', ',')}
                              </span>
                              <span className="text-muted-foreground"> €/Mo</span>
                            </>
                          )}
                        </div>
                        {plan.priceYearly > 0 && interval === 'monthly' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            oder {plan.priceYearly.toFixed(2).replace('.', ',')} €/Jahr
                            (spare{' '}
                            {Math.round(
                              (1 - plan.priceYearly / (plan.price * 12)) * 100,
                            )}
                            {' %'})
                          </p>
                        )}
                        {plan.priceYearly > 0 && interval === 'yearly' && (
                          <p className="text-xs text-emerald-600 mt-1 font-semibold">
                            entspricht{' '}
                            {(plan.priceYearly / 12).toFixed(2).replace('.', ',')} €/Mo
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
                                  isHighlighted ? 'text-red-500' : 'text-primary'
                                }`}
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full rounded-full ${
                            isHighlighted
                              ? 'gradient-boxer text-white hover:opacity-90'
                              : ''
                          }`}
                          variant={isHighlighted ? 'default' : 'outline'}
                          size="lg"
                          disabled={loadingPlan === key}
                          onClick={() => handlePlanClick(key)}
                        >
                          {loadingPlan === key ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Moment …
                            </>
                          ) : (
                            meta.cta
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </FadeSection>
                )
              },
            )}
          </div>

          {/* PIONIER50 Hinweis */}
          <FadeSection className="text-center mt-8 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              💡 Mit Code <strong className="text-foreground font-mono">PIONIER50</strong>{' '}
              sparst du <GradientText>50&nbsp;% lebenslang</GradientText> auf jeden bezahlten Plan
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed">
              <strong>Bedingungen PIONIER50:</strong> 50&nbsp;% Rabatt auf alle
              monatlichen und jährlichen Tarif-Preise (Starter, Kämpfer,
              Vollschutz) für die gesamte Laufzeit deines aktiven Abos. Bei
              Kündigung erlischt der Rabatt; eine erneute Aktivierung ist
              ausgeschlossen. Gilt nicht auf Credit-Pakete und Postversand.
              Während der Beta-Phase verfügbar; danach prüfen wir das Angebot
              für Neuanmeldungen neu.
            </p>
          </FadeSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. FEATURE COMPARISON TABLE                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="Feature-Vergleich"
          title="Alle Tarife"
          titleGradient="im Überblick."
        />
        <FadeSection className="overflow-x-auto rounded-2xl border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-5 font-semibold">Feature</th>
                <th className="text-center py-4 px-4 font-semibold">Schnupperer</th>
                <th className="text-center py-4 px-4 font-semibold">Starter</th>
                <th className="text-center py-4 px-4 font-semibold text-red-600">
                  Kämpfer
                </th>
                <th className="text-center py-4 px-4 font-semibold text-amber-600">
                  Vollschutz
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ['KI-Nachrichten/Tag', '5', '10', 'Unbegrenzt', 'Unbegrenzt'],
                ['Schreiben/Monat', '—', '1', '3', 'Unbegrenzt'],
                ['Bescheid-Scans', '2/Monat', '3/Monat', 'Unbegrenzt', 'Unbegrenzt'],
                ['Credits/Monat', '—', '10', '25', '50'],
                [
                  'Forum-Zugang',
                  'Lesen & Posten',
                  'Lesen, Posten & Chat (limitiert)',
                  'Voll',
                  'VIP',
                ],
                ['Postversand inkl.', '—', '—', '1/Monat', '3/Monat'],
                ['MieterApp', '—', '—', 'Basic', 'Premium'],
                ['Priority-Support', '—', '—', '✓', '✓'],
              ].map(([feature, schnupperer, starter, kaempfer, vollschutz]) => (
                <tr key={feature} className="border-b border-border/50 last:border-0">
                  <td className="py-3 px-5 font-medium">{feature}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">
                    {schnupperer}
                  </td>
                  <td className="py-3 px-4 text-center">{starter}</td>
                  <td className="py-3 px-4 text-center font-semibold text-red-600">
                    {kaempfer}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-amber-600">
                    {vollschutz}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeSection>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. CREDIT PACKAGES                                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <SectionHeader
          badge="Credits nachkaufen"
          title="Mehr Power?"
          titleGradient="Pakete dazu."
          subtitle="Brauchst du mehr Credits als dein Tarif bietet? Kauf einfach ein Paket dazu — sofort verfügbar, gilt bis Monatsende."
        />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {CREDIT_PACKAGES.map((pkg, i) => (
            <FadeSection key={pkg.credits} delay={i * 80}>
              <Card className="relative h-full text-center rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {pkg.discount && (
                  <div className="absolute -top-2.5 right-4 z-10">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-600 text-white border-0 px-3 shadow-sm"
                    >
                      −{pkg.discount}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-amt text-white mx-auto mb-3 shadow-md shadow-emerald-500/20">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <p className="text-3xl font-extrabold mb-1">{pkg.credits}</p>
                  <p className="text-sm text-muted-foreground mb-4">Credits</p>
                  <p className="text-2xl font-bold mb-1">
                    {pkg.price.toFixed(2).replace('.', ',')} €
                  </p>
                  <p className="text-xs text-muted-foreground mb-5">
                    {(pkg.price / pkg.credits).toFixed(2).replace('.', ',')} € pro Credit
                  </p>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    disabled={loadingPack === pkg.credits}
                    onClick={() => handleCreditPackClick(pkg)}
                  >
                    {loadingPack === pkg.credits ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Moment …
                      </>
                    ) : (
                      'Credits kaufen'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. CROSS-SELL MIETERAPP                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <FadeSection className="max-w-4xl mx-auto">
          <Card className="overflow-hidden rounded-2xl">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-20 gradient-amt flex items-center justify-center py-5 sm:py-0">
                <Home className="h-10 w-10 text-white" />
              </div>
              <CardContent className="p-7 flex-1">
                <h3 className={`${TYPE.h3} mb-2`}>
                  Probleme mit Miete oder KdU? Die <GradientText>MieterApp</GradientText> hilft.
                </h3>
                <p className="text-muted-foreground mb-5">
                  Im <strong>Kämpfer</strong>-Tarif ist die MieterApp Basic inklusive,
                  im <strong>Vollschutz</strong> sogar Premium. Prüfe deine Miethöhe,
                  Nebenkosten und ob das Jobcenter deine KdU korrekt berechnet — alles
                  in einer App.
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/probleme/kdu">
                    Mehr zur MieterApp
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        </FadeSection>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. FAQ                                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <SectionHeader
          badge="FAQ"
          title="Häufige Fragen"
          titleGradient="zu Preisen & Credits."
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, i) => (
            <FadeSection key={item.q} delay={i * 50}>
              <Card className="rounded-2xl hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 flex items-start gap-2.5">
                    <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    {item.q}
                  </h3>
                  <p className="text-sm text-muted-foreground ml-7 leading-relaxed">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>
    </div>
  )
}
