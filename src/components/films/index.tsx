import type { ComponentType } from 'react'
import { CiniopsFilm } from './CiniopsFilm'

export type FilmKey = 'ciniops'

const REGISTRY: Record<FilmKey, ComponentType> = {
  ciniops: CiniopsFilm,
}

/**
 * A short motion piece for a pitch. Unlike a demo it is not a loop of the
 * product in use but a told story — and it is interactive: scrub, pause,
 * jump chapters, parallax on the pointer.
 */
export function Film({ film }: { film: FilmKey }) {
  const Component = REGISTRY[film]
  return <Component />
}
