/**
 * BescheidBoxer Design-System (adaptiert aus translator-clean/apps/landing)
 *
 * Strukturell Fintutto-Goldstandard, visuell BescheidBoxer-Brand (gradient-boxer).
 * Alle wiederverwendbaren Komponenten + Tokens für die HomePage und folgende Pages.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════ */

/** Typografie-Skala — Fintutto-Goldstandard, Light-Theme-tauglich */
export const TYPE = {
  badge: 'text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold',
  h1: 'text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]',
  h2: 'text-3xl sm:text-5xl font-bold tracking-tight leading-tight',
  h2sm: 'text-2xl sm:text-4xl font-bold tracking-tight',
  h3: 'text-xl sm:text-2xl font-semibold',
  body: 'text-lg sm:text-xl text-muted-foreground leading-relaxed',
  bodySm: 'text-base text-muted-foreground leading-relaxed',
  caption: 'text-xs sm:text-sm text-muted-foreground uppercase tracking-widest',
  stat: 'text-4xl sm:text-5xl font-extrabold tracking-tight',
} as const

/** Sektions-Abstände */
export const SPACING = {
  sectionY: 'py-20 sm:py-24',
  sectionYLg: 'py-24 sm:py-32',
  sectionX: 'px-6',
  container: 'max-w-6xl mx-auto',
  containerMd: 'max-w-4xl mx-auto',
  containerSm: 'max-w-2xl mx-auto',
} as const

/* ═══════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════ */

/** IntersectionObserver — Element wird sichtbar wenn es in den Viewport scrollt */
export function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ═══════════════════════════════════════════════════════════════════
   BASIS-KOMPONENTEN
   ═══════════════════════════════════════════════════════════════════ */

/** FadeSection — Wrapper der beim Scrollen einblendet */
export function FadeSection({
  children,
  className = '',
  delay = 0,
  threshold = 0.12,
}: {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
}) {
  const { ref, visible } = useFadeIn(threshold)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

/** SectionWrapper — Standardisierter Container mit Spacing */
export function SectionWrapper({
  children,
  className = '',
  bg = 'default',
  id,
}: {
  children: ReactNode
  className?: string
  bg?: 'default' | 'muted' | 'card'
  id?: string
}) {
  const bgClass =
    bg === 'muted' ? 'bg-muted/40' : bg === 'card' ? 'bg-card' : ''
  return (
    <section
      id={id}
      className={`${SPACING.sectionY} ${SPACING.sectionX} ${bgClass} ${className}`}
    >
      <div className={SPACING.container}>{children}</div>
    </section>
  )
}

/** SectionHeader — Badge + H2 + Subtitle, zentriert */
export function SectionHeader({
  badge,
  badgeColor = 'text-primary',
  title,
  titleGradient,
  subtitle,
  className = '',
}: {
  badge?: string
  badgeColor?: string
  title: ReactNode
  titleGradient?: string
  subtitle?: string
  className?: string
}) {
  return (
    <FadeSection className={`text-center mb-14 sm:mb-20 ${className}`}>
      {badge && (
        <span className={`${TYPE.badge} ${badgeColor} block mb-4`}>
          {badge}
        </span>
      )}
      <h2 className={`${TYPE.h2} mb-5`}>
        {title}
        {titleGradient && (
          <>
            <br />
            <GradientText>{titleGradient}</GradientText>
          </>
        )}
      </h2>
      {subtitle && (
        <p className={`${TYPE.body} max-w-2xl mx-auto`}>{subtitle}</p>
      )}
    </FadeSection>
  )
}

/** GradientText — gradient-boxer als Default */
export function GradientText({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`gradient-text-boxer ${className}`}>{children}</span>
  )
}

/** PageBadge — Uppercase Label */
export function PageBadge({
  children,
  color = 'text-primary',
  className = '',
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={`inline-block ${TYPE.badge} ${color} ${className}`}
    >
      {children}
    </span>
  )
}

/** PrimaryButton — gradient-boxer, rounded-full, scale on hover */
export function PrimaryButton({
  to,
  href,
  onClick,
  children,
  className = '',
  target,
  rel,
  showArrow = true,
}: {
  to?: string
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  showArrow?: boolean
}) {
  const cls = `inline-flex items-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full text-base font-semibold text-white gradient-boxer shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${className}`

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </>
  )

  if (onClick) return <button onClick={onClick} className={cls}>{content}</button>
  if (href) return <a href={href} target={target} rel={rel} className={cls}>{content}</a>
  return <Link to={to ?? '/'} className={cls}>{content}</Link>
}

/** GhostButton — Outline, rounded-full */
export function GhostButton({
  to,
  href,
  onClick,
  children,
  className = '',
  showArrow = true,
}: {
  to?: string
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  showArrow?: boolean
}) {
  const cls = `inline-flex items-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full text-base font-semibold border-2 border-foreground/15 text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${className}`

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </>
  )

  if (onClick) return <button onClick={onClick} className={cls}>{content}</button>
  if (href) return <a href={href} className={cls}>{content}</a>
  return <Link to={to ?? '/'} className={cls}>{content}</Link>
}

