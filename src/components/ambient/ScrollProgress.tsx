import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-violet via-cyan to-rose"
      style={{ scaleX }}
    />
  )
}
