import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

type Props = {
  x: number
  y: number
  /** Fires the click ripple when this flips true. */
  clicking?: boolean
}

/** A pointer that moves and clicks — the strongest cue that this is a recording. */
export function Cursor({ x, y, clicking }: Props) {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 110, damping: 20, mass: 0.6 }}
      style={{ left: 0, top: 0 }}
    >
      {clicking && (
        <motion.span
          key={`${x}-${y}`}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute -left-2.5 -top-2.5 block h-6 w-6 rounded-full bg-white"
        />
      )}
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
        <path
          d="M1 1L1 15.5L4.8 12.2L7.4 18L10.2 16.8L7.6 11.2L12.5 11L1 1Z"
          fill="white"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}
