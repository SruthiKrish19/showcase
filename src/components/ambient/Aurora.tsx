import { useReducedMotion } from 'framer-motion'

type Blob = {
  className: string
  color: string
  animation: string
  duration: string
}

const BLOBS: Blob[] = [
  {
    className: 'left-[-15vw] top-[-10vh] h-[60vw] w-[60vw] max-h-[900px] max-w-[900px]',
    color: '#7c5cff',
    animation: 'drift-a',
    duration: '26s',
  },
  {
    className: 'right-[-20vw] top-[5vh] h-[55vw] w-[55vw] max-h-[800px] max-w-[800px]',
    color: '#22d3ee',
    animation: 'drift-b',
    duration: '32s',
  },
  {
    className: 'left-[20vw] top-[45vh] h-[45vw] w-[45vw] max-h-[700px] max-w-[700px]',
    color: '#fb7185',
    animation: 'drift-c',
    duration: '38s',
  },
]

/**
 * Fixed ambient gradient field behind everything. Blobs are pure CSS
 * keyframes so they never touch React's render loop.
 */
export function Aurora() {
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((blob) => (
        <div
          key={blob.animation}
          className={`absolute rounded-full opacity-[0.28] blur-[100px] ${blob.className}`}
          style={{
            background: `radial-gradient(circle at center, ${blob.color}, transparent 70%)`,
            mixBlendMode: 'screen',
            willChange: 'transform',
            animation: reduced
              ? undefined
              : `${blob.animation} ${blob.duration} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Vignette: keeps text legible over the brightest parts */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-bg)_95%)]" />
    </div>
  )
}
