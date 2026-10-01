import { SectionHeading } from '../ui/SectionHeading'
import { PitchCarousel } from './PitchCarousel'

export function PitchSection() {
  return (
    <section
      id="pitches"
      className="relative scroll-mt-24 border-y border-white/5 bg-white/[0.015] py-16 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          index="02 / PITCHES"
          title="SaaS products worth building."
          highlight={['worth', 'building.']}
        >
          Product ideas at different stages, each with a real problem behind
          it and a route to revenue. The full thinking is on every page.
        </SectionHeading>

        <PitchCarousel />
      </div>
    </section>
  )
}
