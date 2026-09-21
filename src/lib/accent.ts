import type { Accent } from '../content/types'

type AccentStyle = {
  /** Raw hex, for inline gradients and shadows */
  hex: string
  text: string
  border: string
  dot: string
  /** Tailwind gradient pair used on card covers */
  gradient: string
}

export const ACCENTS: Record<Accent, AccentStyle> = {
  violet: {
    hex: '#7c5cff',
    text: 'text-violet',
    border: 'border-violet/40',
    dot: 'bg-violet',
    gradient: 'from-violet/50 via-violet/10 to-transparent',
  },
  cyan: {
    hex: '#22d3ee',
    text: 'text-cyan',
    border: 'border-cyan/40',
    dot: 'bg-cyan',
    gradient: 'from-cyan/50 via-cyan/10 to-transparent',
  },
  amber: {
    hex: '#fbbf24',
    text: 'text-amber',
    border: 'border-amber/40',
    dot: 'bg-amber',
    gradient: 'from-amber/50 via-amber/10 to-transparent',
  },
  rose: {
    hex: '#fb7185',
    text: 'text-rose',
    border: 'border-rose/40',
    dot: 'bg-rose',
    gradient: 'from-rose/50 via-rose/10 to-transparent',
  },
  lime: {
    hex: '#a3e635',
    text: 'text-lime',
    border: 'border-lime/40',
    dot: 'bg-lime',
    gradient: 'from-lime/50 via-lime/10 to-transparent',
  },
}

export const accent = (key: Accent) => ACCENTS[key]
