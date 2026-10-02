import { Navigate, useParams } from 'react-router-dom'
import { getPitch, nextPitch } from '../content/pitches'
import { DetailHero } from '../components/detail/DetailHero'
import { BulletList, DetailSection } from '../components/detail/DetailSection'
import { NextUp } from '../components/detail/NextUp'
import { StageBadge } from '../components/sections/PitchCarousel'
import { Reveal } from '../components/ui/Reveal'

export default function PitchDetail() {
  const { slug } = useParams()
  const pitch = getPitch(slug)

  if (!pitch) return <Navigate to="/404" replace />

  const next = nextPitch(pitch.slug)

  return (
    <article>
      <DetailHero
        backTo="/#pitches"
        backLabel="All pitches"
        title={pitch.title}
        tagline={pitch.tagline}
        accentKey={pitch.accent}
        context={pitch.context}
        meta={
          <div className="flex flex-wrap items-center gap-4">
            <StageBadge stage={pitch.stage} />
            <span className="text-sm text-muted">{pitch.category}</span>
          </div>
        }
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <Reveal>
          <p className="text-balance-safe text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">
            {pitch.solution}
          </p>
        </Reveal>

        <div className="mt-6">
          <DetailSection label="The problem">
            <p>{pitch.problem}</p>
          </DetailSection>
        </div>

        <DetailSection label="Who it is for">
          <p>{pitch.market}</p>
        </DetailSection>

        <DetailSection label="How it makes money">
          <p>{pitch.businessModel}</p>
        </DetailSection>

        <DetailSection label="Where it stands">
          <BulletList items={pitch.traction} />
        </DetailSection>
      </div>

      <div className="mt-10">
        <NextUp
          to={`/pitch/${next.slug}`}
          eyebrow="Next pitch"
          title={next.title}
          accentKey={next.accent}
        />
      </div>
    </article>
  )
}
