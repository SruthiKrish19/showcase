import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../../content/projects'
import type { Project } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { revealVariants, staggerParent, transition, VIEWPORT } from '../../lib/motion'
import { CoverArt } from '../ui/CoverArt'

/**
 * Two genuinely different layouts rather than one squeezed into both:
 * an editorial index of big type from lg up, and full-width stacked cards
 * below it, where a cramped row would be unreadable.
 */
export function WorkList() {
  const reduced = useReducedMotion() ?? false
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      {/* Mobile / tablet — stacked cards */}
      <motion.div
        variants={staggerParent(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="flex flex-col gap-7 lg:hidden"
      >
        {projects.map((project, i) => (
          <Card key={project.slug} project={project} index={i} reduced={reduced} />
        ))}
      </motion.div>

      {/* Desktop — editorial index */}
      <motion.div
        variants={staggerParent(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        onPointerLeave={() => setActive(null)}
        className="hidden lg:block"
      >
        {projects.map((project, i) => (
          <Row
            key={project.slug}
            project={project}
            index={i}
            dimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
            reduced={reduced}
          />
        ))}
        <motion.div
          variants={revealVariants(reduced)}
          transition={transition(0.5)}
          className="h-px bg-white/10"
        />
      </motion.div>
    </>
  )
}

type CardProps = { project: Project; index: number; reduced: boolean }

function Card({ project, index, reduced }: CardProps) {
  const a = accent(project.accent)

  return (
    <motion.div
      variants={revealVariants(reduced)}
      transition={transition(0.6)}
      className="relative"
    >
      {/* Accent bloom behind the card — the thing that stops it reading as
          a plain bordered box */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[30px] opacity-60 blur-xl"
        style={{
          background: `radial-gradient(60% 50% at 50% 0%, ${a.hex}40, transparent 70%)`,
        }}
      />

      <Link
        to={`/work/${project.slug}`}
        className="panel relative block overflow-hidden rounded-[28px]"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${a.hex}, transparent)`,
          }}
        />

        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]">
          <CoverArt
            accentKey={project.accent}
            src={project.cover}
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/55 to-transparent" />

          {/* Oversized ghost index, set into the artwork */}
          <span
            aria-hidden
            className="absolute right-5 top-3 font-display text-[88px] font-bold leading-none text-white/[0.07]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title sits over the image, the way a magazine would set it */}
          <div className="absolute inset-x-5 bottom-4">
            <div className="flex items-center gap-2.5">
              <span className={cn('h-1 w-6 rounded-full', a.dot)} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                {project.year}
              </span>
            </div>
            <h3 className="mt-2 font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.02em]">
              {project.title}
            </h3>
          </div>
        </div>

        <div className="relative px-5 pb-5 pt-4">
          <p className="text-[14.5px] leading-relaxed text-muted">
            {project.tagline}
          </p>

          {/* Numbers carry more weight than chips on a small screen */}
          <dl className="mt-5 flex gap-7">
            {project.metrics.slice(0, 2).map((m) => (
              <div key={m.label}>
                <dd
                  className={cn(
                    'font-display text-xl font-semibold tracking-tight',
                    a.text,
                  )}
                >
                  {m.prefix}
                  {m.value}
                  {m.suffix}
                </dd>
                <dt className="mt-0.5 text-[11px] leading-tight text-faint">
                  {m.label}
                </dt>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
            <span className="text-[13px] uppercase tracking-[0.14em] text-muted">
              {project.role}
            </span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border"
              style={{ borderColor: `${a.hex}40`, color: a.hex }}
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

type RowProps = {
  project: Project
  index: number
  dimmed: boolean
  onEnter: () => void
  reduced: boolean
}

function Row({ project, index, dimmed, onEnter, reduced }: RowProps) {
  const a = accent(project.accent)

  return (
    <motion.div variants={revealVariants(reduced)} transition={transition(0.6)}>
      <Link
        to={`/work/${project.slug}`}
        onPointerEnter={onEnter}
        onFocus={onEnter}
        className={cn(
          'group relative block border-t border-white/10 py-9 transition-opacity duration-500',
          dimmed ? 'opacity-30' : 'opacity-100',
        )}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
          style={{ background: `linear-gradient(90deg, ${a.hex}, transparent)` }}
        />

        <div className="flex items-center gap-6">
          <span className="w-14 shrink-0 font-display text-sm text-faint">
            {String(index + 1).padStart(2, '0')}
          </span>

          <h3 className="min-w-0 flex-1 font-display text-5xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">
            {project.title}
          </h3>

          <div className="shrink-0 text-right">
            <span className="block text-sm text-muted">{project.role}</span>
            <span className="mt-1 block text-xs text-faint">{project.year}</span>
          </div>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-faint transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/5 group-hover:text-ink">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
