import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
      <span className="font-display text-[clamp(5rem,20vw,11rem)] font-semibold leading-none gradient-text">
        404
      </span>
      <p className="mt-4 max-w-sm text-muted">
        That page does not exist — it may have been renamed or never shipped.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-white"
      >
        Back home
      </Link>
    </section>
  )
}
