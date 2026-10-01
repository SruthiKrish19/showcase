import { SectionHeading } from '../ui/SectionHeading'
import { WorkList } from './WorkList'

export function WorkShowcase() {
  return (
    <section id="work" className="relative scroll-mt-24 py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          index="01 / WORK"
          title="Things built and shipped."
          highlight={['built', 'and', 'shipped.']}
        >
          Production systems with real users behind them. Each one is a short
          case study — the problem, the work, and what changed.
        </SectionHeading>

        <WorkList />
      </div>
    </section>
  )
}
