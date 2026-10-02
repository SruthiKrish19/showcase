import { lazy, Suspense, type ComponentProps } from 'react'

/**
 * three.js is a large dependency and only two of the six demos need it, so it
 * is split into its own chunk and fetched when such a demo first renders.
 */
const Studio = lazy(() =>
  import('./StudioScene').then((m) => ({ default: m.StudioScene })),
)
const Ar = lazy(() => import('./ArScene').then((m) => ({ default: m.ArScene })))

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-white/60" />
    </div>
  )
}

export function StudioScene(props: ComponentProps<typeof Studio>) {
  return (
    <Suspense fallback={<Loading />}>
      <Studio {...props} />
    </Suspense>
  )
}

export function ArScene(props: ComponentProps<typeof Ar>) {
  return (
    <Suspense fallback={<Loading />}>
      <Ar {...props} />
    </Suspense>
  )
}
