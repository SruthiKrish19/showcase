import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Lock, Plus, RotateCw, Star } from 'lucide-react'
import { cn } from '../../lib/cn'

type Props = {
  children: ReactNode
  /** Address bar text. */
  url?: string
  /** Tab title — real browsers show one, and its absence is conspicuous. */
  tabTitle?: string
  className?: string
}

/**
 * Desktop browser chrome. Deliberately detailed — a bare window with three
 * grey dots reads as a diagram, whereas a tab strip, favicon, lock icon and
 * navigation controls read as a screenshot.
 */
export function BrowserFrame({
  children,
  url = 'example.com',
  tabTitle = 'Home',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/12 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]',
        className,
      )}
      style={{
        backgroundColor: '#0b0b12',
        fontFamily:
          'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Tab strip */}
      <div className="flex items-end gap-1 bg-[#17171f] px-2.5 pt-2">
        <span className="mr-1.5 flex gap-[5px] self-center pb-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-[#ff5f57]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#febc2e]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#28c840]" />
        </span>
        <span className="flex max-w-[190px] items-center gap-1.5 rounded-t-lg bg-[#24242e] px-2.5 py-1.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[3px] bg-gradient-to-br from-violet to-cyan" />
          <span className="truncate text-[10.5px] text-white/75">{tabTitle}</span>
        </span>
        <Plus className="mb-1.5 h-3 w-3 text-white/25" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-black/40 bg-[#24242e] px-2.5 py-1.5">
        <ChevronLeft className="h-3.5 w-3.5 text-white/35" />
        <ChevronRight className="h-3.5 w-3.5 text-white/18" />
        <RotateCw className="h-3 w-3 text-white/35" />
        <span className="ml-1 flex flex-1 items-center gap-1.5 rounded-md bg-[#15151c] px-2.5 py-[5px]">
          <Lock className="h-2.5 w-2.5 text-lime/70" />
          <span className="truncate text-[10.5px] text-white/60">{url}</span>
          <Star className="ml-auto h-2.5 w-2.5 text-white/25" />
        </span>
        <span className="h-4 w-4 rounded-full bg-gradient-to-br from-violet to-rose" />
      </div>

      <div className="relative">{children}</div>
    </div>
  )
}

/** Phone chrome. */
export function PhoneFrame({ children, className }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[30px] border-[6px] border-[#1c1c24] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]',
        className,
      )}
      style={{
        backgroundColor: '#0b0b12',
        fontFamily:
          'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Dynamic-island style cutout */}
      <span className="absolute left-1/2 top-2 z-30 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black" />
      {/* Home indicator */}
      <span className="absolute bottom-1.5 left-1/2 z-30 h-[3px] w-[90px] -translate-x-1/2 rounded-full bg-white/35" />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
