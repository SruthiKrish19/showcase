import type { ReactNode } from 'react'
import { Reveal } from '../ui/Reveal'

export function DetailSection({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <section className="grid gap-4 border-t border-white/6 py-10 md:grid-cols-[180px_1fr] md:gap-10 md:py-12">
      <Reveal>
        <h2 className="font-display text-xs tracking-[0.18em] text-faint uppercase md:pt-1">
          {label}
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="space-y-4 text-base leading-relaxed text-muted [&>p]:text-balance-safe">
          {children}
        </div>
      </Reveal>
    </section>
  )
}

export function StepList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 font-display text-[11px] text-faint">
            {i + 1}
          </span>
          <span className="text-balance-safe">{item}</span>
        </li>
      ))}
    </ol>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-faint" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
