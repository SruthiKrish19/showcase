import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Heart, Lock, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Truck, User, X } from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { CaptionRail } from './CaptionRail'
import { Stream } from './Stream'
import { useCycle } from './useCycle'

const PRODUCTS = [
  { img: '/demo/shop-tee.jpg', name: 'Heavyweight Crew Tee', price: '₹1,190', colours: 3 },
  { img: '/demo/shop-bomber.jpg', name: 'Nylon Bomber Jacket', price: '₹4,290', colours: 2, tag: 'New' },
  { img: '/demo/shop-denim.jpg', name: 'Selvedge Straight Jean', price: '₹3,450', colours: 2 },
  { img: '/demo/shop-bag.jpg', name: 'Top-Handle Leather Bag', price: '₹5,900', colours: 4, tag: 'Few left' },
]

const CAPTIONS = [
  'A storefront that loads instantly and lets the photography sell',
  'Quick add — choose a size without leaving the grid',
  'The bag: totals, free shipping threshold and returns in one view',
  'Checkout built for India — UPI, cards or cash on delivery, no account needed',
  'Order confirmed, with tracking and the receipt emailed',
]

export function EcommerceDemo() {
  const step = useCycle(10, 1350)
  const hovering = step >= 1 && step <= 3
  const added = step >= 2
  const drawer = step === 3
  const phase: 'shop' | 'checkout' | 'done' = step <= 3 ? 'shop' : step <= 7 ? 'checkout' : 'done'
  const caption = step === 0 ? 0 : step <= 2 ? 1 : step === 3 ? 2 : step <= 7 ? 3 : 4

  const url = phase === 'shop' ? 'atelier.in/collections/new-in' : phase === 'checkout' ? 'atelier.in/checkout' : 'atelier.in/orders/ATL-10428'
  const tab = phase === 'shop' ? 'New in — ATELIER' : phase === 'checkout' ? 'Checkout — ATELIER' : 'Order confirmed — ATELIER'

  return (
    <BrowserFrame url={url} tabTitle={tab} className="h-full">
      <Stage width={760} height={500}>
        <div className="relative h-full w-full overflow-hidden bg-white text-[#141414]">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {phase === 'shop' && <Shop hovering={hovering} added={added} drawer={drawer} step={step} />}
              {phase === 'checkout' && <Checkout step={step} />}
              {phase === 'done' && <Confirmed />}
            </motion.div>
          </AnimatePresence>

          <Cursor
            x={step === 0 ? 420 : step === 1 ? 283 : step === 2 ? 268 : step === 3 ? 620 : step <= 6 ? 220 : step === 7 ? 220 : 380}
            y={step === 0 ? 180 : step === 1 ? 236 : step === 2 ? 298 : step === 3 ? 352 : step <= 6 ? 330 : step === 7 ? 418 : 392}
            clicking={step === 2 || step === 3 || step === 7}
          />
          <CaptionRail steps={CAPTIONS} current={caption} tint="#a3e635" />
        </div>
      </Stage>
    </BrowserFrame>
  )
}

/* ------------------------------------------------------------------ */

function StoreHeader({ count }: { count: number }) {
  return (
    <>
      <div className="flex items-center justify-center gap-2 bg-[#141414] py-[6px] text-[10px] text-white">
        <Truck className="h-3 w-3" /> Free shipping over ₹2,000 · 30-day returns · Made in India
      </div>
      <header className="flex items-center justify-between border-b border-[#ececec] px-7 py-3.5">
        <nav className="flex gap-5 text-[11px] text-[#444]">
          {['New in', 'Women', 'Men', 'Bags', 'Sale'].map((n, i) => (
            <span key={n} className={i === 0 ? 'text-[#141414] underline underline-offset-4' : ''}>{n}</span>
          ))}
        </nav>
        <span className="text-[16px] font-semibold tracking-[0.32em]">ATELIER</span>
        <div className="flex items-center gap-4 text-[#444]">
          <Search className="h-3.5 w-3.5" />
          <User className="h-3.5 w-3.5" />
          <Heart className="h-3.5 w-3.5" />
          <span className="relative">
            <ShoppingBag className="h-4 w-4" />
            <motion.span
              initial={false}
              animate={{ scale: count ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 460, damping: 15 }}
              className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#141414] text-[8px] font-semibold text-white"
            >
              {count}
            </motion.span>
          </span>
        </div>
      </header>
    </>
  )
}

