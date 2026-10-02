import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Leaf, Minus, Plus, Search, Star, Wifi } from 'lucide-react'
import { PhoneFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { StudioScene } from './three/Lazy'
import { useCycle } from './useCycle'

const DISHES = [
  {
    name: 'Paneer Tikka Masala',
    price: 320,
    rating: '4.7',
    orders: '184',
    kind: 'curry' as const,
    photo: '/demo/food-curry.jpg',
    desc: 'Charred cottage cheese folded into a slow-cooked tomato and cashew gravy.',
    serves: 'Serves 1–2',
    tags: [{ icon: Flame, label: 'Medium' }, { icon: Leaf, label: 'Veg' }],
  },
  {
    name: 'Hyderabadi Biryani',
    price: 380,
    rating: '4.9',
    orders: '412',
    kind: 'biryani' as const,
    photo: '/demo/food-biryani.jpg',
    desc: 'Long-grain rice layered with saffron, fried onion and slow-cooked spice.',
    serves: 'Serves 2',
    tags: [{ icon: Flame, label: 'Hot' }],
  },
  {
    name: 'Paneer Tikka Sizzler',
    price: 340,
    rating: '4.6',
    orders: '131',
    kind: 'grill' as const,
    photo: '/demo/food-tikka.jpg',
    desc: 'Smoky tandoor-grilled paneer with peppers and onion, served sizzling.',
    serves: 'Serves 1',
    tags: [{ icon: Flame, label: 'Mild' }, { icon: Leaf, label: 'Veg' }],
  },
]

const CATEGORIES = ['Starters', 'Mains', 'Breads', 'Desserts']

/**
 * The 3D menu: a light, modern ordering app where every dish is a model the
 * guest can turn. A simulated finger drag spins it so the interaction is
 * obvious even in a loop.
 */
export function Menu3DDemo() {
  const step = useCycle(DISHES.length * 3, 1400)
  const i = Math.floor(step / 3)
  const sub = step % 3 // 0 settle, 1 drag, 2 settle
  const dish = DISHES[i]
  const dragging = sub === 1

  return (
    <PhoneFrame className="h-full">
      <Stage width={300} height={620}>
        <div className="relative h-full w-full overflow-hidden bg-white text-[#15161a]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-2.5">
            <span className="text-[11px] font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3" />
              <span className="h-2 w-3.5 rounded-[2px] border border-[#15161a]/70" />
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-3">
            <div>
              <p className="text-[9.5px] uppercase tracking-[0.16em] text-[#8a8f99]">Table 14 · Dine-in</p>
              <h2 className="text-[17px] font-semibold tracking-tight">The Copper Pot</h2>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f4f6]">
              <Search className="h-3.5 w-3.5 text-[#5b616d]" />
            </span>
          </div>

          {/* Categories */}
          <div className="mt-3 flex gap-1.5 px-5">
            {CATEGORIES.map((c, n) => (
              <span key={c} className={`rounded-full px-2.5 py-[5px] text-[10px] ${n === 1 ? 'bg-[#15161a] text-white' : 'bg-[#f3f4f6] text-[#5b616d]'}`}>
                {c}
              </span>
            ))}
          </div>

          {/* 3D viewer */}
          <div
            className="relative mx-5 mt-3 h-[222px] overflow-hidden rounded-2xl"
            style={{ background: 'radial-gradient(85% 60% at 50% 20%, #ffffff, #efe9e1 70%, #e4dcd1)' }}
          >
            <div className="absolute inset-0">
              <StudioScene kind={dish.kind} boost={dragging} />
            </div>

            <span className="absolute left-3 top-3 rounded-full bg-[#15161a]/85 px-2 py-[3px] text-[9px] font-medium text-white">360°</span>
            <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-[3px] text-[9px] text-[#5b616d] backdrop-blur">1 : 1 scale</span>

            {/* Finger drag */}
            <motion.span
              initial={false}
              animate={dragging ? { opacity: [0, 0.9, 0.9, 0], x: [60, 60, 200, 200], y: [120, 120, 112, 112] } : { opacity: 0 }}
              transition={{ duration: 1.3, times: [0, 0.15, 0.85, 1], ease: 'easeInOut' }}
              className="pointer-events-none absolute left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90 bg-white/35 shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
            />

            <span className="absolute inset-x-0 bottom-2.5 text-center text-[9px] text-[#8a8f99]">
              {dragging ? 'Rotating' : 'Drag to rotate · pinch to zoom'}
            </span>
          </div>

          {/* Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="px-5 pt-3.5"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold tracking-tight">{dish.name}</h3>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#5b616d]">
                    <span className="flex items-center gap-0.5 font-medium text-[#15161a]">
                      <Star className="h-2.5 w-2.5 text-[#f59e0b]" style={{ fill: '#f59e0b' }} /> {dish.rating}
                    </span>
                    <span>· {dish.orders} orders</span>
                    <span>· {dish.serves}</span>
                  </div>
                </div>
                <span className="text-[15px] font-semibold">₹{dish.price}</span>
              </div>
              <p className="mt-1.5 text-[10.5px] leading-snug text-[#5b616d]">{dish.desc}</p>
              <div className="mt-2 flex gap-1.5">
                {dish.tags.map((t) => (
                  <span key={t.label} className="flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-[3px] text-[9px] text-[#3f4450]">
                    <t.icon className="h-2.5 w-2.5" /> {t.label}
                  </span>
                ))}
                <span className="ml-auto flex overflow-hidden rounded-full border border-[#e5e7eb] text-[8.5px]">
                  {['Mild', 'Medium', 'Hot'].map((s) => (
                    <span key={s} className={`px-2 py-[3px] ${s === 'Medium' ? 'bg-[#15161a] text-white' : 'text-[#5b616d]'}`}>{s}</span>
                  ))}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Other dishes */}
          <div className="mt-3 flex gap-2 px-5">
            {DISHES.map((d, n) => (
              <div key={d.name} className="flex-1">
                <div className={`relative h-[46px] overflow-hidden rounded-lg ring-2 transition-all duration-500 ${n === i ? 'ring-[#15161a]' : 'ring-transparent'}`}>
                  <img src={d.photo} alt="" className={`h-full w-full object-cover transition-opacity duration-500 ${n === i ? 'opacity-100' : 'opacity-60'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Order bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-[#eceef1] bg-white/90 px-5 pt-2.5 pb-5 backdrop-blur">
            <span className="flex items-center gap-2.5 rounded-xl bg-[#f3f4f6] px-2.5 py-[9px] text-[11px]">
              <Minus className="h-3 w-3 text-[#5b616d]" /> 1 <Plus className="h-3 w-3 text-[#5b616d]" />
            </span>
            <span className="flex flex-1 items-center justify-between rounded-xl bg-[#15161a] px-3.5 py-[10px] text-[11.5px] font-medium text-white">
              Add to order <span>₹{dish.price}</span>
            </span>
          </div>
        </div>
      </Stage>
    </PhoneFrame>
  )
}
