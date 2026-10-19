import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Drives a looping demo. Advances through `steps` on an interval and wraps.
 * With reduced motion the demo parks on its most complete state instead of
 * animating forever.
 *
 * `video` is for a walkthrough someone chose to watch: it plays even with
 * reduced motion on (parking on the last step looks like it already ran),
 * and it holds still while the tab is hidden so it starts where they left it.
 */
export function useCycle(steps: number, interval = 1600, video = false) {
  const reduced = useReducedMotion() && !video
  const [step, setStep] = useState(0)
  const [hidden, setHidden] = useState(() => video && document.hidden)

  useEffect(() => {
    if (!video) return
    const onChange = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [video])

  useEffect(() => {
    if (reduced) {
      setStep(steps - 1)
      return
    }
    if (hidden) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps), interval)
    return () => clearInterval(id)
  }, [steps, interval, reduced, hidden])

  return step
}
