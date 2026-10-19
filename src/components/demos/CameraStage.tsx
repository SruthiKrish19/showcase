import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Props = {
  width: number
  height: number
  /** Point of interest in stage pixels — usually where the cursor is going. */
  focus: { x: number; y: number }
  /** Zoom into a window around `focus` instead of fitting the whole stage. */
  zoomed: boolean
  /** Size of the zoomed window, in stage pixels. Its shape is the box's shape. */
  view: { w: number; h: number }
  /** Drawn on top. Scales with the stage when fitted; stays full size when zoomed. */
  overlay?: ReactNode
  children: ReactNode
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Stage with a camera. Fitted, it behaves exactly like Stage: the whole demo
 * at its real pixel size, scaled to the container. Zoomed — on a phone, where
 * the fitted desktop app is too small to read — it shows a tall window onto
 * the stage and glides that window after the focus point, the way a screen
 * recording punches in on whatever is being clicked.
 */
export function CameraStage({ width, height, focus, zoomed, view, overlay, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [boxW, setBoxW] = useState(0)
  const reduced = useReducedMotion()
  // The first measured frame jumps into place; after that the camera glides.
  const settled = useRef(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setBoxW(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const vw = zoomed ? view.w : width
  const vh = zoomed ? view.h : height
  const scale = boxW ? boxW / vw : 0
  const cx = zoomed ? clamp(focus.x, vw / 2, width - vw / 2) : width / 2
  const cy = zoomed ? clamp(focus.y, vh / 2, height - vh / 2) : height / 2

  useEffect(() => {
    if (scale) settled.current = true
  }, [scale])

  const glide = zoomed && settled.current && !reduced

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${vw} / ${vh}` }}>
      <motion.div
        className="absolute left-0 top-0"
        initial={false}
        animate={{ x: -(cx - vw / 2) * scale, y: -(cy - vh / 2) * scale, scale }}
        transition={glide ? { type: 'spring', stiffness: 55, damping: 18, mass: 0.9 } : { duration: 0 }}
        style={{
          width,
          height,
          originX: 0,
          originY: 0,
          opacity: scale ? 1 : 0,
          fontFamily: 'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
        {!zoomed && overlay}
      </motion.div>
      {zoomed && overlay}
    </div>
  )
}
