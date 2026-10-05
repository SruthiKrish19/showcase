import type { DemoKey } from '../components/demos'

export type Accent = 'violet' | 'cyan' | 'amber' | 'rose' | 'lime' | 'orange'

export type Metric = {
  /** Number portion, e.g. 40 — animated as a counter */
  value: number
  /** Rendered before the number, e.g. "$" */
  prefix?: string
  /** Rendered after the number, e.g. "%" or "k" */
  suffix?: string
  label: string
}

export type Link = {
  label: string
  href: string
}

export type Project = {
  slug: string
  title: string
  /** One line. The hook — must land without any other context. */
  tagline: string
  year: string
  role: string
  stack: string[]
  accent: Accent
  /** Path under /public, or a remote URL. Falls back to a generated gradient. */
  cover?: string
  /** Simulated in-screen demo shown on the detail page and mobile card. */
  demo?: DemoKey
  featured?: boolean
  metrics: Metric[]
  links?: Link[]

  /* Detail page */
  /** One line of orientation — a shared link may be the only page seen. */
  context: string
  /** The result, stated first. This is what sells. */
  outcome: string
  /** What the work had to solve. Kept short. */
  problem: string
  /** The craft decisions that produced the result. */
  approach: string[]
  /** What the client actually ends up with. */
  deliverables: string[]
  gallery?: string[]
}

export type Stage = 'concept' | 'prototype' | 'pilot' | 'building'

/**
 * A plain stat tile. Text, not a counter, so "0" and "2–3" read exactly as
 * written and nothing gets animated into looking like market data.
 */
export type Fact = {
  value: string
  label: string
}

/** A persona speaking in their own words. */
export type Voice = {
  role: string
  quote: string
}

/** Where a module sits in the build order. */
export type ModuleStatus = 'first' | 'next' | 'roadmap'

export type PitchModule = {
  /** Short index shown on the card, e.g. "A" */
  key: string
  name: string
  /** Who uses it */
  who: string
  summary: string
  status: ModuleStatus
}

export type Objection = {
  objection: string
  answer: string
}

/** A SaaS product idea. */
export type Pitch = {
  slug: string
  title: string
  tagline: string
  stage: Stage
  accent: Accent
  /** Category line, e.g. "B2B SaaS \u00b7 Developer tools" */
  category: string

  /* Detail page */
  /** One line of orientation for an investor arriving on a shared link. */
  context: string
  problem: string
  solution: string
  market: string
  /** How the product would make money — described, not costed. */
  businessModel: string
  /** What exists today. */
  traction: string[]

  /* Presentation blocks — all optional; the page skips any that are absent. */
  /** The public one-liner, split so the second half can carry the accent. */
  promise?: { lead: string; punch: string }
  /** Structural facts about the product. Never market figures. */
  facts?: Fact[]
  /** The problem in the users' own words. */
  voices?: Voice[]
  /** The public verbs, e.g. "Snap · Approve · Export · Dispatch". */
  verbs?: string[]
  modules?: PitchModule[]
  /** What comes after the modules, as chips. */
  roadmap?: string[]
  /** Why existing tools do not fit. */
  landscape?: string
  /** What a buyer will say, and the answer. */
  objections?: Objection[]
  /** The route from here to a paying customer, as steps. */
  plan?: string[]
  ask?: { title: string; body: string }
}
