import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'

export type Frame = {
  /** Seconds into the film, clamped to its duration. */
  t: number
  /** Pointer position over the film, eased, -1..1 on each axis. */
  px: number
  py: number
}

/**
 * The clock behind a film. One number, `t`, drives every element, so
 * scrubbing, pausing and jumping to a chapter are all just "set t". The
 * pointer is eased in the same loop and used for parallax.
 *
 * Plays to the end, holds the last frame for `hold` seconds, then loops.
 * With reduced motion it parks on the final frame and waits to be played.
 */
export function useTimeline(duration: number, hold = 1.8) {
  const reduced = useReducedMotion() ?? false
  const [frame, setFrame] = useState<Frame>({ t: reduced ? duration : 0, px: 0, py: 0 })
  const [playing, setPlaying] = useState(!reduced)
  const playingRef = useRef(!reduced)
  const tRef = useRef(reduced ? duration : 0)
  const scrubRef = useRef(false)
  const target = useRef({ x: 0, y: 0 })
  const eased = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (playingRef.current && !scrubRef.current) {
        tRef.current += dt
        if (tRef.current > duration + hold) tRef.current = 0
      }
      eased.current.x += (target.current.x - eased.current.x) * 0.06
      eased.current.y += (target.current.y - eased.current.y) * 0.06
      setFrame({ t: Math.min(tRef.current, duration), px: eased.current.x, py: eased.current.y })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, hold])

  const seek = useCallback(
    (s: number) => {
      tRef.current = Math.max(0, Math.min(duration, s))
    },
    [duration],
  )

  const toggle = useCallback(() => {
    // Play from the end means play again
    if (!playingRef.current && tRef.current >= duration) tRef.current = 0
    playingRef.current = !playingRef.current
    setPlaying(playingRef.current)
  }, [duration])

  const startScrub = useCallback(() => {
    scrubRef.current = true
  }, [])
  const endScrub = useCallback(() => {
    scrubRef.current = false
  }, [])
  const isScrubbing = useCallback(() => scrubRef.current, [])

  const onPointer = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (reduced) return
      const r = e.currentTarget.getBoundingClientRect()
      target.current = {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: ((e.clientY - r.top) / r.height) * 2 - 1,
      }
    },
    [reduced],
  )
  const onLeave = useCallback(() => {
    target.current = { x: 0, y: 0 }
  }, [])

  // Space plays and pauses; arrows step a second. Left alone when a button
  // or link has focus so their own keys still work.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input')) return
      if (e.key === ' ') {
        e.preventDefault()
        toggle()
      }
      if (e.key === 'ArrowRight') seek(tRef.current + 1)
      if (e.key === 'ArrowLeft') seek(tRef.current - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, seek])

  return { frame, playing, toggle, seek, startScrub, endScrub, isScrubbing, onPointer, onLeave }
}

export type Timeline = ReturnType<typeof useTimeline>

/* ---------- timing helpers, shared by every film ---------- */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
/** 0 → 1 as t goes from a to b. */
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
export const mix = (a: number, b: number, p: number) => a + (b - a) * p
export const easeOut = (x: number) => 1 - (1 - x) ** 3
export const easeIn = (x: number) => x ** 3
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
/** Overshoots slightly before settling — the "pop". */
export const easeBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
}
