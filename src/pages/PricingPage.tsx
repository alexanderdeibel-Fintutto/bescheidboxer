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
  Loader2,
  FileText,
  Users,
  Mail,
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
  { icon: typeof Shield; features: string[]; comingSoon?: string[]; cta: string }
> = {
  schnupperer: {
    icon: Shield,
    features: [
      '5 KI-Nachrichten pro Tag',
      '2 Bescheid-Scans pro Monat',
      'Alle 14 Musterschreiben einsehbar',
      'Forum lesen & posten',
    ],
    cta: 'Kostenlos starten',
  },
  starter: {
    icon: Zap,
    features: [
      '25 KI-Nachrichten pro Tag',
      '5 Bescheid-Scans pro Monat',
      '1 personalisiertes Schreiben/Monat',
      'Alle 14 Musterschreiben + Generator',
      '§ 44 SGB X — alte Bescheide rückwirkend prüfen',
      '10 Credits monatlich inklusive',
    ],
    cta: 'Starter wählen',
  },
  kaempfer: {
    icon: Swords,
    features: [
      'Unbegrenzte KI-Nachrichten',
      'Unbegrenzte Bescheid-Scans',
      'Unbegrenzte personalisierte Schreiben',
      'KI-Tiefenanalyse jeder Position',
      '50 Credits monatlich inklusive',
      'Voller Forum-Zugang',
      'Priority-Support',
    ],
    cta: 'Profi wählen',
  },
  vollschutz: {
    icon: Crown,
    features: [
      'Alles aus Profi',
      '150 Credits monatlich inklusive',
      'VIP-Forum',
      'Frühzugang zu Beta-Features',
    ],
    comingSoon: [
      'Einschreiben-Versand (geplant Q3 2026)',
      'Anwalt-Hotline 15 Min/Mo (geplant Q3 2026)',
      'Cloud-Archiv für deine Bescheide',
    ],
    cta: 'Premium wählen',
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
    q: 'Was bedeutet § 44 SGB X — alte Bescheide rückwirkend prüfen?',
    a: 'Auch wenn die 1-Monats-Widerspruchsfrist verpasst wurde: Der Überprüfungsantrag nach § 44 SGB X erlaubt es, Bescheide bis zu 4 Jahre rückwirkend nochmal prüfen zu lassen. Wir helfen dir Scan + KI-Analyse + fertige Antrags-Vorlage. In jedem bezahlten Tarif inklusive — eigene Detail-Page unter /ueberpruefungsantrag.',
  },
  {
    q: 'Was ist der Einmal-Kauf "Widerspruch-Paket"?',
    a: 'Wenn du keinen Abo-Kunden werden willst, sondern nur EINEN Widerspruch brauchst: 19,99 € einmalig — du bekommst 1 BescheidScan, 1 personalisiertes Schreiben und Frist-Tracker. Ohne monatliche Bindung. Wenn du später doch noch mehr Bescheide hast, kannst du jederzeit ins Abo wechseln.',
  },
  {
    q: 'Was sind die "Coming Soon"-Features im Premium-Tarif?',
    a: 'Wir kommunizieren ehrlich: Einschreiben-Versand und Anwalt-Hotline sind geplant für Q3 2026, aber heute noch nicht verfügbar. Mit Premium sicherst du dir den Frühzugang ohne Aufpreis sobald sie live sind. Cloud-Archiv kommt parallel. Wer kein Frühzugang braucht, ist mit Profi besser bedient.',
  },
  {
    q: 'Was bringt mir die Jahresabrechnung?',
    a: 'Bei jährlicher Zahlung sparst du je nach Tarif 28-31 % gegenüber der monatlichen Abrechnung — Profi z.B. 129 € statt 12 × 14,99 € = 179,88 €. Du zahlst einmal und hast 12 Monate Ruhe.',
  },
  {
    q: 'Funktioniert BescheidBoxer auch für ALG I und Sozialhilfe?',
    a: 'Ja. Unser KI-Berater kennt SGB II (Bürgergeld), SGB III (ALG I), SGB XII (Sozialhilfe) und SGB X (Verwaltungsrecht). Die 14 Musterschreiben und Bescheid-Scans decken alle relevanten Bereiche ab.',
  },
  {
    q: 'Habt ihr ein Angebot für Sozialverbände oder Beratungsstellen?',
    a: 'Ja — schreib uns an hello@bescheidboxer.de mit Stichwort "B2B Sozialverband". Wir machen Konditionen für Mehr-User-Accounts inkl. Reporting und optional White-Label.',
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
          {/* § 44 SGB X USP-Banner — der Killer-Differenzierer */}
          <FadeSection className="max-w-2xl mx-auto mb-8">
            <div className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 p-5 text-center shadow-sm">
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                ⭐ Auch alte Bescheide können noch Geld bringen — bis zu 4 Jahre rückwirkend
              </p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                § 44 SGB X Überprüfungsantrag — in jedem bezahlten Tarif.{' '}
                <Link to="/ueberpruefungsantrag" className="underline hover:no-underline font-medium">
                  Mehr erfahren →
                </Link>
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
                        <ul className="space-y-2.5 mb-4 flex-1">
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
                        {/* Coming-Soon-Block — zeigt geplante Features ehrlich
                            als "kommend" statt sie als jetzt-verfügbar zu verkaufen */}
                        {meta.comingSoon && meta.comingSoon.length > 0 && (
                          <div className="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-amber-800 dark:text-amber-200 mb-2">
                              Frühzugang zu kommenden Features:
                            </p>
                            <ul className="space-y-1">
                              {meta.comingSoon.map((feature) => (
                                <li
                                  key={feature}
                                  className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed"
                                >
                                  • {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
              monatlichen und jährlichen Tarif-Preise (Starter, Profi,
              Premium) für die gesamte Laufzeit deines aktiven Abos. Bei
              Kündigung erlischt der Rabatt; eine erneute Aktivierung ist
              ausgeschlossen. Gilt nicht auf den Einmal-Kauf, Credit-Pakete
              und Postversand. Während der Beta-Phase verfügbar; danach
              prüfen wir das Angebot für Neuanmeldungen neu.
            </p>
          </FadeSection>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* EINMAL-KAUF — für User die kein Abo wollen                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <FadeSection className="mt-16 max-w-3xl mx-auto">
            <Card className="rounded-2xl border-2 border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl gradient-amt text-white flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                      Ohne Abo · Einmalige Zahlung
                    </p>
                    <h3 className="text-xl font-bold mb-1">Widerspruch-Paket Einzelfall</h3>
                    <p className="text-sm text-muted-foreground">
                      Du hast nur diesen einen Bescheid? Hier ist der direkte Weg —
                      ohne Abo-Bindung, einmal zahlen, alles dabei.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-extrabold">19,99&nbsp;€</p>
                    <p className="text-xs text-muted-foreground">einmalig</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 mb-5 pl-16">
                  {[
                    '1 BescheidScan mit KI-Analyse',
                    '1 personalisiertes Widerspruchs-Schreiben',
                    'Frist-Tracker bis zur Erledigung',
                    'Alle 14 Musterschreiben einsehbar',
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pl-16">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full"
                    asChild
                  >
                    <Link to={user ? '/scan' : '/register?next=/scan'}>
                      Einzel-Widerspruch starten
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  Profi
                </th>
                <th className="text-center py-4 px-4 font-semibold text-amber-600">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ['KI-Nachrichten/Tag', '5', '25', 'Unbegrenzt', 'Unbegrenzt'],
                ['Schreiben/Monat', '—', '1', 'Unbegrenzt', 'Unbegrenzt'],
                ['Bescheid-Scans', '2/Monat', '5/Monat', 'Unbegrenzt', 'Unbegrenzt'],
                ['Credits/Monat', '—', '10', '50', '150'],
                ['§ 44 SGB X — alte Bescheide', '—', '✓', '✓', '✓'],
                ['Alle 14 Vorlagen', 'Lesbar', '+ Generator', '+ Generator', '+ Generator'],
                ['KI-Tiefenanalyse', '—', '—', '✓', '✓'],
                [
                  'Forum-Zugang',
                  'Lesen & Posten',
                  'Lesen, Posten & Chat (limit.)',
                  'Voll',
                  'VIP',
                ],
                ['Priority-Support', '—', '—', '✓', '✓'],
                ['Einschreiben-Versand', '—', '—', '—', 'Frühzugang Q3 2026'],
                ['Anwalt-Hotline 15 Min/Mo', '—', '—', '—', 'Frühzugang Q3 2026'],
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
      {/* 5. B2B FÜR SOZIALVERBÄNDE & BERATUNGSSTELLEN                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <FadeSection className="max-w-4xl mx-auto">
          <Card className="overflow-hidden rounded-2xl border-2 border-purple-200 dark:border-purple-900">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-20 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center py-5 sm:py-0">
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardContent className="p-7 flex-1">
                <p className="text-xs uppercase tracking-wider font-semibold text-purple-700 dark:text-purple-300 mb-1">
                  Für Sozialverbände, Beratungsstellen, Selbsthilfegruppen
                </p>
                <h3 className={`${TYPE.h3} mb-2`}>
                  BescheidBoxer für <GradientText>dein Team</GradientText>.
                </h3>
                <p className="text-muted-foreground mb-5">
                  Mehrere Berater-Accounts, Reporting, optional White-Label.
                  Konditionen für VdK, SoVD, AWO, Caritas, Diakonie und ähnliche
                  Träger — auf Anfrage individuell zugeschnitten.
                </p>
                <Button variant="outline" className="rounded-full" asChild>
                  <a href="mailto:hello@bescheidboxer.de?subject=Anfrage%20B2B-Tarif%20Sozialverband">
                    <Mail className="mr-2 h-4 w-4" />
                    Anfragen an hello@bescheidboxer.de
                  </a>
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
