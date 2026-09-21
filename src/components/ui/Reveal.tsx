import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { revealVariants, transition, VIEWPORT } from '../../lib/motion'

type Props = {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'footer'
}

/** The workhorse entrance: blur + rise, once, on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  className,
  as = 'div',
}: Props) {
  const reduced = useReducedMotion() ?? false
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      variants={revealVariants(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={transition(duration, delay)}
    >
      {children}
    </Tag>
  )
}

/** Same entrance, but as a child of a staggering parent. */
export function RevealItem({
  children,
  className,
  as = 'div',
}: Omit<Props, 'delay' | 'duration'>) {
  const reduced = useReducedMotion() ?? false
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      variants={revealVariants(reduced)}
      transition={transition(0.6)}
    >
      {children}
    </Tag>
  )
}
