import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Accent, Pitch, Slide } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { EASE } from '../../lib/motion'
import { MagneticButton } from '../ui/MagneticButton'
import { StageBadge } from '../sections/PitchCarousel'

const SWIPE = 60

/**
 * A deck, not a page. One slide fills the viewport; arrow keys, swipe, the
 * buttons and the progress bar all move between slides. Nothing scrolls.
 */
export function PitchDeck({ pitch }: { pitch: Pitch }) {
  const reduced = useReducedMotion() ?? false
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const a = accent(pitch.accent)
  const slides = pitch.slides
  const last = slides.length - 1

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(i, last))
      setDir(clamped >= index ? 1 : -1)
      setIndex(clamped)
    },
    [index, last],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Leave Space and arrows alone when a button or link has focus
      if ((e.target as HTMLElement).closest('button, a')) return
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        goTo(index + 1)
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        goTo(index - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, index])

  const variants = {
    enter: (d: number) =>
      reduced ? { opacity: 0 } : { opacity: 0, x: 48 * d, filter: 'blur(8px)' },
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (d: number) =>
      reduced ? { opacity: 0 } : { opacity: 0, x: -48 * d, filter: 'blur(8px)' },
  }

  return (
    <section
      className="relative flex min-h-[100svh] flex-col px-5 pt-24 pb-6 sm:px-6 sm:pt-28 sm:pb-8"
      aria-roledescription="carousel"
      aria-label={`${pitch.title} pitch deck`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background: `radial-gradient(60% 100% at 50% 0%, ${a.hex}33, transparent 70%)`,
        }}
      />

      {/* Top bar — way out, and where we are */}
      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          to="/#pitches"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          All pitches
        </Link>
        <span className="font-display text-sm text-faint tabular-nums">
          {String(index + 1).padStart(2, '0')}
          <span className="mx-1.5 text-white/20">/</span>
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Progress — one segment per slide, click to jump */}
      <div className="relative mx-auto mt-4 flex w-full max-w-5xl gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
            className="group flex-1 py-2"
          >
            <span
              className={cn(
                'block h-px w-full transition-colors duration-500',
                i <= index ? a.dot : 'bg-white/15 group-hover:bg-white/35',
              )}
            />
          </button>
        ))}
      </div>

      {/* The slide */}
      <div className="relative mx-auto flex w-full max-w-5xl items-start overflow-hidden sm:flex-1 sm:items-center">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE }}
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE) goTo(index + 1)
              if (info.offset.x > SWIPE) goTo(index - 1)
            }}
            className="w-full cursor-grab pt-8 pb-10 active:cursor-grabbing sm:py-12"
          >
            <SlideView slide={slides[index]} pitch={pitch} accentKey={pitch.accent} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <span className="text-xs text-faint">
          <span className="sm:hidden">Swipe or tap the arrows</span>
          <span className="hidden sm:inline">Arrow keys, swipe, or tap the arrows</span>
        </span>
        <div className="flex gap-2">
          <ArrowButton label="Previous slide" onClick={() => goTo(index - 1)} disabled={index === 0}>
            <ArrowLeft className="h-4 w-4" />
          </ArrowButton>
          <ArrowButton label="Next slide" onClick={() => goTo(index + 1)} disabled={index === last}>
            <ArrowRight className="h-4 w-4" />
          </ArrowButton>
        </div>
      </div>
    </section>
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
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-xs uppercase tracking-[0.2em] text-faint">
      {children}
    </span>
  )
}

/** Slide headline — the same size everywhere so the deck has one voice. */
function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-3xl text-balance-safe font-display text-[clamp(2.1rem,8.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
      {children}
    </h2>
  )
}

