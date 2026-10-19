import { useCallback, useEffect, useRef, useState } from 'react'
import { LENGTH, renderCiniopsScore } from './score'

/**
 * Plays the synthesised score in the browser, locked to the film's clock.
 *
 * Audio can't autoplay with sound, so it stays silent until the viewer hits
 * the speaker. On the first enable we build the whole score into one buffer
 * at the device's sample rate — the same math the MP4's track is baked from,
 * so what plays on the page is what's in the file.
 *
 * `t` is the film's real time; `live` is "playing and not being scrubbed".
 * A single buffer source is (re)started whenever the sound drifts from the
 * clock — which is also how a scrub, a chapter jump and the loop resync.
 */
export function useFilmAudio(t: number, live: boolean) {
  const [enabled, setEnabled] = useState(false)
  const [building, setBuilding] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const bufRef = useRef<AudioBuffer | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const srcRef = useRef<AudioBufferSourceNode | null>(null)
  const anchor = useRef({ ctxTime: 0, filmT: 0 })

  const stop = useCallback(() => {
    if (srcRef.current) {
      try { srcRef.current.stop() } catch { /* already stopped */ }
      srcRef.current.disconnect()
      srcRef.current = null
    }
  }, [])

  const startAt = useCallback((offset: number) => {
    const ctx = ctxRef.current
    const buf = bufRef.current
    if (!ctx || !buf || !gainRef.current) return
    stop()
    if (offset >= LENGTH - 0.06) return // nothing left to play (the hold)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(gainRef.current)
    src.start(0, Math.max(0, offset))
    srcRef.current = src
    anchor.current = { ctxTime: ctx.currentTime, filmT: offset }
  }, [stop])

  const toggle = useCallback(async () => {
    if (enabled) {
      setEnabled(false)
      stop()
      await ctxRef.current?.suspend()
      return
    }
    // First enable: spin up the context and bake the buffer
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctor()
      const gain = ctx.createGain()
      gain.gain.value = 0.85
      gain.connect(ctx.destination)
      ctxRef.current = ctx
      gainRef.current = gain
      setBuilding(true)
      // Yield a frame so the spinner can paint before the synth blocks us
      await new Promise((r) => setTimeout(r, 20))
      const { left, right } = renderCiniopsScore(ctx.sampleRate)
      const buf = ctx.createBuffer(2, left.length, ctx.sampleRate)
      buf.copyToChannel(left, 0)
      buf.copyToChannel(right, 1)
      bufRef.current = buf
      setBuilding(false)
    }
    await ctxRef.current.resume()
    setEnabled(true)
    startAt(t)
  }, [enabled, stop, startAt, t])

  // Keep the sound aligned to the clock every frame it is enabled.
  useEffect(() => {
    const ctx = ctxRef.current
    if (!enabled || !ctx) return
    if (!live) {
      if (ctx.state === 'running') void ctx.suspend()
      return
    }
    if (ctx.state === 'suspended') {
      void ctx.resume()
      startAt(t)
      return
    }
    const expected = anchor.current.filmT + (ctx.currentTime - anchor.current.ctxTime)
    if (!srcRef.current) {
      startAt(t)
    } else if (Math.abs(t - expected) > 0.22) {
      startAt(t) // scrub, chapter jump, or the loop wrapping to 0
    }
  }, [t, live, enabled, startAt])

  useEffect(() => () => { stop(); void ctxRef.current?.close() }, [stop])

  return { enabled, building, toggle }
}
