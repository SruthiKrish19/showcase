import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { MagneticButton } from '../ui/MagneticButton'
import { SplitText } from '../ui/SplitText'
import { Typewriter } from '../ui/Typewriter'
import { Eyebrow } from '../ui/Chip'
import { EASE } from '../../lib/motion'
import { SHOW_PITCHES } from '../../content/flags'
import { projects } from '../../content/projects'

const PHRASES = [
  'impossibly fast.',
  'genuinely useful.',
  'effortless to use.',
  'worth paying for.',
  'built to last.',
]

export function Hero() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.25], [0, reduced ? 0 : 90])
  const opacity = useTransform(scrollYProgress, [0, 0.16], [1, reduced ? 1 : 0])

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center px-5 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
      <motion.div
        style={{ y, opacity }}
        className="mx-auto w-full max-w-5xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        >
          <Eyebrow>{projects.length} projects &middot; websites, 3D and AI</Eyebrow>
        </motion.div>

        {/* Two hard lines: the static phrase never wraps, so the typed line
            always sits directly beneath it. */}
        <h1 className="mt-7 font-display text-[clamp(2rem,8.6vw,2.85rem)] font-semibold leading-[1.08] tracking-[-0.03em] sm:mt-8 sm:text-[clamp(1.6rem,5.2vw,4rem)]">
          <span className="block -mb-[0.12em] sm:whitespace-nowrap">
            <SplitText text="Building products that feel" delay={0.4} />
          </span>
          <motion.span
            className="block whitespace-nowrap"
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
          >
            <Typewriter phrases={PHRASES} className="gradient-text" />
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.15 }}
          className="mx-auto mt-7 max-w-2xl text-balance-safe text-[15px] leading-relaxed text-muted sm:mt-8 sm:text-lg"
        >
          Turning sharp ideas into products people love to use — websites,
          3D experiences and AI tools, already out in the world for real businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
        >
          <MagneticButton href="#work">
            See the work
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
          <MagneticButton href={SHOW_PITCHES ? '#pitches' : '#about'} variant="ghost">
            {SHOW_PITCHES ? 'View the pitches' : 'How we work'}
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
