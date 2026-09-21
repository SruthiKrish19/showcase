import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Chip({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs tracking-wide text-muted backdrop-blur-md">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
      </span>
      {children}
    </span>
  )
}
