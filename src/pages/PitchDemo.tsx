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
        <Link
          to={`/pitch/${pitch.slug}`}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm transition-colors hover:text-ink',
            a.text,
          )}
        >
          Open the deck
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* The frame takes all the height it can; aspect-ratio carries the
          height constraint back into the width on a narrow screen. */}
      <div className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center py-4 sm:py-6">
        {showing === 'film' && pitch.film ? (
          // Film plus its control bar; width follows the free height. Phones
          // get the portrait cut (9:16), everything else the 16:9 one.
          <div
            className="w-full"
            style={{ maxWidth: mobile ? 'calc((100svh - 220px) * 9 / 16)' : 'calc((100svh - 260px) * 16 / 9)' }}
          >
            <Film film={pitch.film} />
          </div>
        ) : pitch.demo ? (
          <div
            className="max-h-full max-w-full"
            style={mobile && isFluidDemo(pitch.demo) ? { width: '100%' } : {
              aspectRatio: isPhoneDemo(pitch.demo) ? '312 / 632' : '760 / 560',
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
                ['film', 'Film · 32s'],
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
            ? 'Drag the timeline, jump to a chapter, or move your mouse over it. Space pauses.'
            : 'A simulated walkthrough. Names and amounts are illustrative.'}
        </p>
      </div>
    </section>
  )
}
