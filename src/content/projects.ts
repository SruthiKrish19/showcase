import type { Project } from './types'

/**
 * NOTE ON NUMBERS: every entry in `metrics` is a claim a client may ask you
 * to back up. The ones below marked TODO are placeholders — replace them with
 * figures you can evidence, or delete the metric entirely (an empty array is
 * handled everywhere).
 */
export const projects: Project[] = [
  {
    slug: 'showpiece-sites',
    title: 'Showpiece Sites',
    tagline:
      'Websites for shops, services and personal brands — the kind that make a small business look like the best one in town.',
    year: '2024 — 2026',
    role: 'Design & build',
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Vercel'],
    accent: 'rose',
    demo: 'sites',
    featured: true,
    metrics: [
      // TODO replace with real figures
      { value: 12, suffix: '+', label: 'sites designed and shipped' },
      { value: 100, label: 'Lighthouse performance score' },
    ],
    problem:
      'Most small businesses are stuck choosing between a template that looks like everyone else’s and an agency quote they cannot justify. Meanwhile the shop down the road is winning the customer who searched first and judged in four seconds.',
    approach: [
      'Start from the one thing the business needs a visitor to do — book, call, visit, buy — and build the page backwards from it.',
      'Design it custom rather than filling in a theme, so the site looks like the business instead of like a template.',
      'Build it hand-written and lightweight, so it loads instantly on a phone on mobile data, which is where most visitors actually arrive.',
      'Hand over something the owner can update themselves, without a retainer.',
    ],
    outcome:
      'Sites that load in under a second, look deliberately designed, and turn a search result into someone walking through the door.',
  },
  {
    slug: 'tabletop-ar',
    title: 'Tabletop AR',
    tagline:
      'Menus guests can see in 3D and place on their own table before they order.',
    year: '2025',
    role: 'Design & build',
    stack: ['React', 'Three.js', 'WebXR', 'GLB / USDZ', 'iOS AR Quick Look'],
    accent: 'amber',
    demo: 'ar-menu',
    metrics: [],
    problem:
      'A menu asks someone to commit money to a dish they have never seen. Photographs help, but they flatten portion size and never answer the real question — what will actually arrive at the table.',
    approach: [
      'Model each dish as a 3D asset a guest can spin, inspect and judge for size before ordering.',
      'Deliver it through the phone’s own AR, so the dish appears on the real table with no app to install — just a QR code.',
      'Keep every model small enough to load over restaurant wifi in a couple of seconds.',
      'Give staff a plain interface to swap dishes and prices without touching the 3D assets.',
    ],
    outcome:
      'Guests order with confidence instead of hesitating, and the restaurant gets a menu people hand across the table to show each other.',
  },
  {
    slug: 'lesson-engine',
    title: 'Lesson Engine',
    tagline:
      'Upload a textbook chapter and get the whole lesson back — questions, translations and diagrams — in minutes instead of evenings.',
    year: '2025 — 2026',
    role: 'Fullstack engineer',
    stack: [
      'React 19',
      'TypeScript',
      'FastAPI',
      'PostgreSQL',
      'Celery',
      'OpenAI',
      'AWS S3',
    ],
    accent: 'cyan',
    demo: 'lms',
    featured: true,
    metrics: [
      { value: 3, label: 'content types generated per chapter' },
      // TODO replace with a real figure
      { value: 90, suffix: '%', label: 'of prep time removed' },
    ],
    problem:
      'Teachers spend their evenings turning a textbook chapter into something they can actually teach from — writing comprehension questions, translating for the medium of instruction, redrawing diagrams. It is hours of work per chapter, repeated by every teacher in every school.',
    approach: [
      'Built an upload path that takes the chapter PDF as it already exists and pulls structured content out of it.',
      'Ran generation as background jobs on a queue, so a teacher can upload and walk away rather than watch a spinner.',
      'Generated three outputs from one source: comprehension questions, translations into the local medium, and illustrative diagrams.',
      'Put a review step in front of everything — nothing reaches a classroom until a human has approved it.',
      'Made it multi-tenant, so a group of schools runs on one deployment with their content kept separate.',
    ],
    outcome:
      'A chapter becomes a reviewed, ready-to-teach lesson in minutes, and the work one teacher approves is available to every teacher on the platform.',
  },
  {
    slug: 'formwise',
    title: 'Formwise',
    tagline:
      'Fills in dense government forms by having a normal conversation with you.',
    year: '2025',
    role: 'Fullstack engineer',
    stack: ['React', 'Flask', 'Google Gemini', 'MongoDB', 'PyPDF', 'JWT'],
    accent: 'violet',
    demo: 'form-fill',
    metrics: [
      { value: 6, label: 'official forms supported' },
      { value: 0, label: 'passwords to remember' },
    ],
    problem:
      'A disability benefits application runs to dozens of pages of legal phrasing, and it is handed to people at the hardest point in their lives. Most of the questions are the same facts asked five different ways, and one inconsistency can delay a claim for months.',
    approach: [
      'Replaced the form with a conversation — plain questions in plain language, answered the way someone would say it out loud.',
      'Used an AI layer to map those answers onto the correct official field in the correct official wording.',
      'Carried answers across forms, so a fact given once never has to be given again.',
      'Made every session resumable, because nobody completes this in one sitting.',
      'Used passwordless sign-in by emailed link, since a forgotten password is a real barrier for this group.',
    ],
    outcome:
      'A multi-day paperwork ordeal becomes a guided conversation that can be paused and picked up, with the official PDF generated correctly at the end.',
  },
  {
    slug: 'storefront-commerce',
    title: 'Storefront Commerce',
    tagline:
      'Online stores built to do one thing well — turn a browser into a buyer.',
    year: '2024 — 2026',
    role: 'Fullstack engineer',
    stack: ['React', 'TypeScript', 'Node', 'MongoDB', 'Stripe', 'Tailwind'],
    accent: 'lime',
    demo: 'ecommerce',
    metrics: [],
    problem:
      'Most small stores lose the sale in the last three taps. The product looks good, then checkout asks for an account, hides the delivery cost until the final screen, and the cart is abandoned.',
    approach: [
      'Designed the path from product to payment as the shortest it can legally be — guest checkout, costs shown up front.',
      'Built product pages that answer the questions that actually stop a purchase: size, delivery date, returns.',
      'Integrated payments and order tracking so the owner runs the shop from one place rather than three.',
      'Made the whole store fast on a phone, since that is where the browsing happens even when the buying does not.',
    ],
    outcome:
      'Stores where the checkout stops being the place customers quietly disappear.',
  },
]

export const getProject = (slug?: string) =>
  projects.find((p) => p.slug === slug)

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
