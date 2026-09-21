import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type Props = {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}

/** Counts up once, when scrolled into view. */
export function Counter({ value, prefix, suffix, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  const decimals = value % 1 === 0 ? 0 : 1

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(value)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // ease-out-expo, matching the site's curve
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(value * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
