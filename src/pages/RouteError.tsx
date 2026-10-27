/**
 * Shown instead of React Router's developer error screen when something on
 * a page throws. Plain links, not router ones: the app may be in a bad state.
 */
export default function RouteError() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <span className="font-display text-[clamp(2.5rem,10vw,5rem)] font-semibold leading-none gradient-text">
        Oops.
      </span>
      <p className="mt-4 max-w-sm text-muted">
        Something on this page didn't load on your device. Reloading usually fixes it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-white"
        >
          Reload
        </button>
        <a
          href="/"
          className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-white/35 hover:bg-white/5"
        >
          Back home
        </a>
      </div>
    </section>
  )
}
