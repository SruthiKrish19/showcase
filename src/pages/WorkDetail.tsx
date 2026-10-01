import { Navigate, useParams } from 'react-router-dom'
import { getProject, nextProject } from '../content/projects'
import { DetailHero } from '../components/detail/DetailHero'
import { MetricRow } from '../components/detail/MetricRow'
import {
  DetailSection,
  StepList,
} from '../components/detail/DetailSection'
import { NextUp } from '../components/detail/NextUp'
import { Chip } from '../components/ui/Chip'
import { Reveal } from '../components/ui/Reveal'
import { CoverArt } from '../components/ui/CoverArt'
import { Demo, isPhoneDemo } from '../components/demos'

export default function WorkDetail() {
  const { slug } = useParams()
  const project = getProject(slug)

  if (!project) return <Navigate to="/404" replace />

  const next = nextProject(project.slug)

  return (
    <article>
      <DetailHero
        backTo="/#work"
        backLabel="All work"
        title={project.title}
        tagline={project.tagline}
        accentKey={project.accent}
        meta={
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <div>
              <span className="block text-xs text-faint">Year</span>
              <span className="mt-1 block">{project.year}</span>
            </div>
            <div>
              <span className="block text-xs text-faint">Role</span>
              <span className="mt-1 block">{project.role}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        {!project.demo && (
          <Reveal>
            <div className="aspect-[16/8] overflow-hidden rounded-3xl border border-white/8">
              <CoverArt
                accentKey={project.accent}
                src={project.cover}
                alt={project.title}
              />
            </div>
          </Reveal>
        )}

        {project.metrics.length > 0 && (
          <div className="mt-14">
            <MetricRow metrics={project.metrics} accentKey={project.accent} />
          </div>
        )}

        <div className="mt-6">
          <DetailSection label="The problem">
            <p>{project.problem}</p>
          </DetailSection>

          <DetailSection label="What I did">
            <StepList items={project.approach} />
          </DetailSection>

          <DetailSection label="The outcome">
            <p>{project.outcome}</p>
          </DetailSection>
        </div>

        {project.links?.length ? (
          <Reveal className="border-t border-white/6 py-10">
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-muted transition-colors hover:border-white/25 hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* Demo closes the page — the reader has the context by this point */}
        {project.demo && (
          <Reveal className="border-t border-white/6 pt-10">
            <figure>
              <figcaption className="mb-5">
                <h2 className="font-display text-xs uppercase tracking-[0.18em] text-faint">
                  See it working
                </h2>
                <p className="mt-2 text-sm text-muted">
                  A simulated walkthrough of the product — illustrative, not a
                  live instance.
                </p>
              </figcaption>
              <div
                className={
                  isPhoneDemo(project.demo)
                    ? 'mx-auto w-[230px] sm:w-[260px]'
                    : 'w-full'
                }
              >
                <Demo demo={project.demo} />
              </div>
            </figure>
          </Reveal>
        )}
      </div>

      <div className="mt-10">
        <NextUp
          to={`/work/${next.slug}`}
          eyebrow="Next project"
          title={next.title}
          accentKey={next.accent}
        />
      </div>
    </article>
  )
}
