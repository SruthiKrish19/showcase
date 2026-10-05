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

/** A persona speaking in their own words. */
export type Voice = {
  role: string
  quote: string
}

/**
 * One screen of the deck. One idea each, a handful of words — the deck is
 * read standing up, not studied.
 */
export type Slide =
  | { kind: 'title'; eyebrow: string; title: string; sub: string; note?: string }
  | { kind: 'statement'; eyebrow?: string; lead?: string; punch: string; note?: string }
  | { kind: 'quotes'; eyebrow: string; title: string; quotes: Voice[] }
  | { kind: 'verbs'; eyebrow: string; title: string; verbs: { verb: string; line: string }[] }
  | {
      kind: 'cards'
      eyebrow: string
      title: string
      cards: { tag: string; title: string; body: string; dim?: boolean }[]
    }
  | { kind: 'steps'; eyebrow: string; title: string; steps: string[]; close?: string }
  | { kind: 'ask'; title: string; body: string; cta: string; href: string }

/** A SaaS product idea. */
export type Pitch = {
  slug: string
  title: string
  tagline: string
  stage: Stage
  accent: Accent
  /** Category line, e.g. "B2B SaaS \u00b7 Developer tools" */
  category: string
  /** Shown on the landing card. Two or three sentences each, no more. */
  problem: string
  solution: string
  /** The deck. */
  slides: Slide[]
}
