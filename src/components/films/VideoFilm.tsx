import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { Maximize2, Minimize2, Play, RotateCcw, Volume2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../lib/useMediaQuery'

type State = 'starting' | 'needs-tap' | 'playing' | 'paused' | 'ended'

type Props = {
  src: string
  poster: string
  title: string
}

/** Phones and tablets — where the corner full-screen button is offered. */
const TOUCH = '(pointer: coarse)'
/** A phone turned sideways: the film takes the whole screen without asking. */
const SIDEWAYS = '(pointer: coarse) and (orientation: landscape) and (max-height: 540px)'

type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

/**
 * The pitch film as a plain video — no player controls, just the picture.
 *
 * It tries to start with sound. Browsers allow that when the visit began
 * with a tap (the "Watch the demo" link); when they refuse — a shared link
 * opened cold, most iPhones — a centred button asks for the tap instead.
 * Tap the video to pause and again to carry on; at the end it offers
 * Play again. The video element's own events are the single source of
 * truth for what the overlay shows.
 *
 * On phones a 16:9 film is small held upright, so there is a corner
 * full-screen button (Android goes landscape too; iPhone only allows its
 * own player), and turning the phone sideways fills the screen by itself.
 */
export function VideoFilm({ src, poster, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<State>('starting')
  const [full, setFull] = useState(false)
  const touch = useMediaQuery(TOUCH)
  const sideways = useMediaQuery(SIDEWAYS)

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

  useEffect(() => {
    const onChange = () => {
      const on = document.fullscreenElement === wrap.current
      setFull(on)
      if (!on) screen.orientation?.unlock?.()
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
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

  const toggleFull = (e: MouseEvent) => {
    e.stopPropagation() // the corner button must not also pause the film
    const v = ref.current as IOSVideo | null
    const box = wrap.current
    if (!v || !box) return
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {})
      return
    }
    if (state !== 'playing') play(state === 'ended' || state === 'needs-tap')
    if (box.requestFullscreen) {
      // Android and desktop: our own frame goes full screen, overlays and all
      // and turns landscape where the browser allows it (it may refuse; that's fine)
      box
        .requestFullscreen()
        .then(() => screen.orientation?.lock?.('landscape').catch(() => {}))
        .catch(() => v.webkitEnterFullscreen?.())
    } else {
      // iPhone: only the built-in player can go full screen
      v.webkitEnterFullscreen?.()
    }
  }

  const fill = full || sideways

  return (
    <div
      ref={wrap}
      role="button"
      tabIndex={0}
      aria-label={state === 'playing' ? `Pause ${title}` : `Play ${title}`}
      onClick={onTap}
      onKeyDown={onKey}
      className={cn(
        'group relative w-full cursor-pointer overflow-hidden bg-black select-none',
        fill
          ? 'h-full rounded-none border-0'
          : 'rounded-2xl border border-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]',
        // Sideways without real full screen: cover the page ourselves
        sideways && !full && 'fixed inset-0 z-[70]',
      )}
      style={fill ? undefined : { aspectRatio: '16 / 9' }}
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
        className={cn('h-full w-full', fill ? 'object-contain' : 'object-cover')}
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

      {touch && (
        <button
          onClick={toggleFull}
          aria-label={full ? 'Exit full screen' : 'Full screen'}
          className="absolute right-2.5 bottom-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white/90 backdrop-blur"
        >
          {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
