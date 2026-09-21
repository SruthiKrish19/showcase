import { Marquee } from '../ui/Marquee'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const STACK = [
  'React',
  'TypeScript',
  'Next.js',
  'Node',
  'Python',
  'FastAPI',
  'Postgres',
  'Module Federation',
  'Turborepo',
  'Tailwind',
  'Framer Motion',
  'AWS',
  'Docker',
  'LLM systems',
]

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <SectionHeading index="03 / ABOUT" title="How I work." />

        <div className="space-y-5 text-base leading-relaxed text-muted md:pt-20">
          <Reveal>
            <p>
              Three-plus years shipping software that real people use every
              day — the kind that has to keep working at 2am, not just look
              good in a demo.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              The work usually lands in the two places teams get stuck: helping
              several teams build one product without tripping over each other,
              and making AI features people actually trust instead of quietly
              working around.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-ink">
              A small number of projects at a time, so each one gets the whole
              of the attention. Always up for a conversation with people
              building something hard.
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.2} className="mt-16">
        <Marquee items={STACK} />
      </Reveal>
    </section>
  )
}
