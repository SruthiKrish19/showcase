import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type Props = {
  text: string
  /** Start revealing when this flips true; resets when it flips false. */
  active: boolean
  /** Characters per tick. */
  speed?: number
  delay?: number
  className?: string
  /** Show a blinking caret while streaming. */
  caret?: boolean
}

/**
 * Reveals text a few characters at a time, the way an assistant streams a
 * reply or an autofill types into a field. Reduced motion shows it at once.
 */
export function Stream({ text, active, speed = 2, delay = 0, className, caret }: Props) {
  const reduced = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!active) {
      setN(0)
      return
    }
    if (reduced) {
      setN(text.length)
      return
    }
    let id: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      id = setInterval(() => {
        setN((c) => {
          if (c >= text.length) {
            if (id) clearInterval(id)
            return c
          }
          return c + speed
        })
      }, 24)
    }, delay)
    return () => {
      clearTimeout(start)
      if (id) clearInterval(id)
    }
  }, [active, text, speed, delay, reduced])

  const done = n >= text.length
  return (
    <span className={className}>
      {text.slice(0, n)}
      {caret && active && !done && (
        <span className="ml-[1px] inline-block h-[1em] w-[1.5px] translate-y-[2px] animate-[caret_1s_steps(1)_infinite] bg-current" />
      )}
    </span>
  )
}
