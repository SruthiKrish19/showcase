import type { Pitch } from './types'

/**
 * PLACEHOLDER CONTENT.
 * SaaS product ideas — the thinking, not the numbers. Replace the copy;
 * no component changes needed.
 */
export const pitches: Pitch[] = [
  {
    slug: 'signal',
    title: 'Signal',
    tagline:
      'The knowledge layer for growing companies — an assistant that actually knows how the business works.',
    stage: 'prototype',
    accent: 'cyan',
    category: 'B2B SaaS · Knowledge management',
    problem:
      'Every growing company loses the same knowledge twice: once when it is never written down, and again when the person who knew it leaves. Wikis assume someone has time to maintain them — nobody does, so they rot within a quarter.',
    solution:
      'Signal sits passively on the tools a team already uses, extracts the decisions and reasoning buried in them, and surfaces the answer at the moment someone asks — with a citation back to the source, so it can be trusted without verification overhead.',
    market:
      'Mid-size engineering and operations teams, in the band where tribal knowledge already costs measurable time but a dedicated knowledge manager is not yet justifiable. A segment that keeps growing as teams distribute.',
    businessModel:
      'Per-seat subscription that lands in one department and expands company-wide, with margin improving as the retrieval index is shared across an organisation rather than rebuilt per team.',
    traction: [
      'Working prototype ingesting from two production sources',
      'Validated through structured discovery interviews',
      'Design partners identified for a first pilot',
    ],
  },
  {
    slug: 'harbor',
    title: 'Harbor',
    tagline:
      'The deployment control plane for teams running dozens of independently shipped frontends.',
    stage: 'concept',
    accent: 'violet',
    category: 'B2B SaaS · Developer infrastructure',
    problem:
      'Micro-frontends solved an organisational problem and created an operational one. Nobody can say which version of which remote is live, or roll a single one back, without assembling a war room. The architecture has outrun its tooling.',
    solution:
      'A control plane that treats every remote as a first-class deployable: version pinning, one-click rollback, per-remote canaries, and a dependency graph that tells you what will break before you ship rather than after.',
    market:
      'Platform teams who have adopted federated frontends and are now discovering they own a distributed system. A compounding segment, and one that adopts infrastructure tooling bottom-up rather than through long procurement.',
    businessModel:
      'Usage-based on deployments and remotes, with an enterprise tier for self-hosting and audit requirements. The platform team is both the user and the budget holder, which keeps the sales motion short.',
    traction: [
      'Architecture designed and technically validated',
      'Pain confirmed with platform leads in structured interviews',
      'Reference implementation running against a real federated app',
    ],
  },
  {
    slug: 'cadence',
    title: 'Cadence',
    tagline:
      'Clinical trial operations software built for the coordinators who actually run the trials.',
    stage: 'concept',
    accent: 'amber',
    category: 'Vertical SaaS · Clinical research',
    problem:
      'Trial coordinators spend more of their week in spreadsheets and email than with patients. The enterprise systems they are handed were designed for sponsors and auditors — the coordinator is the system’s data entry layer, not its user.',
    solution:
      'A coordinator-first workspace unifying scheduling, participant tracking and document collection in one view, pushing compliance overhead into the background where it belongs rather than onto the person doing the work.',
    market:
      'Site-level clinical research organisations — an underserved segment sitting beneath the large sponsor-facing platforms, with almost no software built for them specifically.',
    businessModel:
      'Per-site licence that scales with active trial count, sold into site networks. The retention profile typical of vertical SaaS, with expansion as networks add sites.',
    traction: [
      'Grounded in years of domain experience building clinical technology',
      'Regulatory pathway mapped with a sector advisor',
      'Coordinator workflows documented from real sites',
    ],
  },
]

export const getPitch = (slug?: string) => pitches.find((p) => p.slug === slug)

export const nextPitch = (slug: string) => {
  const i = pitches.findIndex((p) => p.slug === slug)
  return pitches[(i + 1) % pitches.length]
}
