import type { Pitch } from './types'

/**
 * SaaS product ideas — the thinking, not the numbers.
 *
 * Numbers policy: no market, cost, leakage, time-saved or revenue figures
 * anywhere in this file. Every number is a structural fact ("0 logins") or
 * a plan decision ("2–3 pilots"). Nothing has been measured yet.
 */
export const pitches: Pitch[] = [
  {
    slug: 'film-ops',
    context:
      'An early-stage vertical SaaS for South Indian film productions, heading into free pilots on real sets. Working name. Shared here for investors and pilot partners.',
    title: 'Film Ops',
    tagline:
      'Production operations for film sets — cash, crew and call sheets tracked on a phone, not chased over WhatsApp.',
    stage: 'concept',
    accent: 'rose',
    category: 'Vertical SaaS · Film production',

    promise: {
      lead: 'Every department runs on notes, calls and WhatsApp.',
      punch: 'Cash. Crew. Calls. Tracked, not chased.',
    },

    facts: [
      { value: '0', label: 'logins for crew — spenders get a form, everyone else a link' },
      { value: '1', label: 'data model every module grows on' },
      { value: '4', label: 'modules in the first build, cash first' },
      { value: '2–3', label: 'free pilot productions, one schedule each' },
    ],

    problem:
      'A mid-budget film set runs on cash bundles handed out each morning, handwritten vouchers that come back a week later, and a call sheet rebuilt every night and posted to four WhatsApp groups. The producer learns about overspend after the schedule has slipped. The AD has no idea who read the latest version. The director briefs the composer verbally because sending the script anywhere means it leaks.',

    voices: [
      {
        role: 'Producer',
        quote:
          'I find out about overspend when the schedule is already blown. I want to open my phone, see this week’s spend, who is holding my cash right now, and tap through to the bill.',
      },
      {
        role: 'Line producer',
        quote:
          'I hand out bundles every morning and chase vouchers for a week. Half are handwritten slips from a tea shop.',
      },
      {
        role: '1st AD',
        quote:
          'Every night I rebuild it, export PDF, post to four groups. At 11 pm the location changes and there’s a v2, a v3. Next morning people are at the old location.',
      },
      {
        role: 'Director',
        quote:
          'My shot division is a photo of my notebook. I won’t WhatsApp the script to anyone — it leaks. I want to send the music director the situation, the mood, two references, and nothing else — and know he opened it.',
      },
      {
        role: 'Spot boy',
        quote:
          'I’m given cash in the morning. Slips go in my shirt pocket. I’m not opening a laptop. Don’t make me log in with an email.',
      },
      {
        role: 'Actor',
        quote:
          'Just tell me where and when, and give me only my scenes and my lines, not a 60-page PDF.',
      },
    ],

    solution:
      'One phone-first product for the whole chain. A department head snaps the bill the moment they spend; the line producer approves from the set; the accountant exports straight into Tally; the AD publishes one call sheet link per person and sees who opened and who confirmed. Crew never create an account — spenders get a one-page form, everyone else gets a link.',

    verbs: ['Snap', 'Approve', 'Export', 'Dispatch'],

    modules: [
      {
        key: 'A',
        name: 'On-set cash & expenses',
        who: 'Line producer · department heads · accountant',
        summary:
          'A wallet per person. One-page expense form with the bill photo, works offline. Approvals on the phone, with a threshold that routes big spend to the producer. Live spend by department, drill to the receipt. Tally-ready export and a period lock.',
        status: 'first',
      },
      {
        key: 'B',
        name: 'Call sheets & daily report',
        who: '1st AD · cast and crew',
        summary:
          'Build, version and publish. One personal link per person that always shows the latest, with an "updated" banner. Sent, opened and confirmed per name, and a "call the rest" list. Planned-vs-covered at wrap.',
        status: 'first',
      },
      {
        key: 'C',
        name: 'Director’s shot book',
        who: 'Director · ADs · DOP',
        summary:
          'Scenes, then shots, marked done on the floor. Attach scenes to a shoot day and the call sheet and daily report fill themselves in.',
        status: 'next',
      },
      {
        key: 'D',
        name: 'Briefs & private links',
        who: 'Director · music director · actors',
        summary:
          'A song situation to the composer, an actor’s own scenes to the actor — a scoped slice behind a signed, expiring, view-only link. Never the whole script.',
        status: 'next',
      },
    ],

    roadmap: [
      'Budget top sheet',
      'Wage roll with union slabs',
      'Continuity & take log',
      'Script breakdown',
      'Look boards',
      'Tamil & Telugu UI',
      'AI pre-viz',
    ],

    market:
      'Mid-budget and independent productions in Chennai and Hyderabad, where the line producer holds the cash and the whole set is on WhatsApp. The buyer is the producer — the money story. The champion is the line producer — the pain story. The director is the second door: the shot book and leak-proof briefs make it feel like software for cinema, not for accounting. Daily users are department heads and crew, so it is effortless or it dies.',

    landscape:
      'Western tools — Movie Magic, StudioBinder, Yamdu — price in dollars, encode US union and tax rules, and assume a laptop with signal. Indian tools cover pre-production planning but stop before cash on set, dispatch tracking or need-to-know creative exchange. Generic expense apps read receipts but know nothing about a shoot day, a wallet or a department. So the set still runs on Excel, paper vouchers and WhatsApp.',

    businessModel:
      'Per-production subscription with module-level entitlements on one shared data model — cash and call sheets first, with shot book, briefs, wage roll and budgeting unlocking on the same account as a production grows into them. Pilots are free. Pricing is set after the pilots have measured what each module is worth to a production, not before.',

    objections: [
      {
        objection: 'My PM already does this in Excel.',
        answer:
          'Excel doesn’t know who holds the cash right now, and has no photo. Run both for one schedule, free.',
      },
      {
        objection: 'Crew won’t use apps.',
        answer:
          'Crew never log in. Spenders get a one-page form; everyone else gets a link.',
      },
      {
        objection: 'No network on location.',
        answer: 'Expense capture works offline and syncs later.',
      },
      {
        objection: 'I don’t want my spend or my script in the cloud.',
        answer:
          'Per-production isolation, data stored in AWS Mumbai, private links that expire and can be revoked, export any time, delete on request.',
      },
      {
        objection: 'What does it cost?',
        answer:
          'Nothing for the pilot. Pricing comes after we have learned what it is worth to you.',
      },
    ],

    traction: [
      'Scope decided and cut to an end-to-end first build: shared core, on-set cash, call sheets — with shot book and briefs next in line',
      'Every role on a production mapped, with what hurts today and the feature that answers it',
      'Measurement plan agreed before the first line of code: capture rate, submit-to-approve time, cash-to-reconciled time, call sheet versions, open and confirm rates',
      'Architecture chosen: multi-tenant modular monolith, PWA with offline capture, data in AWS Mumbai',
      'Pilot plan: two or three productions, free, one schedule each, onboarded in person',
    ],

    plan: [
      'Build the shared core — productions, people, invite links, shoot days, audit trail and the signed-link service everything else reuses',
      'Ship on-set cash end to end and put it on a phone: submit a real expense from a tea shop',
      'Ship call sheets with personal links and confirm tracking, then the shot book and the first song brief',
      'Run two or three free pilots, one schedule each, one in Chennai and one in Hyderabad, onboarded in person',
      'Report what the pilots measured, collect the quotes, and ask every production one plain question: would you pay for this?',
    ],

    ask: {
      title: 'Looking for pilot productions and early partners.',
      body:
        'Two or three productions willing to run one schedule on it for free, and investors who want to be in before the first pilot wraps and the pricing is set from real usage.',
    },
  },
]

export const getPitch = (slug?: string) => pitches.find((p) => p.slug === slug)

export const nextPitch = (slug: string) => {
  const i = pitches.findIndex((p) => p.slug === slug)
  return pitches[(i + 1) % pitches.length]
}
