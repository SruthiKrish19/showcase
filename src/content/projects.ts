import type { Project } from './types'

/**
 * PLACEHOLDER CONTENT.
 * Replace each entry with real work — the layout is built to this shape,
 * so nothing but this file needs to change.
 */
export const projects: Project[] = [
  {
    slug: 'orbit-platform',
    title: 'Orbit Platform',
    tagline:
      'A micro-frontend shell that let six product teams ship independently without breaking each other.',
    year: '2025',
    role: 'Lead frontend engineer',
    stack: ['React', 'TypeScript', 'Module Federation', 'Turborepo', 'Vite'],
    accent: 'violet',
    featured: true,
    metrics: [
      { value: 6, label: 'teams shipping in parallel' },
      { value: 71, suffix: '%', label: 'faster release cycle' },
      { value: 40, suffix: 'k', label: 'monthly active users' },
    ],
    links: [{ label: 'Case study', href: '#' }],
    problem:
      'A single monolithic frontend meant every team queued behind one release train. A one-line copy change waited two weeks, and a failing test in one domain blocked everyone else from shipping.',
    approach: [
      'Mapped the monolith into six bounded domains and agreed hard contracts at every seam.',
      'Built a host shell handling routing, auth and design tokens, with remotes loaded at runtime through Module Federation.',
      'Introduced a shared component library versioned independently so teams could adopt on their own schedule.',
      'Added per-remote CI pipelines and preview deploys, so a broken remote fails alone.',
    ],
    outcome:
      'Release cadence moved from fortnightly to multiple times a day. Onboarding a new engineer to a single domain dropped from two weeks to two days.',
  },
  {
    slug: 'atlas-copilot',
    title: 'Atlas Copilot',
    tagline:
      'An in-product AI assistant that answers from your own data — and shows its working.',
    year: '2025',
    role: 'Fullstack engineer',
    stack: ['Python', 'FastAPI', 'React', 'Postgres', 'pgvector'],
    accent: 'cyan',
    featured: true,
    metrics: [
      { value: 92, suffix: '%', label: 'answers cited correctly' },
      { value: 1.2, suffix: 's', label: 'median response' },
    ],
    problem:
      'Support staff spent their day searching across four disconnected systems to answer questions that had already been answered somewhere before.',
    approach: [
      'Built an ingestion pipeline that normalises documents from every source into one chunked, embedded store.',
      'Designed a retrieval layer that ranks by recency and authority, not similarity alone.',
      'Made every answer render its sources inline, so a human can verify in one glance.',
      'Shipped a streaming React interface that stays responsive while the model works.',
    ],
    outcome:
      'Average handling time fell by a third, and the citation-first design meant the team actually trusted the answers enough to use them.',
  },
  {
    slug: 'ledger-ui',
    title: 'Ledger UI',
    tagline:
      'A design system and component library adopted across four products in one quarter.',
    year: '2024',
    role: 'Frontend engineer',
    stack: ['React', 'TypeScript', 'Radix', 'Tailwind', 'Storybook'],
    accent: 'amber',
    metrics: [
      { value: 120, suffix: '+', label: 'components shipped' },
      { value: 4, label: 'products migrated' },
    ],
    problem:
      'Four products, four button styles, four date pickers and no shared vocabulary between design and engineering.',
    approach: [
      'Audited every existing surface and collapsed 40 one-off patterns into 18 primitives.',
      'Built on accessible headless primitives so keyboard and screen-reader behaviour came for free.',
      'Published tokens as the single source of truth consumed by both Figma and code.',
      'Documented every component with live, editable Storybook examples.',
    ],
    outcome:
      'Feature teams stopped building UI from scratch. Accessibility defects dropped sharply because correctness lived in the primitive, not in each usage.',
  },
  {
    slug: 'pulse-analytics',
    title: 'Pulse Analytics',
    tagline:
      'Real-time dashboards rendering a million rows without dropping a frame.',
    year: '2024',
    role: 'Fullstack engineer',
    stack: ['React', 'D3', 'WebSockets', 'Python', 'ClickHouse'],
    accent: 'rose',
    metrics: [
      { value: 1, suffix: 'M', label: 'rows rendered live' },
      { value: 60, suffix: 'fps', label: 'sustained interaction' },
    ],
    problem:
      'The existing dashboard froze for eight seconds on load and became unusable past a hundred thousand rows — exactly the scale the biggest customers operated at.',
    approach: [
      'Moved aggregation into the database and sent the browser summaries, not raw rows.',
      'Virtualised every list and canvas-rendered the dense charts instead of using SVG nodes.',
      'Streamed deltas over WebSockets so the view updates without a refetch.',
      'Instrumented the render path so regressions surface in CI, not in production.',
    ],
    outcome:
      'Time to first meaningful paint went from eight seconds to under one, and the product finally worked for its largest accounts.',
  },
]

export const getProject = (slug?: string) =>
  projects.find((p) => p.slug === slug)

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
