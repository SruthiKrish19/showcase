import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/cn'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  className?: string
  /** How far the button leans toward the cursor, in px. */
  strength?: number
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  strength = 10,
}: Props) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength)
    y.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const base =
    'group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 select-none'

  const styles =
    variant === 'primary'
      ? 'bg-ink text-bg hover:bg-white'
      : 'glass text-ink hover:text-white'

  const Tag = (href ? motion.a : motion.button) as typeof motion.a

  return (
    <Tag
      ref={ref as never}
      href={href}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      className={cn(base, styles, className)}
    >
      {variant === 'primary' && (
        <span
          aria-hidden
          className="absolute -inset-px -z-10 rounded-full bg-gradient-to-r from-violet via-cyan to-rose opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70"
        />
      )}
      {children}
    </Tag>
  )
}
