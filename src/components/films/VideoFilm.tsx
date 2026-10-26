import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Play, RotateCcw, Volume2 } from 'lucide-react'

type State = 'starting' | 'needs-tap' | 'playing' | 'paused' | 'ended'

type Props = {
  src: string
  poster: string
  title: string
}

/**
 * The pitch film as a plain video — no player controls, just the picture.
 *
 * It tries to start with sound. Browsers allow that when the visit began
 * with a tap (the "Watch the demo" link); when they refuse — a shared link
 * opened cold, most iPhones — a centred button asks for the tap instead.
 * Tap the video to pause and again to carry on; at the end it offers
 * Play again. The video element's own events are the single source of
 * truth for what the overlay shows.
 */
export function VideoFilm({ src, poster, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<State>('starting')

  const play = (fromStart: boolean) => {
    const v = ref.current
    if (!v) return
    v.muted = false
    if (fromStart) v.currentTime = 0
    v.play().catch(() => setState('needs-tap'))
  }

  useEffect(() => {
    play(true)
  }, [])

  const onTap = () => {
    const v = ref.current
    if (!v) return
    if (state === 'playing') v.pause()
    else play(state === 'ended' || state === 'needs-tap')
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onTap()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={state === 'playing' ? `Pause ${title}` : `Play ${title}`}
      onClick={onTap}
      onKeyDown={onKey}
      className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] select-none"
      style={{ aspectRatio: '16 / 9' }}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        onPlaying={() => setState('playing')}
        onPause={(e) => setState(e.currentTarget.ended ? 'ended' : 'paused')}
        onEnded={() => setState('ended')}
        className="h-full w-full object-cover"
      />

      {state !== 'playing' && state !== 'starting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px] transition-opacity">
          {state === 'needs-tap' && (
            <span className="flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-105 sm:text-base">
              <Volume2 className="h-5 w-5" />
              Tap to play with sound
            </span>
          )}
          {state === 'paused' && (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
              <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
            </span>
          )}
          {state === 'ended' && (
            <span className="flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-105 sm:text-base">
              <RotateCcw className="h-5 w-5" />
              Play again
            </span>
          )}
        </div>
      )}
    </div>
  )
}
