import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = {
  children: ReactNode
  /** Text shown in the browser address bar. */
  url?: string
  className?: string
}

/** Desktop browser chrome. */
export function BrowserFrame({ children, url = 'example.com', className }: Props) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]',
        className,
      )}
      style={{ backgroundColor: '#0b0b12' }}
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </span>
        <span className="ml-1 flex-1 truncate rounded-md bg-white/[0.06] px-2.5 py-1 text-[10px] text-muted">
          {url}
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

/** Phone chrome, for the demos that are inherently handheld. */
export function PhoneFrame({ children, className }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[26px] border-[5px] border-white/12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]',
        className,
      )}
      style={{ backgroundColor: '#0b0b12' }}
    >
      {/* Notch */}
      <span className="absolute left-1/2 top-0 z-20 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-white/12" />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