function Shop({ hovering, added, drawer, step }: { hovering: boolean; added: boolean; drawer: boolean; step: number }) {
  return (
    <div className="relative h-full w-full">
      <StoreHeader count={added ? 1 : 0} />

      {/* Banner */}
      <div className="relative mx-7 mt-4 h-[78px] overflow-hidden rounded-lg">
        <img src="/demo/shop-hero.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white">
          <p className="text-[9.5px] uppercase tracking-[0.2em] text-white/70">The autumn edit</p>
          <p className="mt-0.5 text-[16px] font-medium">48 new arrivals, in store and online</p>
        </div>
      </div>

      {/* Collection toolbar */}
      <div className="mx-7 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-medium">New in</h2>
          <span className="text-[10.5px] text-[#777]">48 products</span>
        </div>
        <div className="flex items-center gap-2 text-[10.5px] text-[#444]">
          {['Size', 'Colour', 'Price'].map((f) => (
            <span key={f} className="flex items-center gap-1 rounded-full border border-[#dedede] px-2.5 py-[4px]">
              {f} <ChevronDown className="h-2.5 w-2.5" />
            </span>
          ))}
          <span className="flex items-center gap-1 rounded-full border border-[#dedede] px-2.5 py-[4px]">
            <SlidersHorizontal className="h-2.5 w-2.5" /> Sort: Featured
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-7 mt-3 grid grid-cols-4 gap-4">
        {PRODUCTS.map((p, n) => {
          const focused = hovering && n === 1
          return (
            <div key={p.name}>
              <div className="relative h-[168px] overflow-hidden rounded-md bg-[#f4f4f4]">
                <motion.img
                  src={p.img}
                  alt=""
                  className="h-full w-full object-cover"
                  animate={{ scale: focused ? 1.06 : 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                {p.tag && (
                  <span className="absolute left-2 top-2 rounded-sm bg-white px-1.5 py-[2px] text-[8.5px] font-medium">{p.tag}</span>
                )}
                <Heart className="absolute right-2 top-2 h-3.5 w-3.5 text-white drop-shadow" />
                {/* Quick add */}
                <motion.div
                  initial={false}
                  animate={{ y: focused ? 0 : 44, opacity: focused ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 bottom-0 bg-white/95 px-2 pt-1.5 pb-2 backdrop-blur"
                >
                  <p className="text-[8.5px] text-[#777]">Quick add — size</p>
                  <div className="mt-1 flex gap-1">
                    {['S', 'M', 'L', 'XL'].map((s) => {
                      const picked = added && s === 'M'
                      return (
                        <span
                          key={s}
                          className={`flex h-5 flex-1 items-center justify-center rounded-sm border text-[9.5px] ${
                            picked ? 'border-[#141414] bg-[#141414] text-white' : 'border-[#dedede]'
                          }`}
                        >
                          {picked ? <Check className="h-2.5 w-2.5" /> : s}
                        </span>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
              <div className="mt-2 flex items-start justify-between">
                <div>
                  <p className="text-[11px]">{p.name}</p>
                  <p className="text-[9.5px] text-[#777]">{p.colours} colours</p>
                </div>
                <p className="text-[11px]">{p.price}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Toast */}
      <motion.div
        initial={false}
        animate={{ opacity: step === 2 ? 1 : 0, y: step === 2 ? 0 : 8 }}
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#141414] px-3.5 py-2 text-[10.5px] text-white shadow-lg"
      >
        <Check className="h-3 w-3 text-[#a3e635]" /> Added to bag — Nylon Bomber Jacket, M
      </motion.div>

      {/* Drawer */}
      <motion.div
        initial={false}
        animate={{ opacity: drawer ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 bg-black/30"
      />
      <motion.aside
        initial={false}
        animate={{ x: drawer ? 0 : 300 }}
        transition={{ type: 'spring', stiffness: 170, damping: 26 }}
        className="absolute right-0 top-0 flex h-full w-[286px] flex-col bg-white shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-3">
          <p className="text-[12.5px] font-medium">Bag (1)</p>
          <X className="h-3.5 w-3.5 text-[#777]" />
        </div>
        <div className="flex gap-3 px-4 py-3">
          <img src="/demo/shop-bomber.jpg" alt="" className="h-[74px] w-[58px] rounded-sm object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px]">Nylon Bomber Jacket</p>
            <p className="text-[9.5px] text-[#777]">Tan · M</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-sm border border-[#dedede] px-1.5 py-[2px] text-[10px]">
                <Minus className="h-2.5 w-2.5" /> 1 <Plus className="h-2.5 w-2.5" />
              </span>
              <span className="text-[11px]">₹4,290</span>
            </div>
          </div>
        </div>
        <div className="mx-4 rounded-md bg-[#f6f6f6] px-3 py-2 text-[9.5px] text-[#444]">
          <span className="flex items-center gap-1.5"><Truck className="h-3 w-3" /> You’ve unlocked free shipping</span>
          <div className="mt-1.5 h-1 rounded-full bg-[#e2e2e2]"><div className="h-full w-full rounded-full bg-[#141414]" /></div>
        </div>
        <div className="mt-auto border-t border-[#ececec] px-4 py-3 text-[11px]">
          <div className="flex justify-between text-[#444]"><span>Subtotal</span><span>₹4,290</span></div>
          <div className="mt-1 flex justify-between text-[#444]"><span>Shipping</span><span className="text-[#1f8f4e]">Free</span></div>
          <div className="mt-2 flex justify-between text-[12.5px] font-medium"><span>Total</span><span>₹4,290</span></div>
          <div className="mt-3 rounded-sm bg-[#141414] py-[9px] text-center text-[11.5px] font-medium text-white">Checkout</div>
          <p className="mt-2 text-center text-[9px] text-[#999]">Taxes included · 30-day returns</p>
        </div>
      </motion.aside>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Field({ label, value, active, delay = 0, w = 'w-full' }: { label: string; value: string; active: boolean; delay?: number; w?: string }) {
  return (
    <div className={w}>
      <label className="text-[9px] text-[#777]">{label}</label>
      <div className={`mt-[3px] flex h-[26px] items-center rounded-sm border px-2 text-[10.5px] ${active ? 'border-[#141414]' : 'border-[#dedede]'}`}>
        <Stream text={value} active={active} delay={delay} speed={3} />
      </div>
    </div>
  )
}

function Checkout({ step }: { step: number }) {
  const filling = step >= 5
  const paying = step >= 7
  return (
    <div className="h-full w-full">
      <header className="flex items-center justify-between border-b border-[#ececec] px-7 py-3.5">
        <span className="text-[14px] font-semibold tracking-[0.32em]">ATELIER</span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#777]"><Lock className="h-3 w-3" /> Secure checkout</span>
      </header>
      <div className="grid grid-cols-[1.15fr_1fr]">
        <div className="border-r border-[#ececec] px-7 py-4">
          <p className="text-[12.5px] font-medium">Contact</p>
          <div className="mt-2">
            <Field label="Email" value="ananya.r@gmail.com" active={filling} />
          </div>
          <p className="mt-4 text-[12.5px] font-medium">Delivery</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Field label="First name" value="Ananya" active={filling} delay={500} />
            <Field label="Last name" value="Rao" active={filling} delay={650} />
            <Field label="Address" value="48, 5th Cross, Jayanagar 4th Block" active={filling} delay={800} w="col-span-2" />
            <Field label="City" value="Bengaluru" active={filling} delay={1200} />
            <Field label="PIN code" value="560041" active={filling} delay={1300} />
          </div>
          <p className="mt-4 text-[12.5px] font-medium">Payment</p>
          <div className="mt-2 space-y-1.5">
            {[
              { l: 'UPI', s: 'GPay, PhonePe, Paytm', on: true },
              { l: 'Credit / debit card', s: 'Visa, Mastercard, RuPay' },
              { l: 'Cash on delivery', s: '₹49 handling fee' },
            ].map((o) => (
              <div key={o.l} className={`flex items-center gap-2.5 rounded-sm border px-2.5 py-2 ${o.on ? 'border-[#141414] bg-[#fafafa]' : 'border-[#dedede]'}`}>
                <span className={`flex h-3 w-3 items-center justify-center rounded-full border ${o.on ? 'border-[#141414]' : 'border-[#bbb]'}`}>
                  {o.on && <span className="h-1.5 w-1.5 rounded-full bg-[#141414]" />}
                </span>
                <span className="text-[10.5px]">{o.l}</span>
                <span className="ml-auto text-[9px] text-[#999]">{o.s}</span>
              </div>
            ))}
          </div>
          <motion.div
            initial={false}
            animate={{ backgroundColor: paying ? '#2a2a2a' : '#141414' }}
            className="mt-3 flex items-center justify-center gap-2 rounded-sm py-[10px] text-[11.5px] font-medium text-white"
          >
            {paying ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Waiting for UPI approval…
              </>
            ) : (
              'Pay ₹4,290'
            )}
          </motion.div>
        </div>

        <div className="bg-[#fafafa] px-6 py-4">
          <div className="flex gap-3">
            <span className="relative">
              <img src="/demo/shop-bomber.jpg" alt="" className="h-[60px] w-[48px] rounded-sm object-cover" />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#777] text-[8px] text-white">1</span>
            </span>
            <div className="flex-1">
              <p className="text-[11px]">Nylon Bomber Jacket</p>
              <p className="text-[9.5px] text-[#777]">Tan · M</p>
            </div>
            <p className="text-[11px]">₹4,290</p>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="flex-1 rounded-sm border border-[#dedede] bg-white px-2 py-[6px] text-[10px] text-[#999]">Discount code</span>
            <span className="rounded-sm border border-[#dedede] px-3 py-[6px] text-[10px]">Apply</span>
          </div>
          <div className="mt-3 space-y-1 text-[10.5px] text-[#444]">
            <div className="flex justify-between"><span>Subtotal</span><span>₹4,290</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-[#1f8f4e]">Free</span></div>
            <div className="flex justify-between"><span>Estimated tax</span><span>Included</span></div>
          </div>
          <div className="mt-2 flex justify-between border-t border-[#e6e6e6] pt-2 text-[13px] font-medium">
            <span>Total</span><span><span className="mr-1 text-[9px] font-normal text-[#777]">INR</span>₹4,290</span>
          </div>
          <div className="mt-4 rounded-md border border-[#e6e6e6] bg-white px-3 py-2.5 text-[9.5px] text-[#444]">
            <p className="flex items-center gap-1.5"><Truck className="h-3 w-3" /> Standard delivery · Tue 7 – Thu 9 Oct</p>
            <p className="mt-1 flex items-center gap-1.5"><Lock className="h-3 w-3" /> Payments handled by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Confirmed() {
  return (
    <div className="h-full w-full bg-[#fafafa]">
      <header className="flex items-center justify-center border-b border-[#ececec] bg-white py-3.5">
        <span className="text-[14px] font-semibold tracking-[0.32em]">ATELIER</span>
      </header>
      <div className="mx-auto mt-6 w-[460px] text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#e3f5e9]"
        >
          <Check className="h-5 w-5 text-[#1f8f4e]" strokeWidth={2.5} />
        </motion.span>
        <h2 className="mt-3 text-[20px] font-medium">Thank you, Ananya</h2>
        <p className="mt-1 text-[11px] text-[#666]">Order <span className="font-medium text-[#141414]">#ATL-10428</span> is confirmed. A receipt is on its way to ananya.r@gmail.com.</p>

        <div className="mt-5 rounded-lg border border-[#e6e6e6] bg-white p-4 text-left">
          <div className="flex gap-3">
            <img src="/demo/shop-bomber.jpg" alt="" className="h-[64px] w-[52px] rounded-sm object-cover" />
            <div className="flex-1">
              <p className="text-[11.5px]">Nylon Bomber Jacket</p>
              <p className="text-[9.5px] text-[#777]">Tan · M · Qty 1</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#1f8f4e]"><Truck className="h-3 w-3" /> Arrives Tue 7 – Thu 9 Oct</p>
            </div>
            <p className="text-[11.5px]">₹4,290</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 border-t border-[#ececec] pt-3 text-[10px] text-[#444]">
            <div>
              <p className="text-[#999]">Delivering to</p>
              <p className="mt-0.5 leading-snug">Ananya Rao<br />48, 5th Cross, Jayanagar 4th Block<br />Bengaluru 560041</p>
            </div>
            <div>
              <p className="text-[#999]">Payment</p>
              <p className="mt-0.5 leading-snug">UPI · ananya@okaxis<br />₹4,290 paid<br />Razorpay ref. pay_Nf3k…</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <span className="rounded-sm bg-[#141414] px-4 py-[8px] text-[11px] font-medium text-white">Track order</span>
          <span className="rounded-sm border border-[#dedede] px-4 py-[8px] text-[11px]">Continue shopping</span>
        </div>
      </div>
    </div>
  )
}
