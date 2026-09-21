import { motion, useReducedMotion } from 'framer-motion'
import { EASE, VIEWPORT } from '../../lib/motion'
import { cn } from '../../lib/cn'

type Props = {
  text: string
  className?: string
  /** Words rendered with the gradient treatment, matched case-insensitively. */
  highlight?: string[]
  delay?: number
  stagger?: number
}

/**
 * Headline that animates in word by word. Each word gets its own
 * clipping mask so the letters rise from behind an invisible line.
 */
export function SplitText({
  text,
  className,
  highlight = [],
  delay = 0,
  stagger = 0.055,
}: Props) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const normalise = (w: string) => w.toLowerCase().replace(/[.,;:!?]/g, '')
  const wanted = new Set(highlight.map(normalise))

  if (reduced) {
    return (
      <span className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={cn(wanted.has(normalise(word)) && 'gradient-text')}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    )
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className={cn(
              'inline-block',
              wanted.has(normalise(word)) && 'gradient-text',
            )}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: { y: '0%', opacity: 1 },
            }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  )
}
