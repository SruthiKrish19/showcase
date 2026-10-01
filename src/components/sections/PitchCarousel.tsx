import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { pitches } from '../../content/pitches'
import type { Pitch, Stage } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { revealVariants, transition, VIEWPORT } from '../../lib/motion'

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
 * One pitch at a time. Scrolling is native with CSS snap points — so a
 * phone swipe feels exactly like every other carousel the user has used —
 * and the arrows and dots drive the same scroll container on desktop.
 */
export function PitchCarousel() {
  const reduced = useReducedMotion() ?? false
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  // Derive the active slide from scroll position rather than tracking it
  // separately, so a swipe and a button press stay in agreement.
  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const slide = el.scrollWidth / pitches.length
    setIndex(Math.round(el.scrollLeft / slide))
  }, [])

  const goTo = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(i, pitches.length - 1))
    el.scrollTo({
      left: (el.scrollWidth / pitches.length) * clamped,
      behavior: 'smooth',
    })
  }, [])

  // Arrow keys move the carousel when it has focus.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [goTo, index])

  return (
    <motion.div
      variants={revealVariants(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={transition(0.65)}
    >
      {/* Controls — above the track, out of the way of a swiping thumb */}
      <div className="mb-5 flex items-center justify-between">
        <span className="font-display text-sm text-faint tabular-nums">
          {String(index + 1).padStart(2, '0')}
          <span className="mx-1.5 text-white/20">/</span>
          {String(pitches.length).padStart(2, '0')}
        </span>

        <div className="flex gap-2">
          <ArrowButton
            label="Previous pitch"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </ArrowButton>
          <ArrowButton
            label="Next pitch"
            onClick={() => goTo(index + 1)}
            disabled={index === pitches.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </ArrowButton>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={0}
        role="region"
        aria-label="Pitch carousel"
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {pitches.map((pitch, i) => (
          <Slide key={pitch.slug} pitch={pitch} index={i} />
        ))}
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {pitches.map((pitch, i) => (
          <button
            key={pitch.slug}
            onClick={() => goTo(i)}
            aria-label={`Go to ${pitch.title}`}
            aria-current={i === index}
            className="group p-2"
          >
            <span
              className={cn(
                'block h-1.5 rounded-full transition-all duration-500',
                i === index
                  ? 'w-7 bg-ink'
                  : 'w-1.5 bg-white/25 group-hover:bg-white/50',
              )}
            />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function ArrowButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function Slide({ pitch, index }: { pitch: Pitch; index: number }) {
  const a = accent(pitch.accent)

  return (
    <article className="w-[86vw] shrink-0 snap-center sm:w-[70vw] lg:w-full lg:max-w-none">
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-9 lg:p-12"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(90% 90% at 0% 100%, ${a.hex}26, transparent 65%)`,
          }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, ${a.hex}, transparent)` }}
        />

        <div className="relative flex flex-wrap items-center gap-3">
          <span className="font-display text-sm text-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <StageBadge stage={pitch.stage} />
          <span className="text-xs text-faint">{pitch.category}</span>
        </div>

        <h3 className="relative mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-6xl">
          {pitch.title}
        </h3>

        <p className="relative mt-4 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base lg:text-lg">
          {pitch.tagline}
        </p>

        <div className="relative mt-8 grid gap-6 border-t border-white/8 pt-7 sm:grid-cols-2 sm:gap-10">
          <Block label="Problem" body={pitch.problem} />
          <Block label="Solution" body={pitch.solution} />
        </div>

        <div className="relative mt-8">
          <Link
            to={`/pitch/${pitch.slug}`}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:bg-white/5',
              a.text,
              a.border,
            )}
          >
            Read the pitch
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h4 className="font-display text-[11px] uppercase tracking-[0.18em] text-faint">
        {label}
      </h4>
      <p className="mt-2.5 line-clamp-4 text-sm leading-relaxed text-muted">
        {body}
      </p>
    </div>
  )
}
