import { Navigate, useParams } from 'react-router-dom'
import { getPitch } from '../content/pitches'
import { PitchDeck } from '../components/detail/PitchDeck'

/**
 * The pitch is a deck, not a page: one slide per screen, nothing to scroll.
 * The deck covers the viewport, so there is no "next pitch" footer here —
 * the way to another pitch is back through the landing page.
 */
export default function PitchDetail() {
  const { slug } = useParams()
  const pitch = getPitch(slug)

  if (!pitch) return <Navigate to="/404" replace />

  return <PitchDeck key={pitch.slug} pitch={pitch} />
}
