import { Navigate, useParams } from 'react-router-dom'
import { getPitch, nextPitch } from '../content/pitches'
import { PitchDeck } from '../components/detail/PitchDeck'
import { NextUp } from '../components/detail/NextUp'

/** The pitch is a deck, not a page: one slide per screen, nothing to scroll. */
export default function PitchDetail() {
  const { slug } = useParams()
  const pitch = getPitch(slug)

  if (!pitch) return <Navigate to="/404" replace />

  const next = nextPitch(pitch.slug)

  return (
    <article>
      <PitchDeck key={pitch.slug} pitch={pitch} />

      {/* With a single pitch "next" would point back at this page */}
      {next.slug !== pitch.slug && (
        <NextUp
          to={`/pitch/${next.slug}`}
          eyebrow="Next pitch"
          title={next.title}
          accentKey={next.accent}
        />
      )}
    </article>
  )
}
