import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  steps: readonly string[]
  current: number
  /** Accent used for the active progress dot. */
  tint?: string
}

/**
 * The strip along the bottom of a browser demo that names what the viewer is
 * looking at. Reads like a subtitle over a screen recording.
 */
export function CaptionRail({ steps, current, tint = '#ffffff' }: Props) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-[rgba(12,12,18,0.82)] px-5 py-2.5 backdrop-blur-md">
      <span className="flex gap-1">
        {steps.map((_, n) => (
          <span
            key={n}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: n === current ? 20 : 4,
              backgroundColor: n === current ? tint : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={current}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="text-[11px] text-white/70"
        >
          {steps[current]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