/** PageHero — Standardisierter Hero mit allen Animations */
export function PageHero({
  badge,
  badgeColor,
  title,
  titleGradient,
  subtitle,
  primaryCta,
  secondaryCta,
  hint,
  ambientGlow = true,
}: {
  badge?: string
  badgeColor?: string
  title: string
  titleGradient?: string
  subtitle?: string
  primaryCta?: { label: string; to?: string; onClick?: () => void; icon?: ReactNode }
  secondaryCta?: { label: string; to?: string; onClick?: () => void; icon?: ReactNode }
  hint?: string
  ambientGlow?: boolean
}) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {ambientGlow && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07]"
            style={{
              background:
                'radial-gradient(circle, #dc2626 0%, #f97316 40%, transparent 70%)',
            }}
          />
        </div>
      )}

      <div className="relative max-w-4xl mx-auto">
        {badge && (
          <div style={{ animation: 'bbFadeInUp 0.5s ease 0.05s both' }}>
            <PageBadge color={badgeColor ?? 'text-red-700 dark:text-red-300'} className="mb-6">
              {badge}
            </PageBadge>
          </div>
        )}

        <div style={{ animation: 'bbFadeInUp 0.6s ease 0.15s both' }}>
          <h1 className={`${TYPE.h1} mb-6`}>
            {title}
            {titleGradient && (
              <>
                <br />
                <GradientText>{titleGradient}</GradientText>
              </>
            )}
          </h1>
        </div>

        {subtitle && (
          <div style={{ animation: 'bbFadeInUp 0.6s ease 0.3s both' }}>
            <p className={`${TYPE.body} max-w-2xl mx-auto mb-10`}>{subtitle}</p>
          </div>
        )}

        {(primaryCta || secondaryCta) && (
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animation: 'bbFadeInUp 0.6s ease 0.45s both' }}
          >
            {primaryCta && (
              <PrimaryButton
                to={primaryCta.to}
                onClick={primaryCta.onClick}
                showArrow={false}
              >
                {primaryCta.icon}
                {primaryCta.label}
              </PrimaryButton>
            )}
            {secondaryCta && (
              <GhostButton
                to={secondaryCta.to}
                onClick={secondaryCta.onClick}
                showArrow={false}
              >
                {secondaryCta.icon}
                {secondaryCta.label}
              </GhostButton>
            )}
          </div>
        )}

        {hint && (
          <p
            className="text-xs text-muted-foreground/70 mt-5 tracking-wide"
            style={{ animation: 'bbFadeInUp 0.6s ease 0.55s both' }}
          >
            {hint}
          </p>
        )}
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          opacity: scrolled ? 0 : 0.4,
          transition: 'opacity 0.5s',
          animation: 'bbBounce 2s infinite',
        }}
      >
        <ChevronDown className="w-6 h-6 text-foreground" />
      </div>
    </section>
  )
}

/** PageHeader — Kompakter Header für App-Tools / Forms / interne Pages.
 *  Nicht 80vh wie PageHero, sondern ~py-10 mit Badge + H1 + Sub + optional CTA. */
export function PageHeader({
  badge,
  badgeColor = 'text-primary',
  title,
  titleGradient,
  subtitle,
  cta,
  align = 'left',
}: {
  badge?: string
  badgeColor?: string
  title: ReactNode
  titleGradient?: string
  subtitle?: string
  cta?: { label: string; to?: string; onClick?: () => void; icon?: ReactNode }
  align?: 'left' | 'center'
}) {
  return (
    <section className={`${SPACING.sectionX} pt-8 sm:pt-12 pb-2 sm:pb-4`}>
      <div className={SPACING.container}>
        <FadeSection
          className={`${align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}`}
        >
          {badge && (
            <span
              className={`inline-block text-xs uppercase tracking-[0.3em] font-semibold ${badgeColor} mb-3`}
            >
              {badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
            {title}
            {titleGradient && (
              <>
                {' '}
                <GradientText>{titleGradient}</GradientText>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
          {cta && (
            <div className={`mt-5 ${align === 'center' ? 'flex justify-center' : ''}`}>
              <PrimaryButton to={cta.to} onClick={cta.onClick} showArrow={!cta.icon}>
                {cta.icon}
                {cta.label}
              </PrimaryButton>
            </div>
          )}
        </FadeSection>
      </div>
    </section>
  )
}

/** TrustPill — Kleines Feature/Trust-Label */
export function TrustPill({
  icon,
  children,
  color = 'border-border bg-background text-muted-foreground',
}: {
  icon?: ReactNode
  children: ReactNode
  color?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium ${color}`}
    >
      {icon}
      {children}
    </span>
  )
}
