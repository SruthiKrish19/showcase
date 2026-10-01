import { motion, useReducedMotion } from 'framer-motion'
import { Flame, Leaf, Plus, ScanLine, Star } from 'lucide-react'
import { PhoneFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { useCycle } from './useCycle'

export function ArMenuDemo() {
  const reduced = useReducedMotion()
  const step = useCycle(4, 1700)
  const placed = step >= 1
  const sheet = step >= 2

  return (
    <PhoneFrame className="h-full">
      <Stage width={300} height={620}>
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            background:
              'linear-gradient(175deg, #1a141c 0%, #2a1f1d 45%, #4a3528 100%)',
          }}
        >
          {/* Wood grain on the table */}
          <div
            className="absolute inset-x-0 bottom-0 h-[45%] opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(95deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 14px)',
            }}
          />

          {/* Status bar */}
          <div className="relative flex items-center justify-between px-5 pt-2.5">
            <span className="text-[11px] font-semibold text-white">9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-3.5 rounded-[2px] border border-white/60" />
              <span className="h-2 w-1 rounded-sm bg-white/60" />
            </div>
          </div>

          {/* Scanning overlay */}
          <motion.div
            className="absolute inset-x-6 top-[42%] h-[90px]"
            animate={{ opacity: placed ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="h-full w-full rounded-[50%] border-2 border-dashed border-cyan/50"
              style={{ transform: 'rotateX(68deg)' }}
            />
            <motion.p
              className="absolute inset-x-0 -top-10 flex items-center justify-center gap-1.5 text-[11px] text-white/80"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <ScanLine className="h-3.5 w-3.5 text-cyan" />
              Move your phone to find the table
            </motion.p>
          </motion.div>

          {/* Shadow under the dish */}
          <motion.div
            className="absolute left-1/2 top-[47%] h-[46px] w-[170px] -translate-x-1/2 rounded-[50%] bg-black/55 blur-md"
            initial={false}
            animate={{ opacity: placed ? 1 : 0, scale: placed ? 1 : 0.6 }}
            transition={{ duration: 0.5 }}
          />

          {/* The dish */}
          <motion.div
            className="absolute left-1/2 top-[30%] -translate-x-1/2"
            initial={false}
            animate={
              placed
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.5, y: -30 }
            }
            transition={{ type: 'spring', stiffness: 130, damping: 15 }}
          >
            <motion.div
              animate={reduced || !placed ? {} : { rotateY: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative h-[150px] w-[180px]"
            >
              {/* plate rim */}
              <span className="absolute bottom-1 left-1/2 h-[42px] w-[180px] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-white/95 to-white/55" />
              <span className="absolute bottom-[9px] left-1/2 h-[30px] w-[142px] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-white/70 to-white/35" />
              {/* curry */}
              <span className="absolute bottom-[16px] left-1/2 h-[34px] w-[108px] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-amber via-[#e4682f] to-rose shadow-[0_0_22px_rgba(251,113,133,0.35)]" />
              {/* paneer cubes */}
              <span className="absolute bottom-[32px] left-[58px] h-[18px] w-[20px] rotate-[8deg] rounded-[4px] bg-gradient-to-br from-[#fff4e0] to-[#e9c38c]" />
              <span className="absolute bottom-[38px] left-[82px] h-[17px] w-[19px] -rotate-[10deg] rounded-[4px] bg-gradient-to-br from-[#fff0d6] to-[#e0b377]" />
              <span className="absolute bottom-[30px] left-[104px] h-[16px] w-[18px] rotate-[14deg] rounded-[4px] bg-gradient-to-br from-[#fff4e0] to-[#e7bd83]" />
              {/* coriander */}
              <span className="absolute bottom-[50px] left-[74px] h-[9px] w-[14px] rounded-[50%] bg-lime/85" />
              <span className="absolute bottom-[46px] left-[96px] h-[8px] w-[12px] rounded-[50%] bg-lime/70" />
            </motion.div>
          </motion.div>

          {/* Rotate hint */}
          <motion.p
            className="absolute inset-x-0 top-[62%] text-center text-[10px] text-white/45"
            initial={false}
            animate={{ opacity: placed && !sheet ? 1 : 0 }}
          >
            Drag to turn · pinch to resize
          </motion.p>

          {/* Detail sheet */}
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-[22px] border-t border-white/15 bg-black/70 px-5 pb-5 pt-3 backdrop-blur-xl"
            initial={false}
            animate={{ y: sheet ? 0 : 230 }}
            transition={{ type: 'spring', stiffness: 170, damping: 24 }}
          >
            <span className="mx-auto mb-3 block h-1 w-9 rounded-full bg-white/25" />

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[17px] font-semibold tracking-tight text-white">
                  Paneer Tikka Masala
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10.5px] text-amber">
                    <Star className="h-3 w-3" style={{ fill: '#fbbf24' }} />
                    4.7
                  </span>
                  <span className="text-[10.5px] text-white/35">· 184 orders</span>
                </div>
              </div>
              <span className="text-[17px] font-semibold text-white">₹320</span>
            </div>

            <p className="mt-2 text-[11.5px] leading-snug text-white/55">
              Charred cottage cheese in a slow-cooked tomato and cashew gravy.
              Served with two butter rotis.
            </p>

            <div className="mt-3 flex gap-2">
              <Tag icon={Flame} label="Medium spice" tint="#fb7185" />
              <Tag icon={Leaf} label="Vegetarian" tint="#a3e635" />
              <Tag label="Serves 2" tint="#22d3ee" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-[11px] text-[12.5px] font-semibold text-black">
                <Plus className="h-3.5 w-3.5" />
                Add to order
              </span>
              <span className="rounded-xl border border-white/20 px-4 py-[11px] text-[12.5px] text-white/70">
                Share
              </span>
            </div>
          </motion.div>
        </div>
      </Stage>
    </PhoneFrame>
  )
}

function Tag({
  icon: Icon,
  label,
  tint,
}: {
  icon?: typeof Flame
  label: string
  tint: string
}) {
  return (
    <span
      className="flex items-center gap-1 rounded-full border px-2 py-[3px] text-[9.5px]"
      style={{ borderColor: `${tint}40`, color: tint }}
    >
      {Icon && <Icon className="h-2.5 w-2.5" />}
      {label}
    </span>
  )
}
