import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type {
  Accent,
  Fact,
  ModuleStatus,
  Objection,
  PitchModule,
  Voice,
} from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { staggerParent, VIEWPORT } from '../../lib/motion'
import { MagneticButton } from '../ui/MagneticButton'
import { Reveal, RevealItem } from '../ui/Reveal'

/** The public one-liner, big, with the second half carrying the gradient. */
export function PromiseLine({ lead, punch }: { lead: string; punch: string }) {
  return (
    <Reveal>
      <p className="max-w-3xl font-display text-[clamp(1.5rem,4.6vw,2.75rem)] font-semibold leading-[1.15] tracking-tight">
        <span className="text-muted">{lead}</span>{' '}
        <span className="gradient-text">{punch}</span>
      </p>
    </Reveal>
  )
}

/** Sibling of MetricRow for text values — nothing counts up. */
export function FactRow({
  facts,
  accentKey,
}: {
  facts: Fact[]
  accentKey: Accent
}) {
  if (!facts.length) return null
  const a = accent(accentKey)

  return (
    <Reveal>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="bg-bg/90 px-5 py-5 sm:px-6 sm:py-7">
            <dd
              className={cn(
                'font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl',
                a.text,
              )}
            >
              {f.value}
            </dd>
            <dt className="mt-2 text-sm leading-snug text-muted">{f.label}</dt>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}

/** The problem in the users' own words, as a staggered grid of cards. */
export function VoiceGrid({
  voices,
  accentKey,
}: {
  voices: Voice[]
  accentKey: Accent
}) {
  const a = accent(accentKey)

  return (
    <motion.ul
      variants={staggerParent(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="grid gap-3 sm:grid-cols-2"
    >
      {voices.map((v) => (
        <RevealItem
          key={v.role}
          as="li"
          className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6"
        >
          <span
            aria-hidden
            className={cn('font-display text-4xl leading-none', a.text)}
          >
            &ldquo;
          </span>
          <p className="mt-1 flex-1 text-[15px] leading-relaxed text-ink">
            {v.quote}
          </p>
          <footer className="mt-4 font-display text-[11px] uppercase tracking-[0.18em] text-faint">
            {v.role}
          </footer>
        </RevealItem>
      ))}
    </motion.ul>
  )
}

/** The four public verbs, one line, separated by accent dots. */
export function VerbRail({
  verbs,
  accentKey,
}: {
  verbs: string[]
  accentKey: Accent
}) {
  const a = accent(accentKey)

  return (
    <Reveal>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-2xl font-semibold tracking-tight sm:gap-x-4 sm:text-4xl md:text-5xl">
        {verbs.map((verb, i) => (
          <span key={verb} className="flex items-center gap-x-3 sm:gap-x-4">
            {i > 0 && (
              <span
                aria-hidden
                className={cn('h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2', a.dot)}
              />
            )}
            {verb}
          </span>
        ))}
      </p>
    </Reveal>
  )
}

const STATUS_LABEL: Record<ModuleStatus, string> = {
  first: 'First build',
  next: 'Next in line',
  roadmap: 'Roadmap',
}

export function ModuleGrid({
  modules,
  accentKey,
}: {
  modules: PitchModule[]
  accentKey: Accent
}) {
  const a = accent(accentKey)

  return (
    <motion.ul
      variants={staggerParent(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="grid gap-3 sm:grid-cols-2"
    >
      {modules.map((m) => (
        <RevealItem
          key={m.key}
          as="li"
          className="relative overflow-hidden rounded-2xl border border-white/8 bg-surface p-5 sm:p-6"
        >
          {m.status === 'first' && (
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, ${a.hex}, transparent)`,
              }}
            />
          )}

          <div className="flex items-start justify-between gap-3">
            <span
              className={cn(
                'font-display text-3xl font-semibold tracking-tight sm:text-4xl',
                m.status === 'first' ? a.text : 'text-faint',
              )}
            >
              {m.key}
            </span>
            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide',
                m.status === 'first'
                  ? cn(a.text, a.border)
                  : 'border-white/10 text-muted',
              )}
            >
              {STATUS_LABEL[m.status]}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
            {m.name}
          </h3>
          <p className="mt-1 text-xs text-faint">{m.who}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{m.summary}</p>
        </RevealItem>
      ))}
    </motion.ul>
  )
}

/** Objection on the left, answer on the right. */
export function ObjectionList({ items }: { items: Objection[] }) {
  return (
    <dl className="divide-y divide-white/6">
      {items.map((o) => (
        <div
          key={o.objection}
          className="grid gap-1.5 py-5 first:pt-0 last:pb-0 sm:grid-cols-[1fr_1.4fr] sm:gap-8"
        >
          <dt className="font-display text-[15px] text-ink">
            &ldquo;{o.objection}&rdquo;
          </dt>
          <dd className="text-[15px] leading-relaxed text-muted">{o.answer}</dd>
        </div>
      ))}
    </dl>
  )
}

/** The closing card: what is being asked for, and one button. */
export function AskBanner({
  title,
  body,
  accentKey,
  href,
}: {
  title: string
  body: string
  accentKey: Accent
  href: string
}) {
  const a = accent(accentKey)

  return (
    <Reveal>
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 p-7 sm:p-10 md:p-14"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(90% 90% at 100% 0%, ${a.hex}26, transparent 65%)`,
          }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${a.hex}, transparent)`,
          }}
        />

        <div className="relative">
          <span className="font-display text-xs uppercase tracking-[0.18em] text-faint">
            The ask
          </span>
          <h2 className="mt-3 max-w-2xl text-balance-safe font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-balance-safe text-[15px] leading-relaxed text-muted sm:text-base">
            {body}
          </p>
          <div className="mt-7">
            <MagneticButton href={href}>
              Start a conversation
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
