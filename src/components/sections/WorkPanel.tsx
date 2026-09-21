import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { CoverArt } from '../ui/CoverArt'
import { Counter } from '../ui/Counter'
import { Chip } from '../ui/Chip'

type Props = {
  project: Project
  index: number
  isLast: boolean
}

/**
 * One panel in the stacking deck. Each panel pins to the top of the viewport
 * and the next one slides over it, so the projects physically stack like a
 * deck of cards rather than scrolling past as a grid.
 */
export function WorkPanel({ project, index, isLast }: Props) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const a = accent(project.accent)

  // Runs 0 → 1 over exactly the stretch where the next panel slides in.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const still = reduced || isLast
  const scale = useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [1, 0.92])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    still ? [1, 1, 1] : [1, 1, 0.45],
  )

  return (
    <div
      ref={ref}
      className="md:sticky md:top-0 md:flex md:h-screen md:items-center"
      style={{ paddingTop: `calc(var(--stack-offset, 0px) * ${index})` }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="w-full origin-top px-0 md:px-2"
      >
        <Link
          to={`/work/${project.slug}`}
          className="group panel relative grid overflow-hidden rounded-[28px] transition-colors duration-500 hover:border-white/20 md:h-[78vh] md:grid-cols-[1.05fr_1fr]"
        >
          {/* Accent wash, anchored to the text side */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background: `radial-gradient(80% 90% at 0% 100%, ${a.hex}1f, transparent 65%)`,
            }}
          />

          {/* Text side */}
          <div className="relative flex flex-col justify-between p-7 md:p-10 lg:p-12">
            <div>
              <div className="flex items-center gap-3 text-xs text-faint">
                <span className={cn('h-1.5 w-1.5 rounded-full', a.dot)} />
                <span className="font-display tracking-[0.18em]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-5 bg-white/15" />
                <span>{project.year}</span>
                <span className="h-px w-5 bg-white/15" />
                <span>{project.role}</span>
              </div>

              <h3 className="mt-5 font-display text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.025em]">
                {project.title}
              </h3>

              <p className="mt-4 max-w-md text-balance-safe text-sm leading-relaxed text-muted md:text-base">
                {project.tagline}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
            </div>

            <div className="mt-8 md:mt-0">
              <dl className="flex flex-wrap gap-x-10 gap-y-5">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dd
                      className={cn(
                        'font-display text-2xl font-semibold tracking-tight md:text-3xl',
                        a.text,
                      )}
                    >
                      <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} />
                    </dd>
                    <dt className="mt-1 max-w-[9rem] text-xs leading-tight text-muted">
                      {m.label}
                    </dt>
                  </div>
                ))}
              </dl>

              <span className="mt-8 inline-flex items-center gap-2 text-sm text-muted transition-colors duration-300 group-hover:text-ink">
                Read the case study
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>

          {/* Image side */}
          <div className="relative order-first min-h-[220px] overflow-hidden md:order-none md:min-h-0">
            <CoverArt
              accentKey={project.accent}
              src={project.cover}
              alt={project.title}
              label={String(index + 1).padStart(2, '0')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-bg/60" />
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
