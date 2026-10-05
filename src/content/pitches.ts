import type { Pitch } from './types'

/**
 * SaaS product ideas — the thinking, not the numbers.
 *
 * Numbers policy: no market, cost, leakage, time-saved or revenue figures
 * anywhere in this file. Every number is a structural fact ("crew never
 * log in") or a plan decision ("two or three pilots"). Nothing has been
 * measured yet.
 */
export const pitches: Pitch[] = [
  {
    slug: 'film-ops',
    title: 'Film Ops',
    tagline:
      'Production operations for film sets — cash, crew and call sheets tracked on a phone, not chased over WhatsApp.',
    stage: 'concept',
    accent: 'rose',
    category: 'Vertical SaaS · Film production',
    problem:
      'A film set runs on cash bundles, handwritten vouchers and a call sheet rebuilt every night for four WhatsApp groups. The producer sees overspend after the schedule has slipped. The AD never knows who read the latest version.',
    solution:
      'Snap the bill when you spend. Approve from the set. Export to Tally. Send one call sheet link per person and see who confirmed. Crew never create an account.',

    slides: [
      {
        kind: 'title',
        eyebrow: 'Concept · Vertical SaaS · Film production',
        title: 'Film Ops',
        sub: 'Production operations for film sets, on a phone.',
        note: 'Working name',
      },
      {
        kind: 'statement',
        lead: 'Every department runs on notes, calls and WhatsApp.',
        punch: 'Cash. Crew. Calls. Tracked, not chased.',
      },
      {
        kind: 'quotes',
        eyebrow: 'The set today',
        title: 'Three people, one bad week.',
        quotes: [
          {
            role: 'Producer',
            quote: 'I find out about overspend when the schedule is already blown.',
          },
          {
            role: '1st AD',
            quote: 'v2, v3 at 11 pm. Next morning people are at the old location.',
          },
          {
            role: 'Director',
            quote: 'I won’t WhatsApp the script to anyone. It leaks.',
          },
        ],
      },
      {
        kind: 'verbs',
        eyebrow: 'The product',
        title: 'One app. Four verbs.',
        verbs: [
          { verb: 'Snap', line: 'the bill, the moment you spend' },
          { verb: 'Approve', line: 'from the set, on a phone' },
          { verb: 'Export', line: 'straight into Tally' },
          { verb: 'Dispatch', line: 'one call sheet link each — see who confirmed' },
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'First build',
        title: 'Two modules that finish the loop.',
        cards: [
          {
            tag: 'A',
            title: 'On-set cash',
            body: 'Wallets, bill photos, approvals, live spend, Tally export.',
          },
          {
            tag: 'B',
            title: 'Call sheets',
            body: 'Personal links. Opened and confirmed, per name.',
          },
          {
            tag: 'C',
            title: 'Shot book',
            body: 'Scenes, shots, done on the floor.',
            dim: true,
          },
          {
            tag: 'D',
            title: 'Private briefs',
            body: 'A song situation to the composer — never the script.',
            dim: true,
          },
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Who it is for',
        title: 'The buyer, the champion, the door.',
        cards: [
          { tag: 'Buyer', title: 'Producer', body: 'The money story.' },
          { tag: 'Champion', title: 'Line producer', body: 'The pain story.' },
          { tag: 'Second door', title: 'Director', body: 'Leak-proof briefs.' },
          { tag: 'Daily users', title: 'Crew', body: 'Never log in. Form or link.' },
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'Why nothing fits',
        title: 'Built elsewhere, for someone else.',
        steps: [
          'Western tools: dollars, US unions, a laptop with signal.',
          'Indian tools: stop at pre-production planning.',
          'Expense apps: don’t know a shoot day or a wallet.',
        ],
        close: 'So the set still runs on Excel and WhatsApp.',
      },
      {
        kind: 'statement',
        eyebrow: 'How it makes money',
        punch: 'Pay per production. Unlock modules as you grow.',
        note: 'Pilots are free. Pricing comes from measured usage, not guesses.',
      },
      {
        kind: 'steps',
        eyebrow: 'The plan',
        title: 'Build. Pilot. Measure.',
        steps: [
          'Ship cash and call sheets end to end — on a phone, from a tea shop.',
          'Two or three free pilots, one schedule each. Chennai and Hyderabad.',
          'Measure, collect the quotes, ask: would you pay for this?',
        ],
      },
      {
        kind: 'ask',
        title: 'Looking for pilot productions and early partners.',
        body: 'Be in before the first pilot wraps and the pricing is set from real usage.',
        cta: 'Start a conversation',
        href: '/#about',
      },
    ],
  },
]

export const getPitch = (slug?: string) => pitches.find((p) => p.slug === slug)
