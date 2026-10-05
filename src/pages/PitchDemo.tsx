import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getPitch } from '../content/pitches'
import { accent } from '../lib/accent'
import { cn } from '../lib/cn'
import { Demo, isPhoneDemo } from '../components/demos'

/**
 * The pitch as a screen recording: one simulated phone, as large as the
 * viewport allows, nothing else on the page. Fixed like the deck so the
 * page never scrolls behind it.
 */
export default function PitchDemo() {
  const { slug } = useParams()
  const pitch = getPitch(slug)

  if (!pitch) return <Navigate to="/404" replace />
  if (!pitch.demo) return <Navigate to={`/pitch/${pitch.slug}`} replace />

  const a = accent(pitch.accent)

  return (
    <section
      className="fixed inset-0 z-40 flex flex-col px-5 pt-20 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6 sm:pt-28 sm:pb-8"
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
      <div className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center py-5 sm:py-8">
        <div
          className="max-h-full max-w-full"
          style={{
            aspectRatio: isPhoneDemo(pitch.demo) ? '312 / 632' : '760 / 560',
            height: isPhoneDemo(pitch.demo) ? '100%' : undefined,
            width: isPhoneDemo(pitch.demo) ? undefined : '100%',
          }}
        >
          <Demo demo={pitch.demo} />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-5xl text-center">
        <p className="font-display text-sm font-semibold tracking-tight sm:text-base">
          {pitch.title} — the idea, in use
        </p>
        <p className="mt-1 text-xs text-faint">
          A simulated walkthrough. Names and amounts are illustrative.
        </p>
      </div>
    </section>
  )
}
