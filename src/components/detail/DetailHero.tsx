import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import type { Accent } from '../../content/types'
import { accent } from '../../lib/accent'
import { EASE } from '../../lib/motion'

type Props = {
  backTo: string
  backLabel: string
  title: string
  tagline: string
  accentKey: Accent
  meta?: ReactNode
}

export function DetailHero({
  backTo,
  backLabel,
  title,
  tagline,
  accentKey,
  meta,
}: Props) {
  const a = accent(accentKey)

  return (
    <header className="relative overflow-hidden px-6 pt-32 pb-14 md:pt-40 md:pb-20">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background: `radial-gradient(60% 100% at 50% 0%, ${a.hex}33, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            to={backTo}
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mt-7 font-display text-[clamp(2.2rem,6.5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
          className="mt-5 max-w-2xl text-balance-safe text-lg leading-relaxed text-muted"
        >
          {tagline}
        </motion.p>

        {meta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.28 }}
            className="mt-9"
          >
            {meta}
          </motion.div>
        )}
      </div>
    </header>
  )
}
