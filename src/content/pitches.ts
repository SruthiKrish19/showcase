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
    slug: 'ciniops',
    title: 'Ciniops',
    tagline:
      'Tag the script once — shot lists, call sheets, cash and briefs flow from it. Nobody on the receiving end creates an account.',
    stage: 'concept',
    accent: 'rose',
    category: 'Vertical SaaS · Film production',
    demo: 'ciniops',
    film: 'ciniops',
    problem:
      'A film set runs on a script nobody can search, cash bundles with handwritten vouchers, and a call sheet rebuilt every night for four WhatsApp groups. The producer sees overspend late. The AD never knows who read v3. The director won’t share the script because it leaks.',
    solution:
      'Tag the script once and shot lists, call sheets, cash and briefs flow from it. Spenders, cast and crew get a link, never an account. Money is in paise, GST, TDS and Tally. Nothing is shared wider than it needs to be.',

    slides: [
      {
        kind: 'title',
        eyebrow: 'Concept · Vertical SaaS · Film production',
        title: 'Ciniops',
        sub: 'Tag the script once. Everything on set flows from it.',
      },
      {
        kind: 'statement',
        lead: 'Shot lists, call sheets, cash, briefs —',
        punch: 'one tagged script. No logins for the people receiving them.',
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
            quote: 'I rebuild the call sheet every night for four groups. Nobody knows who read it.',
          },
          {
            role: 'Director',
            quote: 'My shot division is a photo of my notebook. And the script leaves my hands for no one.',
          },
        ],
      },
      {
        kind: 'verbs',
        eyebrow: 'What we sell',
        title: 'Four things nobody else does.',
        verbs: [
          { verb: 'Tag', line: 'the script once — scenes, props, cast and shoot days follow' },
          { verb: 'Pay', line: 'in paise, lakh and crore — GST, TDS, Tally with your own ledger names' },
          { verb: 'Book', line: 'cast dates on a link — no login, overlap at a glance' },
          { verb: 'Brief', line: 'a slice of the script behind a private link — never the whole' },
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'First round',
        title: 'Twelve screens, one spine.',
        cards: [
          { tag: 'A', title: 'Script & breakdown', body: 'Import, tag, attach scenes to shoot days.' },
          { tag: 'B', title: 'Cash on set', body: 'Wallets, one-page capture, approval bands, settle at wrap.' },
          { tag: 'C', title: 'Call sheets & links', body: 'Personal links, confirm tracking, calendar, directions.' },
          { tag: 'D', title: 'Inbox', body: 'What needs my action, per role. Empties as I act.' },
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'The leak fear',
        title: 'It sells the briefs. It blocks the script.',
        steps: [
          'Nothing leaves without a named, logged, revocable link.',
          'Briefs are view-only and watermarked. The script is never attached.',
          'Per-production isolation, data in India, delete on request.',
        ],
        close: 'The answer is on the first screen, not in a policy.',
      },
      {
        kind: 'cards',
        eyebrow: 'Who it is for',
        title: 'The buyer, the champion, the door.',
        cards: [
          { tag: 'Buyer', title: 'Producer', body: 'The money story.' },
          { tag: 'Champion', title: 'Line producer', body: 'The pain story.' },
          { tag: 'Second door', title: 'Director', body: 'Tagged script, leak-proof briefs.' },
          { tag: 'Receivers', title: 'Cast & crew', body: 'Never log in. A link.' },
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'Why nothing fits',
        title: 'We compete with free.',
        steps: [
          'WhatsApp and Sheets cost nothing — and know nothing about a scene.',
          'Studiovity does breakdown and call sheets, behind a login, without the cash.',
          'Western tools: dollars, US unions, a laptop with signal.',
        ],
        close: 'Our edge: no-login links, India-native cash, the script as the single source.',
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
        title: 'Mock. Build. Pilot.',
        steps: [
          'Twelve mock-up screens on fixture data. The team picks what survives.',
          'Build the first round end to end and put it on a phone.',
          'Two or three free pilots. Measure. Ask: would you pay for this?',
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
