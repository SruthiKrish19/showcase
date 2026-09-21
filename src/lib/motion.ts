import type { Transition, Variants } from 'framer-motion'

/** One easing curve for the whole site. */
export const EASE = [0.22, 1, 0.36, 1] as const

export const transition = (duration = 0.6, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
})

/** Blur + rise entrance — the signature reveal. */
export const revealVariants = (reduced: boolean): Variants => ({
  hidden: reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: reduced
    ? { opacity: 1, transition: { duration: 0.2 } }
    : { opacity: 1, y: 0, filter: 'blur(0px)' },
})

export const staggerParent = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

export const VIEWPORT = { once: true, margin: '-80px' } as const
