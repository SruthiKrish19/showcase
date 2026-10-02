import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Flower2,
  MapPin,
  MessageCircle,
  Mic,
  Search,
  ShoppingBag,
  Star,
  Truck,
  Globe,
  Navigation,
  LayoutGrid,
  Package,
  Settings,
  Plug,
  Users,
} from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { CaptionRail } from './CaptionRail'
import { useCycle } from './useCycle'

const SAGE = '#5c7a5a'
const INK = '#1f2421'

const SCENES = [
  {
    url: 'bloomfloristry.co',
    tab: 'Bloom Floristry · Fresh flowers, Bengaluru',
    caption: 'A custom website, designed and built for one local business',
  },
  {
    url: 'pagespeed.web.dev/analysis/bloomfloristry-co',
    tab: 'PageSpeed Insights',
    caption: 'Loads in under a second — Core Web Vitals passed on mobile',
  },
  {
    url: 'google.com/search?q=florist+near+me',
    tab: 'florist near me — Google Search',
    caption: 'Ranks first locally — technical SEO and Google Business set up',
  },
  {
    url: 'bloomfloristry.co/admin/apps',
    tab: 'Apps · Bloom admin',
    caption: 'Connected to the tools the business already runs on',
  },
] as const

export function SitesDemo() {
  const scene = useCycle(SCENES.length, 5600)

  return (
    <BrowserFrame url={SCENES[scene].url} tabTitle={SCENES[scene].tab} className="h-full">
      <Stage width={760} height={500}>
        <div className="relative h-full w-full overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              {scene === 0 && <SiteScene />}
              {scene === 1 && <SpeedScene />}
              {scene === 2 && <SearchScene />}
              {scene === 3 && <AppsScene />}
            </motion.div>
          </AnimatePresence>
          <CaptionRail steps={SCENES.map((s) => s.caption)} current={scene} tint="#fb7185" />
        </div>
      </Stage>
    </BrowserFrame>
  )
}

/* ------------------------------------------------------------------ */
/* Scene 1 — the finished website, scrolled through                    */
/* ------------------------------------------------------------------ */

const PRODUCTS = [
  { img: '/demo/flor-1.jpg', name: 'Garden Roses, Blush', price: '₹1,450' },
  { img: '/demo/flor-2.jpg', name: 'Dutch Tulips', price: '₹950' },
  { img: '/demo/flor-3.jpg', name: 'The Sunday Bunch', price: '₹1,200' },
]

function SiteScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fbf9f5]" style={{ color: INK }}>
      <motion.div
        className="absolute inset-x-0 top-0"
        initial={{ y: 0 }}
        animate={{ y: [0, 0, -560, -560] }}
        transition={{ duration: 5.4, times: [0, 0.3, 0.82, 1], ease: [0.45, 0, 0.2, 1] }}
      >
        {/* Announcement bar */}
        <div className="flex items-center justify-center gap-2 py-[6px] text-[10px] text-white" style={{ backgroundColor: SAGE }}>
          <Truck className="h-3 w-3" />
          Free same-day delivery in Indiranagar &amp; Koramangala on orders before 2 pm
        </div>

        {/* Nav */}
        <header className="flex items-center justify-between px-9 py-4">
          <span className="font-serif text-[21px] tracking-tight">Bloom</span>
          <nav className="flex items-center gap-6 text-[11.5px] text-[#4a504b]">
            {['Shop', 'Weddings', 'Subscriptions', 'Workshops', 'About'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Search className="h-3.5 w-3.5 text-[#4a504b]" />
            <ShoppingBag className="h-3.5 w-3.5 text-[#4a504b]" />
            <span className="rounded-full px-3.5 py-[7px] text-[11px] font-medium text-white" style={{ backgroundColor: SAGE }}>
              Order now
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="grid grid-cols-[1fr_0.95fr] items-center gap-8 px-9 pt-3 pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a6d5b]">Bengaluru · Est. 2019</p>
            <h1 className="mt-3 font-serif text-[36px] leading-[1.05] tracking-[-0.015em]">
              Flowers that look
              <br />
              like they were picked
              <br />
              <em>for you.</em>
            </h1>
            <p className="mt-4 max-w-[300px] text-[12px] leading-relaxed text-[#5b615c]">
              Seasonal stems from local growers, hand-tied every morning in our Indiranagar studio.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="rounded-full px-4 py-[9px] text-[11.5px] font-medium text-white" style={{ backgroundColor: SAGE }}>
                Shop bouquets
              </span>
              <span className="rounded-full border border-[#1f2421]/25 px-4 py-[8px] text-[11.5px]">
                Book a wedding consult
              </span>
            </div>
            <div className="mt-5 flex items-center gap-1.5">
              <span className="flex">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} className="h-3 w-3 text-[#e8a23b]" style={{ fill: '#e8a23b' }} />
                ))}
              </span>
              <span className="text-[10.5px] text-[#5b615c]">4.9 · 212 Google reviews</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-[0_24px_50px_-24px_rgba(60,40,20,0.45)]">
            <img src="/demo/flor-hero.jpg" alt="" className="h-[262px] w-full object-cover" />
          </div>
        </section>

        {/* Feature strip */}
        <section className="mx-9 grid grid-cols-3 gap-4 border-y border-[#1f2421]/10 py-4">
          {[
            { icon: Truck, t: 'Same-day delivery', s: 'Order before 2 pm' },
            { icon: Flower2, t: 'Hand-tied each morning', s: 'Never from a cold room' },
            { icon: Calendar, t: 'Weddings & events', s: 'From intimate to 400 guests' },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9efe6]">
                <Icon className="h-3.5 w-3.5" style={{ color: SAGE }} />
              </span>
              <div>
                <p className="text-[11.5px] font-medium">{t}</p>
                <p className="text-[10px] text-[#6b716c]">{s}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Bestsellers */}
        <section className="px-9 pt-8">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-[22px]">This week’s bestsellers</h2>
            <span className="flex items-center gap-1 text-[11px] text-[#5b615c]">
              View all <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-5">
            {PRODUCTS.map((p) => (
              <div key={p.name}>
                <div className="overflow-hidden rounded-xl">
                  <img src={p.img} alt="" className="h-[190px] w-full object-cover" />
                </div>
                <div className="mt-2.5 flex items-start justify-between">
                  <div>
                    <p className="text-[12px] font-medium">{p.name}</p>
                    <p className="text-[11px] text-[#6b716c]">{p.price}</p>
                  </div>
                  <span className="rounded-full border border-[#1f2421]/20 px-2.5 py-[4px] text-[10px]">Add</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Instagram */}
        <section className="px-9 pt-9">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11.5px] text-[#5b615c]">
              <Camera className="h-3.5 w-3.5" /> @bloomfloristry · 12.4k followers
            </p>
            <span className="text-[11px] text-[#5b615c]">Follow</span>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <img key={n} src={`/demo/flor-ig-${n}.jpg`} alt="" className="aspect-square w-full rounded-md object-cover" />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-9 grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-6 px-9 pt-7 pb-8 text-[10.5px] text-[#6b716c]" style={{ backgroundColor: '#f1ede6' }}>
          <div>
            <p className="font-serif text-[17px]" style={{ color: INK }}>Bloom</p>
            <p className="mt-2 leading-relaxed">12, 100 Feet Road, Indiranagar<br />Bengaluru 560038</p>
          </div>
          <div>
            <p className="font-medium" style={{ color: INK }}>Hours</p>
            <p className="mt-2 leading-relaxed">Mon – Sat · 8 am – 8 pm<br />Sun · 9 am – 2 pm</p>
          </div>
          <div>
            <p className="font-medium" style={{ color: INK }}>Shop</p>
            <p className="mt-2 leading-relaxed">Bouquets<br />Subscriptions<br />Gift cards</p>
          </div>
          <div>
            <p className="font-medium" style={{ color: INK }}>Contact</p>
            <p className="mt-2 leading-relaxed">WhatsApp us<br />hello@bloomfloristry.co</p>
          </div>
        </footer>
      </motion.div>

      <Cursor x={236} y={300} clicking />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scene 2 — PageSpeed Insights                                        */
/* ------------------------------------------------------------------ */

function Gauge({ value, label, delay }: { value: number; label: string; delay: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[68px] w-[68px]">
        <svg viewBox="0 0 68 68" className="h-full w-full -rotate-90">
          <circle cx="34" cy="34" r={r} fill="#e6f4ea" />
          <circle cx="34" cy="34" r={r} fill="none" stroke="#e6f4ea" strokeWidth="5" />
          <motion.circle
            cx="34"
            cy="34"
            r={r}
            fill="none"
            stroke="#0cce6b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - value / 100) }}
            transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="absolute inset-0 flex items-center justify-center text-[18px] font-medium text-[#0a8a4b]"
        >
          {value}
        </motion.span>
      </div>
      <p className="mt-2 text-[10.5px] text-[#3c4043]">{label}</p>
    </div>
  )
}

function SpeedScene() {
  return (
    <div className="h-full w-full bg-white text-[#202124]">
      <header className="flex items-center justify-between border-b border-[#dadce0] px-6 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4285f4]">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-white" />
          </span>
          <span className="text-[14px] text-[#5f6368]">PageSpeed Insights</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#5f6368]">
          <span>Docs</span>
          <span className="h-6 w-6 rounded-full bg-gradient-to-br from-[#fb7185] to-[#7c5cff]" />
        </div>
      </header>

      <div className="mx-auto max-w-[640px] px-6 pt-4">
        <div className="flex items-center gap-2 rounded-md border border-[#dadce0] px-3 py-2">
          <span className="flex-1 text-[12px]">https://bloomfloristry.co/</span>
          <span className="rounded bg-[#1a73e8] px-3 py-1 text-[10.5px] font-medium text-white">Analyze</span>
        </div>

        <div className="mt-3 flex items-center gap-5 border-b border-[#dadce0] text-[11.5px]">
          <span className="border-b-2 border-[#1a73e8] pb-2 font-medium text-[#1a73e8]">Mobile</span>
          <span className="pb-2 text-[#5f6368]">Desktop</span>
        </div>

        {/* Field data */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-lg border border-[#dadce0] p-4"
        >
          <p className="text-[13px]">Discover what your real users are experiencing</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px]">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0cce6b]">
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </span>
            Core Web Vitals Assessment: <span className="font-medium text-[#0a8a4b]">Passed</span>
          </p>
          <div className="mt-3 grid grid-cols-3 gap-5">
            {[
              { k: 'Largest Contentful Paint (LCP)', v: '0.9 s' },
              { k: 'Interaction to Next Paint (INP)', v: '48 ms' },
              { k: 'Cumulative Layout Shift (CLS)', v: '0' },
            ].map((m, n) => (
              <div key={m.k}>
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] text-[#5f6368]">{m.k}</span>
                  <span className="text-[11px] font-medium text-[#0a8a4b]">{m.v}</span>
                </div>
                <div className="mt-1.5 flex h-1.5 gap-[2px] overflow-hidden rounded-full">
                  <motion.span
                    initial={{ flex: 0 }}
                    animate={{ flex: 92 }}
                    transition={{ delay: 0.3 + n * 0.1, duration: 0.8 }}
                    className="bg-[#0cce6b]"
                  />
                  <span className="bg-[#ffa400]" style={{ flex: 5 }} />
                  <span className="bg-[#ff4e42]" style={{ flex: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Lab data */}
        <section className="mt-4 rounded-lg border border-[#dadce0] p-4">
          <p className="text-[13px]">Diagnose performance issues</p>
          <div className="mt-3 flex items-start gap-6">
            <div className="grid flex-1 grid-cols-4 gap-2 pt-1">
              <Gauge value={100} label="Performance" delay={0.4} />
              <Gauge value={100} label="Accessibility" delay={0.55} />
              <Gauge value={100} label="Best Practices" delay={0.7} />
              <Gauge value={100} label="SEO" delay={0.85} />
            </div>
            {/* Phone screenshot of the site */}
            <div className="w-[82px] shrink-0 overflow-hidden rounded-md border border-[#dadce0] bg-[#fbf9f5] shadow-sm">
              <div className="h-1.5" style={{ backgroundColor: SAGE }} />
              <div className="px-2 pt-2">
                <p className="font-serif text-[8px] text-[#1f2421]">Bloom</p>
                <p className="mt-1.5 font-serif text-[7px] leading-[1.1] text-[#1f2421]">Flowers that look like they were picked for you.</p>
                <span className="mt-1.5 inline-block rounded-full px-1.5 py-[2px] text-[4.5px] text-white" style={{ backgroundColor: SAGE }}>Shop</span>
              </div>
              <img src="/demo/flor-hero.jpg" alt="" className="mt-2 h-[52px] w-full object-cover" />
            </div>
          </div>
          <p className="mt-3 text-[9.5px] text-[#5f6368]">
            Values are estimated and may vary. The performance score is calculated directly from these metrics.
          </p>
        </section>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scene 3 — Google search                                             */
/* ------------------------------------------------------------------ */

function GoogleLogo() {
  return (
    <span className="text-[20px] font-medium tracking-[-0.04em]">
      <span className="text-[#4285f4]">G</span>
      <span className="text-[#ea4335]">o</span>
      <span className="text-[#fbbc05]">o</span>
      <span className="text-[#4285f4]">g</span>
      <span className="text-[#34a853]">l</span>
      <span className="text-[#ea4335]">e</span>
    </span>
  )
}

const PLACES = [
  { name: 'Bloom Floristry', rating: '4.9', count: 212, type: 'Florist · Indiranagar', open: 'Open ⋅ Closes 8 pm', top: true },
  { name: 'Petal & Stem', rating: '4.3', count: 88, type: 'Florist · Domlur', open: 'Open ⋅ Closes 7 pm' },
  { name: 'City Flowers', rating: '4.1', count: 140, type: 'Florist · HAL 2nd Stage', open: 'Closes soon ⋅ 6 pm' },
]

function SearchScene() {
  return (
    <div className="h-full w-full bg-white text-[#202124]">
      <header className="flex items-center gap-6 px-7 pt-4">
        <GoogleLogo />
        <div className="flex w-[400px] items-center gap-3 rounded-full border border-[#dfe1e5] px-4 py-2 shadow-[0_1px_6px_rgba(32,33,36,0.18)]">
          <span className="flex-1 text-[12.5px]">florist near me</span>
          <Mic className="h-3.5 w-3.5 text-[#4285f4]" />
          <Search className="h-3.5 w-3.5 text-[#4285f4]" />
        </div>
      </header>
      <nav className="mt-3 flex gap-5 border-b border-[#ebebeb] px-[108px] text-[11px] text-[#5f6368]">
        {['All', 'Maps', 'Images', 'Shopping', 'News'].map((t, n) => (
          <span key={t} className={n === 0 ? 'border-b-[3px] border-[#1a73e8] pb-2 text-[#1a73e8]' : 'pb-2'}>
            {t}
          </span>
        ))}
      </nav>

      <div className="px-[108px] pt-3">
        <p className="text-[10px] text-[#70757a]">About 2,140 results (0.42 seconds)</p>

        {/* Local pack */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 w-[520px] rounded-lg border border-[#dadce0]"
        >
          <div className="relative h-[72px] overflow-hidden rounded-t-lg bg-[#e8eaed]">
            {/* Stylised map */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, transparent 48%, #fff 48%, #fff 52%, transparent 52%), linear-gradient(0deg, transparent 38%, #fff 38%, #fff 41%, transparent 41%), linear-gradient(30deg, transparent 60%, #fff 60%, #fff 62%, transparent 62%), radial-gradient(circle at 80% 30%, #c8e6c9 0 14px, transparent 15px)',
              }}
            />
            {[
              { x: 50, y: 42, tint: '#ea4335', main: true },
              { x: 24, y: 26 },
              { x: 71, y: 60 },
            ].map((p, n) => (
              <span
                key={n}
                className="absolute flex items-center justify-center"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-100%)' }}
              >
                <MapPin className={p.main ? 'h-5 w-5' : 'h-4 w-4'} style={{ color: p.tint ?? '#5f6368', fill: p.tint ?? '#9aa0a6' }} />
              </span>
            ))}
            <span className="absolute left-2 top-2 rounded bg-white px-1.5 py-[2px] text-[8px] text-[#3c4043] shadow">Rating · Hours</span>
          </div>
          {PLACES.map((p, n) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + n * 0.1 }}
              className="flex items-center justify-between border-t border-[#ebebeb] px-3 py-2"
            >
              <div>
                <p className={`text-[12px] ${p.top ? 'font-medium text-[#1a0dab]' : ''}`}>{p.name}</p>
                <p className="flex items-center gap-1 text-[10px] text-[#70757a]">
                  <span className="text-[#202124]">{p.rating}</span>
                  <span className="flex">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="h-2.5 w-2.5 text-[#fbbc04]" style={{ fill: '#fbbc04' }} />
                    ))}
                  </span>
                  ({p.count}) · {p.type}
                </p>
                <p className="text-[10px] text-[#188038]">{p.open}</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 rounded-full border border-[#dadce0] px-2 py-[3px] text-[9.5px] text-[#1a73e8]">
                  <Globe className="h-2.5 w-2.5" /> Website
                </span>
                <span className="flex items-center gap-1 rounded-full border border-[#dadce0] px-2 py-[3px] text-[9.5px] text-[#1a73e8]">
                  <Navigation className="h-2.5 w-2.5" /> Directions
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Organic #1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-4 w-[520px]"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e9efe6] font-serif text-[10px]" style={{ color: SAGE }}>B</span>
            <div>
              <p className="text-[11px]">Bloom Floristry</p>
              <p className="text-[9.5px] text-[#4d5156]">https://bloomfloristry.co</p>
            </div>
          </div>
          <p className="mt-1 text-[15px] text-[#1a0dab]">Bloom Floristry — Fresh Bouquets &amp; Same-Day Delivery, Bengaluru</p>
          <p className="mt-0.5 text-[11px] leading-snug text-[#4d5156]">
            Hand-tied bouquets made fresh each morning in Indiranagar. Order before 2 pm for same-day delivery. Weddings, subscriptions and workshops.
          </p>
          <div className="mt-1.5 flex gap-4 text-[10.5px] text-[#1a0dab]">
            {['Bouquets', 'Weddings', 'Subscriptions', 'Contact'].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scene 4 — connected apps                                            */
/* ------------------------------------------------------------------ */

const APPS = [
  { name: 'WhatsApp Business', note: 'Orders and enquiries open a chat', bg: '#25d366', icon: MessageCircle },
  { name: 'Razorpay', note: 'Cards, UPI and net banking at checkout', bg: '#2b63ff', glyph: '₹' },
  { name: 'Google Calendar', note: 'Consult slots sync both ways', bg: '#ffffff', icon: Calendar, iconColor: '#1a73e8', border: true },
  { name: 'Instagram', note: 'Latest posts shown on the home page', bg: 'linear-gradient(45deg,#f9ce34,#ee2a7b 55%,#6228d7)', icon: Camera },
  { name: 'Google Business Profile', note: 'Hours, reviews and map listing', bg: '#ffffff', icon: MapPin, iconColor: '#4285f4', border: true },
  { name: 'Google Analytics 4', note: 'Traffic, clicks and conversions', bg: '#ffffff', icon: BarChart3, iconColor: '#f9ab00', border: true },
]

function AppsScene() {
  return (
    <div className="flex h-full w-full bg-[#f6f7f9] text-[#1b1f23]">
      <aside className="flex w-[150px] shrink-0 flex-col border-r border-[#e3e6ea] bg-white px-3 py-4">
        <div className="flex items-center gap-2 px-2 pb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-md font-serif text-[12px] text-white" style={{ backgroundColor: SAGE }}>B</span>
          <span className="text-[12px] font-medium">Bloom admin</span>
        </div>
        {[
          { icon: LayoutGrid, l: 'Overview' },
          { icon: Package, l: 'Orders', badge: 7 },
          { icon: Calendar, l: 'Bookings', badge: 2 },
          { icon: Users, l: 'Customers' },
          { icon: Plug, l: 'Apps', active: true },
          { icon: Settings, l: 'Settings' },
        ].map(({ icon: Icon, l, badge, active }) => (
          <div key={l} className={`flex items-center gap-2 rounded-md px-2 py-[7px] text-[11.5px] ${active ? 'bg-[#eef2ee] font-medium' : 'text-[#5b6168]'}`} style={active ? { color: SAGE } : undefined}>
            <Icon className="h-3.5 w-3.5" />
            {l}
            {badge && <span className="ml-auto rounded-full bg-[#e9efe6] px-1.5 text-[9px]" style={{ color: SAGE }}>{badge}</span>}
          </div>
        ))}
      </aside>

      <div className="min-w-0 flex-1 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold">Apps &amp; integrations</h2>
            <p className="text-[10.5px] text-[#5b6168]">Everything the site is connected to. Changes sync automatically.</p>
          </div>
          <span className="rounded-md border border-[#d7dbe0] bg-white px-3 py-[6px] text-[10.5px]">Browse apps</span>
        </div>

        {/* Today strip */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-4 divide-x divide-[#e3e6ea] rounded-lg border border-[#e3e6ea] bg-white py-3"
        >
          {[
            { v: '7', l: 'orders today', s: '3 via WhatsApp' },
            { v: '₹11,850', l: 'collected', s: 'Razorpay · settled' },
            { v: '2', l: 'consults booked', s: 'added to calendar' },
            { v: '1,240', l: 'visits', s: '62% from Google' },
          ].map((k) => (
            <div key={k.l} className="px-4">
              <p className="text-[15px] font-semibold">{k.v}</p>
              <p className="text-[10px] text-[#5b6168]">{k.l}</p>
              <p className="text-[9.5px] text-[#8a9098]">{k.s}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {APPS.map((a, n) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + n * 0.07, duration: 0.4 }}
              className="rounded-lg border border-[#e3e6ea] bg-white p-3"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-[14px] font-bold text-white ${a.border ? 'border border-[#e3e6ea]' : ''}`}
                  style={{ background: a.bg }}
                >
                  {a.icon ? <a.icon className="h-4 w-4" style={{ color: a.iconColor ?? '#fff' }} /> : a.glyph}
                </span>
                <span className="relative h-[16px] w-[28px] rounded-full" style={{ backgroundColor: SAGE }}>
                  <span className="absolute right-[2px] top-[2px] h-3 w-3 rounded-full bg-white" />
                </span>
              </div>
              <p className="mt-2.5 text-[11.5px] font-medium">{a.name}</p>
              <p className="mt-0.5 text-[9.5px] leading-snug text-[#5b6168]">{a.note}</p>
              <p className="mt-2 flex items-center gap-1 text-[9.5px] text-[#188038]">
                <Check className="h-2.5 w-2.5" strokeWidth={3} /> Connected · synced 2 min ago
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <Cursor x={560} y={330} />
      <span className="absolute right-6 bottom-12 flex items-center gap-1 text-[9px] text-[#8a9098]">
        <Clock className="h-2.5 w-2.5" /> Last deploy 3 min ago
      </span>
    </div>
  )
}