function SlideView({
  slide,
  pitch,
  accentKey,
}: {
  slide: Slide
  pitch: Pitch
  accentKey: Accent
}) {
  const a = accent(accentKey)

  switch (slide.kind) {
    case 'title':
      return (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StageBadge stage={pitch.stage} />
            <Eyebrow>{slide.eyebrow}</Eyebrow>
          </div>
          <h1 className="mt-6 font-display text-[clamp(3.75rem,17vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-xl text-balance-safe text-lg leading-relaxed text-muted sm:text-2xl">
            {slide.sub}
          </p>
          {slide.note && <p className="mt-4 text-xs text-faint">{slide.note}</p>}
        </div>
      )

    case 'statement':
      return (
        <div>
          {slide.eyebrow && <Eyebrow>{slide.eyebrow}</Eyebrow>}
          <p className="mt-4 max-w-4xl text-balance-safe font-display text-[clamp(2.4rem,9.5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {slide.lead && <span className="text-muted">{slide.lead} </span>}
            <span className="gradient-text">{slide.punch}</span>
          </p>
          {slide.note && (
            <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">{slide.note}</p>
          )}
        </div>
      )

    case 'quotes':
      return (
        <div>
          <Eyebrow>{slide.eyebrow}</Eyebrow>
          <Title>{slide.title}</Title>
          <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
            {slide.quotes.map((q) => (
              <li
                key={q.role}
                className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6"
              >
                <span aria-hidden className={cn('font-display text-4xl leading-none', a.text)}>
                  &ldquo;
                </span>
                <p className="mt-1 flex-1 font-display text-lg leading-snug text-ink sm:text-xl">
                  {q.quote}
                </p>
                <span className="mt-5 text-xs uppercase tracking-[0.18em] text-faint">
                  {q.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'verbs':
      return (
        <div>
          <Eyebrow>{slide.eyebrow}</Eyebrow>
          <Title>{slide.title}</Title>
          <ol className="mt-8 divide-y divide-white/8 sm:mt-10">
            {slide.verbs.map((v) => (
              <li
                key={v.verb}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8 sm:py-5"
              >
                <span
                  className={cn(
                    'font-display text-3xl font-semibold tracking-tight sm:w-56 sm:text-5xl',
                    a.text,
                  )}
                >
                  {v.verb}
                </span>
                <span className="text-base text-muted sm:text-xl">{v.line}</span>
              </li>
            ))}
          </ol>
        </div>
      )

    case 'cards':
      return (
        <div>
          <Eyebrow>{slide.eyebrow}</Eyebrow>
          <Title>{slide.title}</Title>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 lg:grid-cols-4">
            {slide.cards.map((c) => (
              <li
                key={c.tag}
                className={cn(
                  'relative overflow-hidden rounded-2xl border border-white/8 bg-surface p-5 sm:p-6',
                  c.dim && 'opacity-60',
                )}
              >
                {!c.dim && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, ${a.hex}, transparent)` }}
                  />
                )}
                <span
                  className={cn(
                    'font-display text-xs uppercase tracking-[0.18em]',
                    c.dim ? 'text-faint' : a.text,
                  )}
                >
                  {c.tag}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-muted sm:text-base">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'steps':
      return (
        <div>
          <Eyebrow>{slide.eyebrow}</Eyebrow>
          <Title>{slide.title}</Title>
          <ol className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
            {slide.steps.map((s, i) => (
              <li key={s} className="flex items-baseline gap-4 sm:gap-6">
                <span className={cn('font-display text-sm tabular-nums sm:text-base', a.text)}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-balance-safe text-lg leading-snug text-ink sm:text-2xl">
                  {s}
                </span>
              </li>
            ))}
          </ol>
          {slide.close && (
            <p className="mt-8 font-display text-xl font-semibold tracking-tight text-muted sm:text-3xl">
              {slide.close}
            </p>
          )}
        </div>
      )

    case 'ask':
      return (
        <div>
          <Eyebrow>The ask</Eyebrow>
          <Title>{slide.title}</Title>
          <p className="mt-5 max-w-xl text-balance-safe text-base leading-relaxed text-muted sm:text-xl">
            {slide.body}
          </p>
          <div className="mt-8">
            <MagneticButton href={slide.href}>
              {slide.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </div>
        </div>
      )
  }
}
