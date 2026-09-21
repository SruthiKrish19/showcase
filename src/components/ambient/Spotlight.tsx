import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Soft light that trails the cursor. Driven entirely by motion values,
 * so moving the mouse never triggers a React render.
 */
export function Spotlight() {
  const reduced = useReducedMotion()
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 })

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, x, y])

  if (reduced) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed -z-10 h-[520px] w-[520px] rounded-full opacity-40 blur-[80px]"
      style={{
        left: sx,
        top: sy,
        x: '-50%',
        y: '-50%',
        background:
          'radial-gradient(circle, rgba(124,92,255,0.5), transparent 65%)',
        mixBlendMode: 'screen',
      }}
    />
  )
}
