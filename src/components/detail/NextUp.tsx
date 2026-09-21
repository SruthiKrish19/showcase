import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Accent } from '../../content/types'
import { accent } from '../../lib/accent'

type Props = {
  to: string
  eyebrow: string
  title: string
  accentKey: Accent
}

export function NextUp({ to, eyebrow, title, accentKey }: Props) {
  const a = accent(accentKey)

  return (
    <Link
      to={to}
      className="group relative block overflow-hidden border-t border-white/8 px-6 py-16 transition-colors duration-500 md:py-24"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(60% 120% at 50% 100%, ${a.hex}26, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto flex max-w-4xl items-end justify-between gap-6">
        <div>
          <span className="font-display text-xs tracking-[0.18em] text-faint uppercase">
            {eyebrow}
          </span>
          <p className="mt-3 font-display text-3xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1.5 md:text-5xl">
            {title}
          </p>
        </div>
        <ArrowRight className="mb-2 h-7 w-7 shrink-0 text-faint transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-ink md:h-9 md:w-9" />
      </div>
    </Link>
  )
}
