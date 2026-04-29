import { Link } from 'react-router-dom'
import {
  Mail,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import {
  PageHero,
  SectionWrapper,
  SectionHeader,
  FadeSection,
} from '@/lib/fintutto-design'

const QUICK_HELP = [
  {
    icon: MessageCircle,
    title: 'KI-Sozialrecht-Assistent',
    desc: 'Sofort Antworten auf deine Fragen — rund um die Uhr.',
    href: '/chat',
    cta: 'Zum Chat',
    primary: true,
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    desc: 'Antworten auf die häufigsten Fragen.',
    href: '/faq',
    cta: 'Zur FAQ',
  },
  {
    icon: Shield,
    title: 'BescheidScan',
    desc: 'Bescheid hochladen, KI prüft automatisch.',
    href: '/scan',
    cta: 'Zum Scan',
  },
]

const BERATUNGSSTELLEN = [
  {
    name: 'VdK (Sozialverband VdK Deutschland)',
    desc: 'Kostenlose Sozialrechtsberatung',
    url: 'https://www.vdk.de',
  },
  {
    name: 'SoVD (Sozialverband Deutschland)',
    desc: 'Beratung zu SGB-II-Ansprüchen',
    url: 'https://www.sovd.de',
  },
  {
    name: 'Caritas',
    desc: 'Allgemeine Sozialberatung',
    url: 'https://www.caritas.de',
  },
  {
    name: 'Diakonie',
    desc: 'Sozialberatung für Betroffene',
    url: 'https://www.diakonie.de',
  },
  {
    name: 'Pro Bono Anwälte',
    desc: 'Kostenlose Rechtsberatung',
    url: 'https://www.anwaltauskunft.de',
  },
]

export default function KontaktPage() {
  useDocumentTitle('Kontakt & Hilfe')

  return (
    <div>
      {/* HERO */}
      <PageHero
        badge="Kontakt & Hilfe"
        title="Du hast eine Frage?"
        titleGradient="Wir helfen dir weiter."
        subtitle="Drei Wege zu sofortiger Hilfe — und eine Liste kostenloser Beratungsstellen."
        ambientGlow={false}
      />

      {/* QUICK HELP */}
      <SectionWrapper>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {QUICK_HELP.map((item, i) => (
            <FadeSection key={item.title} delay={i * 80}>
              <Card className="h-full rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-boxer text-white mb-3 shadow-md shadow-red-500/20">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-5">{item.desc}</p>
                  <Button
                    asChild
                    variant={item.primary ? 'default' : 'outline'}
                    className={`w-full rounded-full ${item.primary ? 'gradient-boxer text-white border-0 hover:opacity-90' : ''}`}
                  >
                    <Link to={item.href}>
                      {item.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeSection>
          ))}
        </div>
      </SectionWrapper>

      {/* BERATUNGSSTELLEN */}
      <SectionWrapper bg="muted">
        <SectionHeader
          badge="Echte Menschen, kostenlos"
          title="Kostenlose"
          titleGradient="Beratungsstellen."
          subtitle="Diese Organisationen bieten kostenlose, professionelle Sozialrechtsberatung."
        />
        <FadeSection className="max-w-3xl mx-auto">
          <Card className="rounded-2xl">
            <CardContent className="p-6 sm:p-8 space-y-1">
              {BERATUNGSSTELLEN.map((b) => (
                <div
                  key={b.name}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-border last:border-0"
                >
                  <div>
                    <h3 className="font-semibold">{b.name}</h3>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
                  >
                    {b.url.replace('https://www.', '').replace('https://', '')}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeSection>
      </SectionWrapper>

      {/* KONTAKTDATEN */}
      <SectionWrapper>
        <SectionHeader
          badge="Direkt zu uns"
          title="Kontaktdaten"
          titleGradient="BescheidBoxer."
        />
        <FadeSection className="max-w-2xl mx-auto">
          <Card className="rounded-2xl">
            <CardContent className="p-6 sm:p-8 space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5">E-Mail</h3>
                  <a
                    href="mailto:support@bescheidboxer.de"
                    className="text-primary hover:underline"
                  >
                    support@bescheidboxer.de
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5">Anschrift</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Fintutto UG (haftungsbeschränkt) i.G.
                    <br />
                    Musterstraße 1
                    <br />
                    10115 Berlin
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5">Erreichbarkeit</h3>
                  <p className="text-muted-foreground text-sm">Mo–Fr 9:00–17:00 Uhr</p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  <strong>Bitte beachte:</strong> Wir bieten keine Rechtsberatung an.
                  Für individuelle Rechtsberatung wende dich an eine der Beratungsstellen
                  oben.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeSection>
      </SectionWrapper>

      {/* DISCLAIMER */}
      <section className="container py-8 pb-16">
        <FadeSection className="max-w-3xl mx-auto">
          <Card className="bg-muted/50 rounded-2xl border-dashed">
            <CardContent className="pt-6 pb-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Wichtiger Hinweis:</strong> BescheidBoxer ist ein KI-gestütztes
                Informationsangebot und ersetzt keine individuelle Rechtsberatung. Alle
                Angaben ohne Gewähr.
              </p>
            </CardContent>
          </Card>
        </FadeSection>
      </section>
    </div>
  )
}
