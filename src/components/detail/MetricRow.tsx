import type { Metric, Accent } from '../../content/types'
import { accent } from '../../lib/accent'
import { cn } from '../../lib/cn'
import { Counter } from '../ui/Counter'
import { Reveal } from '../ui/Reveal'

export function MetricRow({
  metrics,
  accentKey,
}: {
  metrics: Metric[]
  accentKey: Accent
}) {
  if (!metrics.length) return null
  const a = accent(accentKey)

  return (
    <Reveal>
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-bg/90 px-6 py-7">
            <dd
              className={cn(
                'font-display text-4xl font-semibold tracking-tight md:text-5xl',
                a.text,
              )}
            >
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} />
            </dd>
            <dt className="mt-2 text-sm text-muted">{m.label}</dt>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
