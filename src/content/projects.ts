import type { Project } from './types'

/**
 * Written to be read standalone — any one of these pages may be the only
 * thing a prospective client sees.
 *
 * NUMBERS: anything in `metrics` is a claim someone may ask you to back up.
 * Entries marked TODO are estimates — replace or delete them.
 * CLIENTS: descriptions are anonymised. Swap in real sectors where you can.
 */
export const projects: Project[] = [
  {
    slug: 'showpiece-sites',
    title: 'Showpiece Sites',
    tagline:
      'Websites for businesses that look considered, load in a second, and show up first when someone searches.',
    context:
      'Custom websites for shops, service businesses and personal portfolios — designed, built, optimised for search, and connected to the tools the business already runs on.',
    year: '2024 — 2026',
    role: 'Design and build, end to end',
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Vercel'],
    accent: 'rose',
    demo: 'sites',
    featured: true,
    metrics: [
      { value: 12, suffix: '+', label: 'sites designed and shipped' }, // TODO confirm
      { value: 100, label: 'Lighthouse SEO score' }, // TODO confirm per site
      { value: 1, suffix: 's', label: 'typical load time' },
    ],
    outcome:
      'A website the business is proud to put on a card — fast, custom-designed, and built around one action: book, call, visit or buy. It ranks when someone searches locally, it takes payments and bookings without a separate system, and the owner can update it without calling anyone.',
    problem:
      'A small business has two bad options: a template that looks like a thousand others, or an agency quote that cannot be justified against the revenue. So the site stays unloved, and the customer who searched and judged in four seconds goes to the competitor whose page looked like it was made on purpose.',
    approach: [
      'Design first, from a blank page — colour, type and rhythm chosen for this business, so the result looks made rather than configured.',
      'Build the page around one action. Everything else is subordinate to it, which is what makes a small site feel confident instead of cluttered.',
      'Hand-write the front end rather than stacking plugins, so pages arrive in about a second on a phone on mobile data — which is where almost every visitor actually is.',
      'Build the technical SEO in from the start: structured data, proper meta and social tags, a clean sitemap, semantic headings and Core Web Vitals in the green. Speed is a ranking factor, so the two goals reinforce each other.',
      'Connect the site to the tools the business already uses — WhatsApp for orders, card and UPI payments, calendar bookings, the Instagram feed, Google Business for hours and reviews, and analytics — so it replaces admin rather than adding it.',
      'Hand over something editable without a retainer, so the site stays current after launch.',
    ],
    deliverables: [
      'A custom-designed, fully responsive site',
      'Copywriting shaped around the one action that matters',
      'Technical SEO: structured data, meta tags, sitemap and Core Web Vitals',
      'Third-party integrations — payments, bookings, WhatsApp, Instagram, Google Business',
      'Analytics, so you can see what visitors actually click',
      'Fast hosting, domain and SSL configured',
      'A short handover so the owner can make edits themselves',
    ],
  },
  {
    slug: 'tabletop-ar',
    title: 'Tabletop AR',
    tagline:
      'Open the camera, point it at your table, and the dish appears on it — real size, in the room, before you order.',
    context:
      'Augmented reality for restaurants. The guest opens the phone camera and the dish is placed on their actual table, at actual size, so they can see it in front of them before ordering. This is the camera experience; the sister project, Menu in 3D, is the on-screen one.',
    year: '2025',
    role: 'Design and build, end to end',
    stack: ['React', 'Three.js', 'WebXR', 'GLB / USDZ', 'AR Quick Look'],
    accent: 'amber',
    demo: 'ar-menu',
    metrics: [],
    outcome:
      'A guest scans the QR code, the camera opens, and the dish sits on the table in front of them at its real size, next to their own glass and cutlery. They can walk around it, judge the portion against the plate they will actually get, and add it to the order from the same screen. People pass the phone around the table to show each other.',
    problem:
      'A photo on a menu cannot answer the question that actually causes hesitation: how big is it, and is it enough for two. Even a 3D model on a screen has no sense of scale. Only seeing the dish on the table, beside things whose size you already know, settles it.',
    approach: [
      'Capture each dish as a 3D model and deliver it through the phone’s own built-in AR — Quick Look on iPhone, Scene Viewer on Android — so there is nothing to install.',
      'Anchor the dish to the detected table surface at true scale, so the portion reads honestly against the guest’s own glass and plate.',
      'Keep every model small enough to load in a couple of seconds over restaurant wifi, which is the constraint that kills most AR projects.',
      'Attach the commerce to the placed dish: price, portion, spice level, dietary tags and add-to-order in the same sheet.',
      'Give staff a plain editor for prices and availability, so nobody has to touch a 3D asset to change a number.',
    ],
    deliverables: [
      '3D models of each dish, exported for iOS (USDZ) and Android (GLB)',
      'A camera-based web AR experience with no app to install',
      'True-scale placement on the table, with price and portion attached',
      'Printed QR codes for tables and takeaway',
      'A staff-facing editor for prices, tags and availability',
      'Analytics on which dishes guests actually place',
    ],
  },
  {
    slug: 'menu-in-3d',
    title: 'Menu in 3D',
    tagline:
      'A menu where every dish is a 3D model on the guest’s phone — turn it, zoom in, see the plating from every side.',
    context:
      'A digital menu for phones where each dish is shown as a 3D model on screen, like a product viewer. No camera, no app: it opens from a QR code in the browser. This is the on-screen experience; the sister project, Tabletop AR, uses the camera to put the dish on the table.',
    year: '2025',
    role: 'Design and build, end to end',
    stack: ['React', 'Three.js', 'GLB', 'Draco compression', 'Vite'],
    accent: 'orange',
    demo: 'menu-3d',
    metrics: [],
    outcome:
      'The menu stops being a list of names and becomes something guests actually explore on their phone. Each dish turns on screen with its portion, price and spice level beside it, so the question that normally gets asked across the table — what does that actually look like — is answered before anyone calls a waiter.',
    problem:
      'Photographs on a menu are taken once, lit perfectly, and cropped to hide the plating. Guests have learned not to trust them, so they fall back on ordering the two dishes they already know. The rest of the menu might as well not be there.',
    approach: [
      'Capture each dish as a 3D model, lit so it reads honestly rather than flatteringly.',
      'Build a one-thumb viewer for the phone screen — drag to turn, pinch to zoom — because guests browse a menu one-handed.',
      'Compress every model hard, so a dish loads in a couple of seconds on restaurant wifi. This decides whether a 3D menu is used or abandoned.',
      'Keep the whole menu around the viewer: categories, search, dietary tags, price and add-to-order all live beside the dish.',
      'Open it from a QR code on the table. No install, no account, no camera permission.',
    ],
    deliverables: [
      '3D models of each dish, optimised for mobile',
      'A one-thumb 3D viewer that runs in the phone browser',
      'Menu structure with categories, tags and pricing',
      'QR codes for tables and takeaway',
      'A staff editor for prices and availability',
      'Analytics on which dishes guests actually open',
    ],
  },
  {
    slug: 'lesson-engine',
    title: 'Lesson Engine',
    tagline:
      'Hand it a textbook chapter and it hands back the lesson — questions, translations and diagrams included.',
    context:
      'An AI-powered learning platform used by a group of schools to turn curriculum PDFs into teaching material.',
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
      { value: 3, label: 'kinds of material generated per chapter' },
      { value: 14, label: 'pages processed in one upload' },
    ],
    outcome:
      'A teacher uploads the chapter PDF they already have and walks away. Minutes later there are comprehension questions sorted by type, a translation into the local medium of instruction, and illustrative diagrams — all waiting for a human to approve before anything reaches a classroom. The evening of prep becomes a review that takes a few minutes, and the work one teacher approves is instantly available to every teacher in the group.',
    problem:
      'Teachers spend their evenings turning a textbook chapter into something teachable: writing questions, translating for the medium of instruction, redrawing diagrams. It is hours per chapter, and it is being repeated independently by every teacher in every school teaching the same syllabus.',
    approach: [
      'Take the chapter PDF exactly as it already exists — no retyping, no special format, no new habits to learn.',
      'Run generation as background jobs on a queue, so uploading and waiting are separate things and nobody watches a spinner.',
      'Produce three different outputs from one source, because a lesson is not just a question list.',
      'Put human approval in front of everything. Nothing generated reaches a student until a teacher has signed it off — the only way this is safe to deploy in a school.',
      'Build it multi-tenant, so a group of schools shares one deployment while their content stays separate.',
    ],
    deliverables: [
      'Upload-to-lesson pipeline with progress tracking',
      'Generated question sets tagged by type',
      'Translations into the local medium of instruction',
      'Generated diagrams for visual topics',
      'Teacher review and approval workflow',
      'Multi-tenant admin for a group of schools',
    ],
  },
  {
    slug: 'formwise',
    title: 'Formwise',
    tagline:
      'Fills in dense government forms by having an ordinary conversation with you.',
    context:
      'An AI assistant for US Social Security disability paperwork — six official forms, completed by conversation.',
    year: '2025',
    role: 'Fullstack engineer',
    stack: ['React', 'Flask', 'Google Gemini', 'MongoDB', 'PyPDF', 'JWT'],
    accent: 'violet',
    demo: 'form-fill',
    metrics: [
      { value: 6, label: 'official forms supported' },
      { value: 0, label: 'passwords to remember' },
    ],
    outcome:
      'Someone answers questions the way they would say them out loud, and the official PDF fills itself in correctly behind the scenes. Facts given once are never asked for again, across any of the six forms. Every session can be abandoned and resumed — because nobody completes a disability application in one sitting, and the old process punished them for that.',
    problem:
      'A disability benefits application runs to dozens of pages of legal phrasing and lands on people at the hardest point in their lives. Most of it asks for the same handful of facts in five different ways, and a single inconsistency between forms can delay a claim by months.',
    approach: [
      'Replace the form with a conversation. Plain questions, answered in plain language, with no legal vocabulary required from the person answering.',
      'Use the AI to do the translation work — mapping a human sentence onto the correct official field in the correct official wording.',
      'Carry answers across every form, so a fact given once is never requested twice.',
      'Make every session resumable by default, since this is paperwork people step away from for days.',
      'Sign in by emailed link rather than a password, because a forgotten password is a genuine barrier for this group.',
    ],
    deliverables: [
      'Conversational intake covering six SSA forms',
      'Automatic field mapping into the official PDFs',
      'Shared answer store so facts are entered once',
      'Save, resume and progress tracking across sessions',
      'Passwordless sign-in by emailed link',
      'Correctly generated, downloadable official PDFs',
    ],
  },
  {
    slug: 'storefront-commerce',
    title: 'Storefront Commerce',
    tagline:
      'Online stores built around the three taps where most shops quietly lose the sale.',
    context:
      'Ecommerce storefronts for independent brands — product pages through to payment and order tracking.',
    year: '2024 — 2026',
    role: 'Design and build, end to end',
    stack: ['React', 'TypeScript', 'Node', 'MongoDB', 'Stripe', 'Tailwind'],
    accent: 'lime',
    demo: 'ecommerce',
    metrics: [],
    outcome:
      'A store where the product looks worth buying and the checkout does not undo it. Costs shown before the last screen, no forced account, delivery dates stated plainly, and the whole thing fast on a phone. The owner runs products, orders and payments from one place instead of three.',
    problem:
      'Most small stores lose the sale in the final three taps. The photography is good and the product is right, then checkout demands an account, hides the delivery charge until the last screen, and will not say when anything arrives. The cart is abandoned, and the owner reads it as a traffic problem.',
    approach: [
      'Design the product page to answer the questions that actually stop a purchase — size, fit, delivery date, returns — rather than burying them in a policy page.',
      'Make the path to payment the shortest it can legally be: guest checkout, all costs visible up front, no surprises on the final screen.',
      'Treat the phone as the primary device for the whole journey, not just for browsing.',
      'Connect payments, inventory and order status so the owner runs the shop from one screen.',
      'Keep the storefront fast under a full catalogue, so growth does not slow the shop down.',
    ],
    deliverables: [
      'Custom-designed storefront and product pages',
      'Guest checkout with payments integrated',
      'Inventory and order management in one place',
      'Delivery, returns and tracking wired up',
      'Analytics on where customers drop out',
    ],
  },
]

export const getProject = (slug?: string) =>
  projects.find((p) => p.slug === slug)

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
