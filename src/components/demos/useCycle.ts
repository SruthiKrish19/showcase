import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Drives a looping demo. Advances through `steps` on an interval and wraps.
 * With reduced motion the demo parks on its most complete state instead of
 * animating forever.
 */
export function useCycle(steps: number, interval = 1600) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduced) {
      setStep(steps - 1)
      return
    }
    const id = setInterval(() => setStep((s) => (s + 1) % steps), interval)
    return () => clearInterval(id)
  }, [steps, interval, reduced])

  return step
}
