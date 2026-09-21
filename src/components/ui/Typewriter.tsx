import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type Props = {
  phrases: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  /** How long a completed phrase holds before deleting, in ms. */
  holdTime?: number
}

/**
 * Types a phrase out, holds, deletes it, moves to the next — forever.
 * The longest phrase is rendered invisibly underneath to reserve width, so
 * the text grows outward from the centre without reflowing the page.
 */
export function Typewriter({
  phrases,
  className,
  typeSpeed = 65,
  deleteSpeed = 32,
  holdTime = 1800,
}: Props) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), '')
  const phrase = phrases[index]

  useEffect(() => {
    if (reduced) return

    // Finished typing — hold, then start deleting.
    if (!deleting && chars === phrase.length) {
      const t = setTimeout(() => setDeleting(true), holdTime)
      return () => clearTimeout(t)
    }

    // Finished deleting — advance to the next phrase.
    if (deleting && chars === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % phrases.length)
      return
    }

    const t = setTimeout(
      () => setChars((c) => c + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : typeSpeed,
    )
    return () => clearTimeout(t)
  }, [chars, deleting, phrase, phrases.length, reduced, typeSpeed, deleteSpeed, holdTime])

  if (reduced) {
    return <span className={className}>{phrases[0]}</span>
  }

  return (
    <span className="relative inline-grid" aria-label={phrases.join(', ')}>
      {/* Invisible sizer: holds the width of the longest phrase */}
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 whitespace-pre"
      >
        {longest}
      </span>

      <span
        aria-hidden
        className="col-start-1 row-start-1 justify-self-center whitespace-pre"
      >
        <span className={className}>{phrase.slice(0, chars)}</span>
        <span
          className="ml-1 inline-block w-[0.06em] translate-y-[0.08em] self-center bg-current align-middle"
          style={{
            height: '0.82em',
            animation: 'caret 1s steps(1) infinite',
          }}
        />
      </span>
    </span>
  )
}
