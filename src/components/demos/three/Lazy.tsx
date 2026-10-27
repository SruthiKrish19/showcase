import { Component, lazy, Suspense, type ComponentProps, type ReactNode } from 'react'

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

/**
 * Some phones can't create a WebGL context (hardware acceleration off, GPU
 * blocklisted, too many tabs). Without this the error takes the whole page
 * down; with it the demo shows its still instead. Also covers the chunk
 * failing to load.
 */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Shown in place of the scene when 3D isn't available. */
type Fallback = { fallback?: ReactNode }

export function StudioScene({ fallback = null, ...props }: ComponentProps<typeof Studio> & Fallback) {
  return (
    <SceneBoundary fallback={fallback}>
      <Suspense fallback={<Loading />}>
        <Studio {...props} />
      </Suspense>
    </SceneBoundary>
  )
}

export function ArScene({ fallback = null, ...props }: ComponentProps<typeof Ar> & Fallback) {
  return (
    <SceneBoundary fallback={fallback}>
      <Suspense fallback={<Loading />}>
        <Ar {...props} />
      </Suspense>
    </SceneBoundary>
  )
}
