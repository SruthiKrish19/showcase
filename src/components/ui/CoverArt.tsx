import type { Accent } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'

type Props = {
  accentKey: Accent
  src?: string
  alt: string
  /** Shown in the generated fallback when there is no image. */
  label?: string
  className?: string
}

/**
 * Project imagery. Falls back to a generated gradient field so the
 * layout looks finished before any real screenshots exist.
 */
export function CoverArt({ accentKey, src, alt, label, className }: Props) {
  const a = accent(accentKey)

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          'h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105',
          className,
        )}
      />
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        'relative h-full w-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105',
        className,
      )}
      style={{
        background: `radial-gradient(120% 120% at 20% 10%, ${a.hex}55, transparent 60%), radial-gradient(100% 100% at 85% 90%, ${a.hex}33, transparent 55%), #0b0b12`,
      }}
    >
      {/* Grid lines give the empty state some structure */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse at 30% 20%, black, transparent 75%)',
        }}
      />
      {label && (
        <span className="absolute bottom-4 right-5 font-display text-6xl font-bold text-white/[0.06]">
          {label}
        </span>
      )}
    </div>
  )
}
