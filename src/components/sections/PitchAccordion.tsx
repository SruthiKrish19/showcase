import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { pitches } from '../../content/pitches'
import type { Pitch, Stage } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { revealVariants, staggerParent, transition, VIEWPORT } from '../../lib/motion'

const STAGE_LABEL: Record<Stage, string> = {
  concept: 'Concept',
  prototype: 'Prototype',
  pilot: 'In pilot',
  building: 'Building',
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-amber">
      <span className="h-1 w-1 rounded-full bg-amber" />
      {STAGE_LABEL[stage]}
    </span>
  )
}

/**
 * Expanding accordion. All pitches stay on screen at once — the open one
 * widens to show the full pitch while the others collapse to a spine with
 * the title running vertically. Deliberately nothing like the work deck.
 */
export function PitchAccordion() {
  const [open, setOpen] = useState(0)
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      variants={staggerParent(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="flex flex-col gap-4 md:h-[600px] md:flex-row md:gap-3"
    >
      {pitches.map((pitch, i) => (
        <Panel
          key={pitch.slug}
          pitch={pitch}
          index={i}
          isOpen={open === i}
          onOpen={() => setOpen(i)}
          reduced={reduced}
        />
      ))}
    </motion.div>
  )
}

type PanelProps = {
  pitch: Pitch
  index: number
  isOpen: boolean
  onOpen: () => void
  reduced: boolean
}

function Panel({ pitch, index, isOpen, onOpen, reduced }: PanelProps) {
  const a = accent(pitch.accent)

  return (
    <motion.div
      variants={revealVariants(reduced)}
      transition={transition(0.65)}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      className={cn(
        'group relative overflow-hidden rounded-3xl border transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'md:min-w-0 md:flex-shrink',
        isOpen
          ? 'border-white/20 md:flex-grow-[4]'
          : 'border-white/8 md:flex-grow-[1]',
      )}
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Accent field, stronger when open */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(90% 80% at 0% 100%, ${a.hex}2e, transparent 65%)`,
          opacity: isOpen ? 1 : 0.35,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px transition-opacity duration-700"
        style={{
          background: `linear-gradient(90deg, ${a.hex}, transparent)`,
          opacity: isOpen ? 1 : 0,
        }}
      />

      {/* Collapsed spine — desktop only */}
      <div
        className={cn(
          'absolute inset-0 hidden items-center justify-between px-6 py-8 transition-opacity duration-500 md:flex md:flex-col',
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100 delay-200',
        )}
      >
        <span className="font-display text-sm text-faint">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className="font-display text-2xl font-semibold tracking-tight whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', rotate: '180deg' }}
        >
          {pitch.title}
        </span>
        <span className={cn('h-2 w-2 rounded-full', a.dot)} />
      </div>

      {/* Open content */}
      <div
        className={cn(
          'relative flex h-full flex-col justify-end p-6 transition-opacity duration-500 md:p-9',
          isOpen ? 'opacity-100 md:delay-150' : 'md:opacity-0',
        )}
      >
        <div className="md:max-w-lg">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-sm text-faint">
              {String(index + 1).padStart(2, '0')}
            </span>
            <StageBadge stage={pitch.stage} />
            <span className="text-xs text-faint">{pitch.category}</span>
          </div>

          <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.05]">
            {pitch.title}
          </h3>

          <p className="mt-4 text-balance-safe text-sm leading-relaxed text-muted md:text-base">
            {pitch.tagline}
          </p>

          <Link
            to={`/pitch/${pitch.slug}`}
            className={cn(
              'mt-7 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:bg-white/5',
              a.text,
              a.border,
            )}
          >
            Read the pitch
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
