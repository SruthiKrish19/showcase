import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Pitch, Stage } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { revealVariants, transition } from '../../lib/motion'

const STAGE_LABEL: Record<Stage, string> = {
  concept: 'Concept',
  prototype: 'Prototype',
  pilot: 'In pilot',
  building: 'Building',
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-amber">
      <span className="h-1 w-1 rounded-full bg-amber" />
      {STAGE_LABEL[stage]}
    </span>
  )
}

/**
 * A product idea, presented as a wide rail rather than a grid card — a pitch
 * reads differently to a shipped project and should not look like one.
 */
export function PitchCard({ pitch, index }: { pitch: Pitch; index: number }) {
  const reduced = useReducedMotion() ?? false
  const a = accent(pitch.accent)

  return (
    <motion.div variants={revealVariants(reduced)} transition={transition(0.65)}>
      <Link
        to={`/pitch/${pitch.slug}`}
        className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] md:flex-row md:items-center md:gap-10 md:p-9"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `radial-gradient(70% 140% at 0% 50%, ${a.hex}1f, transparent 70%)`,
          }}
        />
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${a.hex}, transparent)`,
          }}
        />

        <div className="relative flex items-center gap-4 md:w-44 md:shrink-0 md:flex-col md:items-start md:gap-3">
          <span className="font-display text-sm text-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <StageBadge stage={pitch.stage} />
        </div>

        <div className="relative flex-1">
          <span className="text-xs text-faint">{pitch.category}</span>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {pitch.title}
          </h3>
          <p className="mt-2.5 max-w-2xl text-balance-safe text-sm leading-relaxed text-muted md:text-base">
            {pitch.tagline}
          </p>
          <span
            className={cn(
              'mt-4 inline-flex items-center gap-2 text-sm font-medium opacity-0 transition-opacity duration-500 group-hover:opacity-100',
              a.text,
            )}
          >
            Read the pitch
          </span>
        </div>

        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-faint transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/5 group-hover:text-ink">
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.div>
  )
}
