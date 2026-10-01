import { AnimatePresence, motion } from 'framer-motion'
import { Phone, Search, ShoppingBag, Star } from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { useCycle } from './useCycle'

const SITES = [
  {
    url: 'bloomfloristry.co',
    brand: 'Bloom',
    tint: '#fb7185',
    nav: ['Bouquets', 'Weddings', 'Subscriptions', 'Visit us'],
    headline: 'Flowers, arranged\nthe way you’d\narrange them.',
    sub: 'Hand-tied every morning in Chennai. Same-day delivery before 2pm.',
    cta: 'Order a bouquet',
    items: [
      { name: 'Garden Rose', price: '₹1,450' },
      { name: 'Peony Bundle', price: '₹1,890' },
      { name: 'Dried Pampas', price: '₹980' },
    ],
  },
  {
    url: 'northsidebarber.in',
    brand: 'Northside',
    tint: '#fbbf24',
    nav: ['Cuts', 'Beard', 'Our barbers', 'Book'],
    headline: 'A proper cut.\nNo appointment\nanxiety.',
    sub: 'Walk in, or book a chair in under thirty seconds. Open seven days.',
    cta: 'Book a chair',
    items: [
      { name: 'Skin Fade', price: '₹450' },
      { name: 'Beard Shape', price: '₹300' },
      { name: 'Hot Towel', price: '₹600' },
    ],
  },
  {
    url: 'studiomira.design',
    brand: 'Studio Mira',
    tint: '#7c5cff',
    nav: ['Work', 'Studio', 'Journal', 'Contact'],
    headline: 'Brand design for\npeople who care\nabout the details.',
    sub: 'Independent studio. Identity, packaging and the things in between.',
    cta: 'Start a project',
    items: [
      { name: 'Kestrel Coffee', price: 'Identity' },
      { name: 'Fold Paper Co.', price: 'Packaging' },
      { name: 'Arbor Press', price: 'Web' },
    ],
  },
]

/** Three finished client sites, as if someone is flicking between them. */
export function SitesDemo() {
  const i = useCycle(SITES.length, 3400)
  const site = SITES[i]

  return (
    <BrowserFrame url={site.url} className="h-full">
      <Stage width={760} height={420}>
        <AnimatePresence mode="wait">
          <motion.div
            key={site.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full bg-[#0c0c12]"
          >
            {/* Site header */}
            <header className="flex items-center justify-between border-b border-white/8 px-7 py-4">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-black"
                  style={{ backgroundColor: site.tint }}
                >
                  {site.brand[0]}
                </span>
                <span className="text-[14px] font-semibold tracking-tight text-white">
                  {site.brand}
                </span>
              </div>
              <nav className="flex items-center gap-6">
                {site.nav.map((n) => (
                  <span key={n} className="text-[12px] text-white/55">
                    {n}
                  </span>
                ))}
                <span className="flex items-center gap-3 pl-2">
                  <Search className="h-3.5 w-3.5 text-white/40" />
                  <ShoppingBag className="h-3.5 w-3.5 text-white/40" />
                </span>
              </nav>
            </header>

            {/* Hero */}
            <div className="relative grid grid-cols-[1.15fr_1fr] gap-8 px-7 pb-6 pt-8">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="whitespace-pre-line text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-white"
                >
                  {site.headline}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-3 max-w-[280px] text-[12px] leading-relaxed text-white/50"
                >
                  {site.sub}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-5 flex items-center gap-3"
                >
                  <span
                    className="rounded-full px-4 py-2 text-[12px] font-medium text-black"
                    style={{ backgroundColor: site.tint }}
                  >
                    {site.cta}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-white/45">
                    <Phone className="h-3 w-3" />
                    Call the shop
                  </span>
                </motion.div>

                <div className="mt-6 flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star
                      key={n}
                      className="h-3 w-3"
                      style={{ color: site.tint, fill: site.tint }}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-white/40">
                    4.9 · 212 reviews
                  </span>
                </div>
              </div>

              {/* Hero image block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="relative overflow-hidden rounded-xl"
                style={{
                  background: `linear-gradient(150deg, ${site.tint}55, ${site.tint}14 55%, #15151f)`,
                }}
              >
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.25), transparent 55%)',
                  }}
                />
              </motion.div>
            </div>

            {/* Product strip */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/8 px-7 pt-5">
              {site.items.map((item, n) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + n * 0.08, duration: 0.45 }}
                >
                  <div
                    className="h-[52px] rounded-lg"
                    style={{
                      background: `linear-gradient(160deg, ${site.tint}3d, #15151f)`,
                    }}
                  />
                  <p className="mt-2 text-[11px] font-medium text-white/85">
                    {item.name}
                  </p>
                  <p className="text-[11px]" style={{ color: site.tint }}>
                    {item.price}
                  </p>
                </motion.div>
              ))}
            </div>

            <Cursor x={i === 0 ? 300 : i === 1 ? 470 : 150} y={i === 0 ? 232 : i === 1 ? 46 : 232} clicking />
          </motion.div>
        </AnimatePresence>
      </Stage>
    </BrowserFrame>
  )
}
