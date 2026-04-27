import { Link } from 'react-router-dom'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import {
  ScanSearch,
  MessageCircle,
  FileText,
  Users,
  Swords,
  Clock,
  Calculator,
  Shield,
  ExternalLink,
  ClipboardList,
  AlertTriangle,
  Phone,
  Briefcase,
  GraduationCap,
  Scale,
  CheckCircle2,
  Lock,
  Heart,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COMMON_PROBLEMS } from '@/lib/sgb-knowledge'
import { PLANS, type PlanConfig } from '@/lib/credits'
import {
  PageHero,
  SectionWrapper,
  SectionHeader,
  FadeSection,
  GradientText,
  PrimaryButton,
  GhostButton,
  TrustPill,
  TYPE,
  SPACING,
} from '@/lib/fintutto-design'

const features = [
  {
    icon: ScanSearch,
    title: 'BescheidScan',
    description:
      'Foto rein, Fehler raus. Unsere KI kennt SGB II, III und XII — Regelsatz, Mehrbedarf, KdU. Nichts wird übersehen.',
    href: '/scan',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
  },
  {
    icon: MessageCircle,
    title: 'KI-Rechtsberater',
    description:
      'Frag in deinen Worten. Die KI antwortet wie ein Sozialberater — ohne Termin, ohne Wartezeit, rund um die Uhr.',
    href: '/chat',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: Calculator,
    title: '13 Rechner',
    description:
      'Bürgergeld, KdU, Mehrbedarf, Freibetrag, Sanktion, Schonvermögen, Fristen, PKH und mehr. Sofort die Zahl, die zählt.',
    href: '/rechner',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    icon: FileText,
    title: 'Dokumenten-Werkstatt',
    description:
      '20+ Vorlagen für Widersprüche, Anträge, Beschwerden. Personalisiert. Rechtskonform. Sofort als PDF.',
    href: '/musterschreiben',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: ClipboardList,
    title: 'Widerspruch-Tracker',
    description:
      'Alle Fristen, alle Stände, ein Blick. Mit automatischer Warnung — bevor das Amt schweigt.',
    href: '/tracker',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
  },
  {
    icon: Users,
    title: 'Community-Forum',
    description:
      'Hier kennt jeder das Amt. Tausch dich aus mit Menschen, die genau deinen Kampf schon gekämpft haben.',
    href: '/forum',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
]

const stats = [
  { value: '500.000+', label: 'Widersprüche/Jahr in DE' },
  { value: 'Jeder 2.', label: 'Bescheid fehlerhaft' },
  { value: '1/3', label: 'Widersprüche erfolgreich' },
  { value: '0 €', label: 'Einstieg' },
]

const PLAN_ORDER: Array<{ key: string; tierClass: string }> = [
  { key: 'schnupperer', tierClass: 'tier-free' },
  { key: 'starter', tierClass: 'tier-free' },
  { key: 'kaempfer', tierClass: 'tier-premium' },
  { key: 'vollschutz', tierClass: 'tier-plus' },
]

function formatPlanLimit(value: number, unit: string): string {
  if (value === -1) return `Unbegrenzt${unit ? ' ' + unit : ''}`
  if (value === 0) return `Keine ${unit}`
  return `${value} ${unit}`
}

export default function HomePage() {
  useDocumentTitle('Dein KI-Assistent gegen falsche Bescheide')

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO — Fintutto-Goldstandard                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <PageHero
        badge="Kämpfe für dein Recht"
        title="Dein Bescheid ist falsch?"
        titleGradient="Wir boxen ihn durch."
        subtitle="BescheidBoxer scannt deinen Bescheid mit KI, findet jeden Fehler und schreibt dir den passenden Widerspruch. Blitzschnell. Verständlich. Rechtssicher."
        primaryCta={{
          label: 'Bescheid jetzt scannen',
          to: '/scan',
          icon: <ScanSearch className="w-5 h-5" />,
        }}
        secondaryCta={{
          label: 'KI-Berater fragen',
          to: '/chat',
          icon: <MessageCircle className="w-5 h-5" />,
        }}
        hint="2 kostenlose Scans · 5 Fragen/Tag · Kein Account nötig"
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. STATS BAR — Industrie-Zahlen, ehrlich                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="border-y border-border bg-muted/30">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <FadeSection
                key={stat.label}
                delay={i * 80}
                className="text-center"
              >
                <div className={`${TYPE.stat} gradient-text-boxer`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1.5 uppercase tracking-wider">
                  {stat.label}
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. BETA-PIONIER-KARTE                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className={`${SPACING.sectionX} py-14 sm:py-20`}>
        <div className="max-w-3xl mx-auto">
          <FadeSection>
            <div className="relative rounded-3xl border-2 border-orange-300 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-orange-950/30 p-7 sm:p-10 shadow-xl shadow-orange-100/50 dark:shadow-none">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-boxer text-white flex-shrink-0 shadow-lg shadow-red-500/20">
                  <Swords className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-xs uppercase tracking-[0.3em] font-semibold text-orange-700 dark:text-orange-300 mb-2">
                    Beta-Phase · Pionier-Tarif
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
                    Werde Pionier — <GradientText>50&nbsp;% lebenslang.</GradientText>
                  </h3>
                  <p className="text-muted-foreground mb-5">
                    BescheidBoxer ist neu. Hilf uns, die KI besser zu machen,
                    den Boxer stärker — und zahle dafür{' '}
                    <strong className="text-foreground">die Hälfte. Für immer.</strong>
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 bg-background border-2 border-dashed border-orange-400 rounded-lg px-4 py-2.5 font-mono text-base font-bold text-orange-700 dark:text-orange-300">
                      PIONIER50
                    </div>
                    <PrimaryButton to="/preise">Plan wählen</PrimaryButton>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Code an der Kasse einlösen · Gilt für alle bezahlten Pläne · Solange die Beta läuft
                  </p>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. FEATURES — Sechs Waffen                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <SectionHeader
          badge="Dein Arsenal"
          title="Sechs Waffen."
          titleGradient="Ein Ziel: Gerechtigkeit."
          subtitle="Von der Analyse bis zum fertigen Widerspruch — alles, was du brauchst, um dich gegen das Amt zu wehren."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FadeSection key={feature.title} delay={i * 80}>
              <Link to={feature.href} className="block h-full group">
                <Card className="h-full rounded-2xl border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-5 inline-flex items-center text-primary font-semibold text-sm gap-1.5 group-hover:gap-2.5 transition-all">
                      Loslegen
                      <span aria-hidden>→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. PROBLEM FINDER                                            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="Direkt zur Lösung"
          title="Welches Problem hast du?"
          subtitle="Wähle dein Anliegen — wir zeigen dir sofort die passenden Musterschreiben und Tipps."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMON_PROBLEMS.map((problem, i) => (
            <FadeSection key={problem.id} delay={i * 50}>
              <Link
                to={`/musterschreiben?problem=${problem.id}`}
                className="block h-full group"
              >
                <Card className="h-full rounded-2xl hover:border-primary/40 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-5">
                    <Badge
                      variant={
                        problem.category as
                          | 'sgb2'
                          | 'sgb3'
                          | 'sgb12'
                          | 'kdu'
                      }
                      className="mb-3"
                    >
                      {problem.category === 'sgb2'
                        ? 'SGB II'
                        : problem.category === 'sgb3'
                        ? 'SGB III'
                        : problem.category === 'kdu'
                        ? 'KdU'
                        : problem.category === 'sgb10'
                        ? 'Verwaltung'
                        : 'SGB XII'}
                    </Badge>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. HOW IT WORKS                                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <SectionHeader
          badge="So einfach geht's"
          title="In 3 Runden"
          titleGradient="zum Widerspruch."
          subtitle="Schneller als jeder Anwaltstermin. Einfacher als jedes Amt."
        />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: '1',
              icon: ScanSearch,
              title: 'Scannen',
              description:
                'Foto oder PDF hoch. Die KI liest jeden Buchstaben — auch zwischen den Zeilen.',
            },
            {
              step: '2',
              icon: Swords,
              title: 'Analysieren',
              description:
                'Regelsatz. Mehrbedarf. KdU. Sanktionen. Wir zeigen jeden Fehler — mit dem passenden Paragraphen.',
            },
            {
              step: '3',
              icon: FileText,
              title: 'Boxen',
              description:
                'Fertiger Widerspruch. Personalisiert. Rechtssicher. Direkt zum Versand.',
            },
          ].map((item, i) => (
            <FadeSection key={item.step} delay={i * 120}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-boxer text-white text-2xl font-extrabold mb-5 shadow-lg shadow-red-500/20">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted mb-4">
                  <item.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
        <FadeSection delay={400} className="text-center mt-14">
          <PrimaryButton to="/scan">
            <ScanSearch className="w-5 h-5" />
            Jetzt Bescheid scannen — kostenlos
          </PrimaryButton>
        </FadeSection>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. PRICING PREVIEW                                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="Transparenz · Fair"
          title="Faire Preise."
          titleGradient="Ein Plan für jeden Kampf."
          subtitle="Starte kostenlos. Upgrade wenn du mehr Power brauchst. Jederzeit kündbar."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {PLAN_ORDER.map(({ key, tierClass }, i) => {
            const plan = PLANS[key as keyof typeof PLANS] as PlanConfig
            if (!plan) return null
            const isPopular = key === 'kaempfer'

            return (
              <FadeSection key={key} delay={i * 80}>
                <Card className={`relative h-full rounded-2xl ${tierClass}`}>
                  <CardContent className="p-6">
                    {plan.badge && (
                      <Badge
                        className={`absolute -top-2.5 right-4 ${
                          key === 'kaempfer'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}
                      >
                        {plan.badge}
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-3xl font-extrabold">
                        {plan.price === 0
                          ? 'Gratis'
                          : `${plan.price.toFixed(2).replace('.', ',')} €`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground text-sm">
                          /Monat
                        </span>
                      )}
                    </div>

                    {plan.priceYearly > 0 && (
                      <p className="text-xs text-muted-foreground mb-3">
                        oder {plan.priceYearly.toFixed(2).replace('.', ',')} €/Jahr
                      </p>
                    )}

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>
                          {formatPlanLimit(
                            plan.bescheidScansPerMonth,
                            plan.bescheidScansPerMonth === 1
                              ? 'Scan/Monat'
                              : 'Scans/Monat'
                          )}
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>
                          {plan.chatMessagesPerDay === -1
                            ? 'Unbegrenzte Chat-Nachrichten'
                            : `${plan.chatMessagesPerDay} Nachrichten/Tag`}
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>
                          {plan.lettersPerMonth === -1
                            ? 'Unbegrenzte Schreiben'
                            : plan.lettersPerMonth === 0
                            ? 'Schreiben als Einzelkauf'
                            : `${plan.lettersPerMonth} Schreiben/Monat`}
                        </span>
                      </li>
                      {plan.postversandInklusive > 0 && (
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>
                            {plan.postversandInklusive} Postversand inklusive
                          </span>
                        </li>
                      )}
                      {plan.prioritySupport && (
                        <li className="flex items-start gap-2 text-sm">
                          <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Priority-Support</span>
                        </li>
                      )}
                      {plan.mieterAppInklusive && (
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>
                            Mieter-App{' '}
                            {plan.mieterAppInklusive === 'premium'
                              ? 'Premium'
                              : 'Basic'}{' '}
                            inklusive
                          </span>
                        </li>
                      )}
                    </ul>
                    <Button
                      className={`w-full rounded-full ${
                        isPopular
                          ? 'gradient-boxer text-white border-0 hover:opacity-90'
                          : ''
                      }`}
                      variant={
                        isPopular
                          ? undefined
                          : key === 'vollschutz'
                          ? 'amt'
                          : key === 'starter'
                          ? 'default'
                          : 'outline'
                      }
                      asChild
                    >
                      <Link to={key === 'schnupperer' ? '/scan' : '/preise'}>
                        {key === 'schnupperer' ? 'Kostenlos starten' : 'Plan wählen'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </FadeSection>
            )
          })}
        </div>
        <FadeSection className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Alle Preise inkl. MwSt. · Jederzeit kündbar ·{' '}
            <Link to="/preise" className="text-primary hover:underline font-medium">
              Alle Details vergleichen
            </Link>
          </p>
        </FadeSection>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 8. TRUST + PIONIER-CALL                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <FadeSection className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <TrustPill
            icon={<Lock className="h-4 w-4 text-emerald-600" />}
            color="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200"
          >
            DSGVO-konform
          </TrustPill>
          <TrustPill
            icon={<Shield className="h-4 w-4 text-blue-600" />}
            color="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200"
          >
            SSL-verschlüsselt
          </TrustPill>
          <TrustPill
            icon={<Clock className="h-4 w-4 text-orange-600" />}
            color="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900 text-orange-800 dark:text-orange-200"
          >
            Beta · seit April 2026
          </TrustPill>
          <TrustPill
            icon={<Sparkles className="h-4 w-4 text-purple-600" />}
            color="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-200"
          >
            Hosted in Deutschland
          </TrustPill>
        </FadeSection>

        <div className="max-w-3xl mx-auto text-center">
          <FadeSection>
            <h2 className={`${TYPE.h2} mb-5`}>
              Sei einer der ersten <GradientText>Boxer.</GradientText>
            </h2>
            <p className={`${TYPE.body} mb-10`}>
              Statt erfundener Zahlen sagen wir dir lieber die Wahrheit:{' '}
              <strong className="text-foreground">
                Wir bauen das hier gerade zusammen mit dir auf.
              </strong>
            </p>
          </FadeSection>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
            <FadeSection delay={100}>
              <Card className="h-full rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold">Was du bekommst</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Eine ehrliche KI, die jeden Bescheid prüft, alle Rechner,
                    Vorlagen und 50 % Pionier-Rabatt für immer.
                  </p>
                </CardContent>
              </Card>
            </FadeSection>
            <FadeSection delay={200}>
              <Card className="h-full rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Swords className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold">Was wir uns wünschen</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dein Feedback. Sag uns, wo der Boxer noch zu schwach ist —
                    wir machen ihn stärker. Im Forum, per Mail, direkt im Chat.
                  </p>
                </CardContent>
              </Card>
            </FadeSection>
          </div>
          <FadeSection delay={300} className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton to="/scan" showArrow={false}>
              <ScanSearch className="w-5 h-5" />
              Jetzt mitmachen — kostenlos starten
            </PrimaryButton>
            <GhostButton to="/forum" showArrow={false}>
              <Users className="w-5 h-5" />
              Zum Pionier-Forum
            </GhostButton>
          </FadeSection>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 9. ECOSYSTEM                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="FinTuttO-Ökosystem"
          title="BescheidBoxer ist nur"
          titleGradient="der Anfang."
          subtitle="Entdecke weitere FinTuttO-Tools, die dir im Alltag helfen."
        />
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            {
              title: 'KdU-Probleme?',
              tag: 'KdU',
              desc: 'Das Amt zahlt nicht die volle Miete? Der Mieter-Checker prüft, ob deine Miete angemessen ist — und schreibt dir den passenden Widerspruch.',
              link: 'https://mieter.fintutto.cloud',
              cta: 'Zum Mieter-Checker',
            },
            {
              title: 'Vermieter-Bescheinigung?',
              tag: null,
              desc: 'Brauchst du eine Wohnungsgeberbescheinigung oder andere Vermieter-Dokumente? Das Vermieter-Portal hat alle Formulare.',
              link: 'https://vermieter.fintutto.cloud',
              cta: 'Zum Vermieter-Portal',
            },
          ].map((item, i) => (
            <FadeSection key={item.title} delay={i * 100}>
              <Card className="h-full rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg">
                    {item.title}
                    {item.tag && <Badge variant="kdu">{item.tag}</Badge>}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {item.desc}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all"
                  >
                    {item.cta}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 10. SIDE TOOLS — Notfall, Bewerbungen, Lernen, Anwalt        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: AlertTriangle,
              title: 'Notfall-Hilfe',
              desc: 'Strom abgestellt? Kündigung erhalten? Kein Geld für Essen? Sofort-Hilfe, kostenlose Hotlines, konkrete Schritte.',
              link: '/notfall',
              cta: 'Notfall-Hilfe',
              btnIcon: Phone,
              bg: 'bg-red-50 dark:bg-red-950/30',
              border: 'border-red-200 dark:border-red-900',
              titleColor: 'text-red-900 dark:text-red-100',
              textColor: 'text-red-800 dark:text-red-200',
              btnColor: 'bg-red-600 hover:bg-red-700 text-white',
              iconBg: 'bg-red-100 dark:bg-red-950',
              iconColor: 'text-red-600',
            },
            {
              icon: Briefcase,
              title: 'Bewerbungs-Tracker',
              desc: 'Dokumentiere deine Eigenbemühungen für die Eingliederungsvereinbarung. Behalte den Überblick über alle Bewerbungen und Fristen.',
              link: '/bewerbungen',
              cta: 'Bewerbungen verwalten',
              btnIcon: Briefcase,
              bg: 'bg-purple-50 dark:bg-purple-950/30',
              border: 'border-purple-200 dark:border-purple-900',
              titleColor: 'text-purple-900 dark:text-purple-100',
              textColor: 'text-purple-800 dark:text-purple-200',
              btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
              iconBg: 'bg-purple-100 dark:bg-purple-950',
              iconColor: 'text-purple-600',
            },
            {
              icon: GraduationCap,
              title: 'Lernbereich',
              desc: 'Verstehe deine Rechte Schritt für Schritt. 8 Module zu Bürgergeld, Widerspruch, KdU, Sanktionen und mehr.',
              link: '/lernen',
              cta: 'Jetzt lernen',
              btnIcon: GraduationCap,
              bg: 'bg-teal-50 dark:bg-teal-950/30',
              border: 'border-teal-200 dark:border-teal-900',
              titleColor: 'text-teal-900 dark:text-teal-100',
              textColor: 'text-teal-800 dark:text-teal-200',
              btnColor: 'bg-teal-600 hover:bg-teal-700 text-white',
              iconBg: 'bg-teal-100 dark:bg-teal-950',
              iconColor: 'text-teal-600',
            },
            {
              icon: Scale,
              title: 'Anwaltssuche',
              desc: 'Finde Fachanwälte für Sozialrecht in deiner Nähe. Filtere nach PKH, kostenloser Erstberatung und Fachgebiet.',
              link: '/anwaltssuche',
              cta: 'Anwalt finden',
              btnIcon: Scale,
              bg: 'bg-blue-50 dark:bg-blue-950/30',
              border: 'border-blue-200 dark:border-blue-900',
              titleColor: 'text-blue-900 dark:text-blue-100',
              textColor: 'text-blue-800 dark:text-blue-200',
              btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
              iconBg: 'bg-blue-100 dark:bg-blue-950',
              iconColor: 'text-blue-600',
            },
          ].map((item, i) => (
            <FadeSection key={item.title} delay={i * 80}>
              <div
                className={`${item.bg} border-2 ${item.border} rounded-2xl p-6 flex flex-col h-full`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${item.iconBg}`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${item.titleColor}`}>
                    {item.title}
                  </h3>
                </div>
                <p className={`text-sm ${item.textColor} mb-4 flex-1`}>
                  {item.desc}
                </p>
                <Button asChild className={`${item.btnColor} rounded-full w-fit`}>
                  <Link to={item.link}>
                    <item.btnIcon className="h-4 w-4 mr-2" />
                    {item.cta}
                  </Link>
                </Button>
              </div>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 11. URGENCY CTA — dunkler Final-Block                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="gradient-amt text-white py-20 sm:py-24">
        <div className="container">
          <FadeSection className="max-w-3xl mx-auto text-center">
            <Clock className="h-12 w-12 mx-auto mb-5 opacity-80" />
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
              Widerspruchsfrist läuft.
            </h2>
            <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed">
              Du hast nur <strong>einen Monat</strong>. Starte jetzt — BescheidBoxer
              findet Fehler in Minuten, nicht in Wochen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/scan"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold bg-white text-red-700 hover:bg-white/95 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-xl"
              >
                <ScanSearch className="w-5 h-5" />
                Bescheid jetzt scannen
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold bg-white/15 text-white border-2 border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              >
                <MessageCircle className="w-5 h-5" />
                Kostenlos Frage stellen
              </Link>
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  )
}
