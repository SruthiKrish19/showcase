import { motion } from 'framer-motion'
import { Check, Search, ShoppingBag, Star, Truck } from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { useCycle } from './useCycle'

const PRODUCTS = [
  { name: 'Linen Overshirt', price: '₹3,480', tint: '#7c5cff' },
  { name: 'Wide-Leg Trouser', price: '₹2,950', tint: '#22d3ee' },
  { name: 'Cotton Crew Tee', price: '₹1,190', tint: '#fbbf24' },
  { name: 'Canvas Weekender', price: '₹4,600', tint: '#fb7185' },
]

export function EcommerceDemo() {
  const step = useCycle(7, 1200)
  const hovering = step >= 1
  const inBag = step >= 2
  const drawer = step >= 3
  const done = step >= 6

  return (
    <BrowserFrame url="atelier.store/collections/new-in" className="h-full">
      <Stage width={760} height={420}>
        <div className="relative h-full w-full overflow-hidden bg-[#0b0b11]">
          {/* Store header */}
          <header className="flex items-center justify-between border-b border-white/8 px-6 py-3.5">
            <div className="flex items-center gap-6">
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Atelier
              </span>
              <nav className="flex gap-5">
                {['New in', 'Clothing', 'Bags', 'Sale'].map((n) => (
                  <span key={n} className="text-[11.5px] text-white/50">
                    {n}
                  </span>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Search className="h-3.5 w-3.5 text-white/40" />
              <div className="relative">
                <ShoppingBag className="h-4 w-4 text-white/70" />
                <motion.span
                  initial={false}
                  animate={{ scale: inBag ? 1 : 0 }}
                  transition={{ type: 'spring', stiffness: 460, damping: 15 }}
                  className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet text-[8px] font-bold text-white"
                >
                  1
                </motion.span>
              </div>
            </div>
          </header>

          {/* Free shipping bar */}
          <div className="flex items-center justify-center gap-1.5 border-b border-white/8 bg-white/[0.02] py-1.5">
            <Truck className="h-3 w-3 text-lime" />
            <span className="text-[10px] text-white/50">
              Free delivery over ₹2,000 · Easy 30-day returns
            </span>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-4 gap-4 px-6 pt-5">
            {PRODUCTS.map((p, n) => {
              const focused = hovering && n === 0
              return (
                <motion.div
                  key={p.name}
                  initial={false}
                  animate={{
                    y: focused ? -4 : 0,
                    opacity: hovering && n !== 0 ? 0.45 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="relative h-[118px] overflow-hidden rounded-lg"
                    style={{
                      background: `linear-gradient(160deg, ${p.tint}4d, #15151f 70%)`,
                    }}
                  >
                    <motion.span
                      initial={false}
                      animate={{ opacity: focused ? 1 : 0, y: focused ? 0 : 6 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-x-2 bottom-2 rounded-md bg-white py-[6px] text-center text-[10px] font-medium text-black"
                    >
                      Add to bag
                    </motion.span>
                  </div>
                  <p className="mt-2 text-[11.5px] text-white/85">{p.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <p className="text-[11.5px] text-white/55">{p.price}</p>
                    <Star className="h-2.5 w-2.5 text-amber" style={{ fill: '#fbbf24' }} />
                    <span className="text-[9.5px] text-white/35">4.8</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Cart drawer */}
          <motion.aside
            initial={false}
            animate={{ x: drawer && !done ? 0 : 290 }}
            transition={{ type: 'spring', stiffness: 150, damping: 24 }}
            className="absolute right-0 top-0 h-full w-[280px] border-l border-white/10 bg-[#101018] p-4 shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.9)]"
          >
            <p className="text-[12px] font-semibold text-white">Your bag (1)</p>

            <div className="mt-3 flex gap-2.5 border-b border-white/8 pb-3">
              <div
                className="h-[54px] w-[44px] shrink-0 rounded-md"
                style={{
                  background: 'linear-gradient(160deg, #7c5cff66, #15151f)',
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-white/85">Linen Overshirt</p>
                <p className="text-[10px] text-white/40">Sand · M</p>
                <p className="mt-1 text-[11px] text-white/70">₹3,480</p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <Line label="Subtotal" value="₹3,480" />
              <Line label="Delivery" value="Free" accent />
              <div className="flex items-center justify-between pt-1.5 text-[12px] font-semibold text-white">
                <span>Total</span>
                <span>₹3,480</span>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{
                backgroundColor: step >= 5 ? '#7c5cff' : '#ffffff',
                color: step >= 5 ? '#ffffff' : '#000000',
              }}
              className="mt-4 rounded-md py-[9px] text-center text-[11.5px] font-medium"
            >
              {step >= 5 ? 'Processing…' : 'Checkout'}
            </motion.div>
            <p className="mt-2 text-center text-[9.5px] text-white/30">
              Guest checkout · no account needed
            </p>
          </motion.aside>

          {/* Confirmation */}
          <motion.div
            initial={false}
            animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.94 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
          >
            <div className="flex flex-col items-center rounded-xl border border-lime/25 bg-[#101018] px-7 py-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime/20">
                <Check className="h-5 w-5 text-lime" />
              </span>
              <p className="mt-2.5 text-[13px] font-semibold text-white">
                Order confirmed
              </p>
              <p className="mt-0.5 text-[11px] text-white/45">
                #10428 · arriving Thu 9 Oct
              </p>
            </div>
          </motion.div>

          <Cursor
            x={step >= 3 ? 600 : 95}
            y={step >= 3 ? (step >= 4 ? 330 : 120) : 240}
            clicking={step === 2 || step === 4}
          />
        </div>
      </Stage>
    </BrowserFrame>
  )
}

function Line({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-white/45">{label}</span>
      <span className={accent ? 'text-lime' : 'text-white/70'}>{value}</span>
    </div>
  )
}
