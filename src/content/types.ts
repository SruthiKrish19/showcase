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
}
