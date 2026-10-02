import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  width: number
  height: number
  children: ReactNode
}

/**
 * Renders a demo at a fixed pixel size, then scales it to fit its container.
 *
 * This is what stops the demos reading as "animation": inside the stage we
 * can use real interface measurements — 13px labels, 32px buttons, 1px
 * borders — exactly as a real app would, instead of guessing tiny sizes that
 * look like an abstract diagram.
 */
export function Stage({ width, height, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          opacity: scale ? 1 : 0,
          fontFamily:
            'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </div>
    </div>
  )
}
