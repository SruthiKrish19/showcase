import { VideoFilm } from './VideoFilm'

export type FilmKey = 'ciniops'

/** Rendered films, served from /public. */
const REGISTRY: Record<FilmKey, { src: string; poster: string; title: string }> = {
  ciniops: {
    src: '/films/ciniops/ciniops-website.mp4',
    poster: '/films/ciniops/poster.jpg',
    title: 'the Ciniops film',
  },
}

/** The pitch film: a video that tells the story before the walkthrough shows the product. */
export function Film({ film }: { film: FilmKey }) {
  return <VideoFilm {...REGISTRY[film]} />
}
