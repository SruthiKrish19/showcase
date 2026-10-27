import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getPitch } from '../content/pitches'
import { accent } from '../lib/accent'
import { ContactForm } from '../components/ContactForm'

const ROLES = [
  'Producer',
  'Executive producer',
  'Line producer / Production manager',
  'Director',
  'Assistant director',
  'Production accountant',
  'Head of department',
  'Cast or talent management',
  'Investor',
  'Other',
]

const INTERESTS = [
  { key: 'Use it on a production', note: 'Join the free beta on an upcoming schedule' },
  { key: 'Partner with us', note: 'Studios, distributors, unions or integrations' },
  { key: 'Invest', note: 'Back Ciniops at an early stage' },
] as const

/**
 * "Start a conversation": who they are, how they'd like to be involved —
 * use it, partner, invest, or any mix — and what they'd want it to solve.
 */
export default function PitchContact() {
  const { slug } = useParams()
  const pitch = getPitch(slug)

  if (!pitch) return <Navigate to="/404" replace />
  const a = accent(pitch.accent)

  return (
    <section className="relative min-h-[100svh] px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-16 sm:px-6 sm:pt-10 sm:pb-24">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${a.hex}33, transparent 70%)` }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          to={`/pitch/${pitch.slug}`}
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to the pitch
        </Link>
      </div>

      <div className="relative mx-auto mt-10 grid w-full max-w-5xl gap-10 md:mt-16 md:grid-cols-[1fr_1.2fr] md:gap-16">
        {/* Left: who this is for */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs tracking-wide text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ backgroundColor: a.hex }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: a.hex }} />
            </span>
            Free during beta · Rolling out soon
          </span>
          <h1 className="mt-6 font-display text-[clamp(2.2rem,7vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Work with {pitch.title}.
          </h1>
          <p className="mt-5 max-w-md text-balance-safe text-[15px] leading-relaxed text-muted sm:text-base">
            We're opening {pitch.title} to a small group of productions first. Whether you'd like to run it on your
            next schedule, partner with us or invest, tell us a little about yourself and we'll be in touch.
          </p>
        </div>

        {/* Right: the form, or the thank-you */}
        <ContactForm
          accent={pitch.accent}
          subject={`${pitch.title} enquiry`}
          interests={INTERESTS}
          interestsLabel="How would you like to be involved?"
          roles={ROLES}
          companyLabel="Production house or company"
          notesLabel={`What would you like ${pitch.title} to solve?`}
          notesPlaceholder="Tell us about your production, what slows your team down today, or what you'd want from it."
          extra={{ pitch: pitch.title }}
          done={
            <Link
              to={`/pitch/${pitch.slug}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-ink transition-colors hover:border-white/35 hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the pitch
            </Link>
          }
        />
      </div>
    </section>
  )
}
