import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getPitch } from '../content/pitches'
import { accent } from '../lib/accent'
import { cn } from '../lib/cn'
import { Demo, isFluidDemo, isPhoneDemo } from '../components/demos'
import { MOBILE, useMediaQuery } from '../lib/useMediaQuery'
import { Film } from '../components/films'

type View = 'film' | 'walkthrough'

/**
 * The pitch on screen: the short film first, the product walkthrough one
 * toggle away. Fixed like the deck so the page never scrolls behind it.
 */
export default function PitchDemo() {
  const { slug } = useParams()
  const pitch = getPitch(slug)
  const [view, setView] = useState<View>('film')
  const mobile = useMediaQuery(MOBILE)

  if (!pitch) return <Navigate to="/404" replace />
  if (!pitch.demo && !pitch.film) return <Navigate to={`/pitch/${pitch.slug}`} replace />

  const a = accent(pitch.accent)
  const showing: View = pitch.film && (view === 'film' || !pitch.demo) ? 'film' : 'walkthrough'
  const both = Boolean(pitch.film && pitch.demo)

  return (
    <section
      className="fixed inset-0 z-40 flex flex-col px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6 sm:pt-10 sm:pb-8"
      aria-label={`${pitch.title} demo`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background: `radial-gradient(60% 100% at 50% 0%, ${a.hex}33, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          to="/#pitches"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          All pitches
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to={`/pitch/${pitch.slug}`}
            className={cn('inline-flex items-center gap-1.5 text-sm transition-colors hover:text-ink', a.text)}
          >
            <span className="sm:hidden">Deck</span>
            <span className="hidden sm:inline">Open the deck</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to={`/pitch/${pitch.slug}/contact`}
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-bg transition-colors hover:bg-white"
          >
            Get in touch
          </Link>
        </div>
      </div>

      {/* The frame takes all the height it can; aspect-ratio carries the
          height constraint back into the width on a narrow screen. */}
      <div className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center py-4 sm:py-6">
        {showing === 'film' && pitch.film ? (
          // A 16:9 video; its width follows the free height so it never overflows
          <div className="w-full" style={{ maxWidth: 'calc((100svh - 210px) * 16 / 9)' }}>
            <Film film={pitch.film} />
          </div>
        ) : pitch.demo ? (
          <div
            className="max-h-full max-w-full"
            style={mobile && isFluidDemo(pitch.demo) ? { width: '100%' } : {
              // A fluid demo carries its own chapter buttons under the frame
              aspectRatio: isPhoneDemo(pitch.demo) ? '312 / 632' : isFluidDemo(pitch.demo) ? '760 / 640' : '760 / 560',
              height: isPhoneDemo(pitch.demo) ? '100%' : undefined,
              width: isPhoneDemo(pitch.demo) ? undefined : '100%',
            }}
          >
            <Demo demo={pitch.demo} />
          </div>
        ) : null}
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-2 text-center">
        {both && (
          <div role="tablist" aria-label="What to watch" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {(
              [
                ['film', 'Film · 1:32'],
                ['walkthrough', 'Product walkthrough'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={showing === key}
                onClick={() => setView(key)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-300',
                  showing === key ? 'bg-ink text-bg' : 'text-muted hover:text-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <p className="text-xs text-faint">
          {showing === 'film'
            ? mobile
              ? 'Best with sound on. Turn your phone sideways for full screen.'
              : 'Best with sound on. Tap the film to pause.'
            : 'Use the arrows to move through it. Names and amounts are illustrative.'}
        </p>
      </div>
    </section>
  )
}
