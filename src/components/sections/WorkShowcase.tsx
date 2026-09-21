import { projects } from '../../content/projects'
import { SectionHeading } from '../ui/SectionHeading'
import { WorkPanel } from './WorkPanel'

export function WorkShowcase() {
  return (
    <section id="work" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="01 / WORK"
          title="Things built and shipped."
          highlight={['built', 'and', 'shipped.']}
        >
          Production systems with real users behind them. Each one is a short
          case study — the problem, the work, and what changed.
        </SectionHeading>
      </div>

      {/* Stacking deck: each panel pins, the next slides over it */}
      <div
        className="relative mx-auto max-w-6xl space-y-5 px-6 md:space-y-0"
        style={{ ['--stack-offset' as string]: '22px' }}
      >
        {projects.map((project, i) => (
          <WorkPanel
            key={project.slug}
            project={project}
            index={i}
            isLast={i === projects.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
