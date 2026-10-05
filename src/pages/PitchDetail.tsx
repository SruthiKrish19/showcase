import { Navigate, useParams } from 'react-router-dom'
import { getPitch, nextPitch } from '../content/pitches'
import { DetailHero } from '../components/detail/DetailHero'
import { BulletList, DetailSection, StepList } from '../components/detail/DetailSection'
import { NextUp } from '../components/detail/NextUp'
import {
  AskBanner,
  FactRow,
  ModuleGrid,
  ObjectionList,
  PromiseLine,
  VerbRail,
  VoiceGrid,
} from '../components/detail/PitchBlocks'
import { StageBadge } from '../components/sections/PitchCarousel'
import { Chip } from '../components/ui/Chip'
import { Reveal } from '../components/ui/Reveal'

/**
 * Reads like a deck: the promise, the facts, the problem in the users' own
 * words, what gets built, who pays and why, the objections, where it stands,
 * the plan, the ask. Every block is optional so a lighter pitch still renders.
 */
export default function PitchDetail() {
  const { slug } = useParams()
  const pitch = getPitch(slug)

  if (!pitch) return <Navigate to="/404" replace />

  const next = nextPitch(pitch.slug)

  return (
    <article>
      <DetailHero
        backTo="/#pitches"
        backLabel="All pitches"
        title={pitch.title}
        tagline={pitch.tagline}
        accentKey={pitch.accent}
        context={pitch.context}
        meta={
          <div className="flex flex-wrap items-center gap-4">
            <StageBadge stage={pitch.stage} />
            <span className="text-sm text-muted">{pitch.category}</span>
          </div>
        }
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        {/* The promise leads — a reader on a shared link decides here */}
        {pitch.promise ? (
          <PromiseLine lead={pitch.promise.lead} punch={pitch.promise.punch} />
        ) : (
          <Reveal>
            <p className="text-balance-safe text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">
              {pitch.solution}
            </p>
          </Reveal>
        )}

        {pitch.facts?.length ? (
          <div className="mt-10">
            <FactRow facts={pitch.facts} accentKey={pitch.accent} />
          </div>
        ) : null}

        <div className="mt-6">
          <DetailSection label="The set today">
            <p>{pitch.problem}</p>
            {pitch.voices?.length ? (
              <div className="pt-4">
                <VoiceGrid voices={pitch.voices} accentKey={pitch.accent} />
              </div>
            ) : null}
          </DetailSection>

          <DetailSection label="What we build">
            {pitch.verbs?.length ? (
              <div className="pb-2 text-ink">
                <VerbRail verbs={pitch.verbs} accentKey={pitch.accent} />
              </div>
            ) : null}
            <p>{pitch.solution}</p>
            {pitch.modules?.length ? (
              <div className="pt-4">
                <ModuleGrid modules={pitch.modules} accentKey={pitch.accent} />
              </div>
            ) : null}
            {pitch.roadmap?.length ? (
              <div className="pt-2">
                <h3 className="font-display text-[11px] uppercase tracking-[0.18em] text-faint">
                  Then, on the same data model
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pitch.roadmap.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
            ) : null}
          </DetailSection>

          <DetailSection label="Who it is for">
            <p>{pitch.market}</p>
          </DetailSection>

          {pitch.landscape && (
            <DetailSection label="Why nothing fits today">
              <p>{pitch.landscape}</p>
            </DetailSection>
          )}

          <DetailSection label="How it makes money">
            <p>{pitch.businessModel}</p>
          </DetailSection>

          {pitch.objections?.length ? (
            <DetailSection label="What a producer will ask">
              <ObjectionList items={pitch.objections} />
            </DetailSection>
          ) : null}

          <DetailSection label="Where it stands">
            <BulletList items={pitch.traction} />
          </DetailSection>

          {pitch.plan?.length ? (
            <DetailSection label="The plan">
              <StepList items={pitch.plan} />
            </DetailSection>
          ) : null}
        </div>

        {pitch.ask && (
          <div className="border-t border-white/6 pt-10">
            <AskBanner
              title={pitch.ask.title}
              body={pitch.ask.body}
              accentKey={pitch.accent}
              href="/#about"
            />
          </div>
        )}
      </div>

      {/* With a single pitch "next" would point back at this page */}
      {next.slug !== pitch.slug && (
        <div className="mt-12">
          <NextUp
            to={`/pitch/${next.slug}`}
            eyebrow="Next pitch"
            title={next.title}
            accentKey={next.accent}
          />
        </div>
      )}
    </article>
  )
}
