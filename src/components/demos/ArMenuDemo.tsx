import { motion } from 'framer-motion'
import { Leaf, Flame, Share, Smartphone, X } from 'lucide-react'
import { PhoneFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { ArScene } from './three/Lazy'
import { useCycle } from './useCycle'

/**
 * Augmented reality — the phone's own AR viewer, not a 3D widget. The camera
 * feed is a rendered room with a wooden table, glass, cutlery and the QR stand
 * the guest just scanned. The dish stays locked to the table while the
 * handheld camera drifts; the chrome follows the native AR viewer's layout
 * (close / AR–Object toggle / share, coaching card, product sheet).
 */
export function ArMenuDemo() {
  const step = useCycle(6, 1700)
  const found = step >= 1
  const placed = step >= 2
  const measured = step >= 3
  const sheet = step >= 4

  return (
    <PhoneFrame className="h-full">
      <Stage width={300} height={620}>
        <div className="relative h-full w-full overflow-hidden bg-[#1a110b]">
          {/* Camera feed */}
          <div className="absolute inset-0">
            <ArScene placed={placed} />
          </div>

          {/* Lens vignette + sensor grain, fixed to the camera not the world */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(80% 65% at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)' }} />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Surface reticle, on the table where the dish will land */}
          <motion.div
            className="absolute left-1/2 top-[36%] h-[110px] w-[190px] -translate-x-1/2"
            style={{ transform: 'translateX(-50%) rotateX(68deg)' }}
            initial={false}
            animate={{ opacity: placed ? 0 : found ? 1 : 0.35, scale: found ? 1 : 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full w-full rounded-[50%] border-[2.5px] border-white/90"
              animate={found ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </motion.div>

          {/* Placement ripple */}
          <motion.div
            key={placed ? 'on' : 'off'}
            className="pointer-events-none absolute left-1/2 top-[36%] h-[110px] w-[190px] -translate-x-1/2 rounded-[50%] border border-white/70"
            style={{ transform: 'translateX(-50%) rotateX(68deg)' }}
            initial={{ opacity: placed ? 0.8 : 0, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          {/* True-size callout */}
          <motion.div
            className="absolute left-1/2 top-[53%] -translate-x-1/2"
            initial={false}
            animate={{ opacity: measured ? 1 : 0, y: measured ? 0 : 6 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative w-[128px]">
              <span className="block h-[1px] w-full bg-white/90" />
              <span className="absolute -left-[1px] -top-[4px] h-[9px] w-[1.5px] bg-white/90" />
              <span className="absolute -right-[1px] -top-[4px] h-[9px] w-[1.5px] bg-white/90" />
              <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/60 px-2 py-[3px] text-[9px] text-white backdrop-blur">
                26 cm · true size
              </span>
            </div>
          </motion.div>

          {/* Status bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-2.5 text-white drop-shadow">
            <span className="text-[11px] font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-3.5 rounded-[2px] border border-white/80" />
              <span className="h-2 w-1 rounded-sm bg-white/80" />
            </div>
          </div>

          {/* Native viewer chrome */}
          <div className="absolute inset-x-0 top-9 flex items-center justify-between px-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-md">
              <X className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="flex overflow-hidden rounded-full bg-black/35 p-[3px] text-[10.5px] font-medium backdrop-blur-md">
              <span className="rounded-full bg-white px-3.5 py-[5px] text-black">AR</span>
              <span className="px-3.5 py-[5px] text-white/85">Object</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-md">
              <Share className="h-3.5 w-3.5 text-white" />
            </span>
          </div>

          {/* Coaching card */}
          <motion.div
            className="absolute inset-x-10 top-[36%] flex flex-col items-center rounded-2xl bg-black/45 px-4 py-4 text-center backdrop-blur-md"
            initial={false}
            animate={{ opacity: found ? 0 : 1, scale: found ? 0.95 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span animate={{ rotate: [-12, 12, -12], x: [-10, 10, -10] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
              <Smartphone className="h-7 w-7 text-white" strokeWidth={1.5} />
            </motion.span>
            <p className="mt-2 text-[12px] font-medium text-white">Move your phone</p>
            <p className="mt-0.5 text-[10px] text-white/70">to find the surface of your table</p>
          </motion.div>

          {/* Tap hint */}
          <motion.p
            className="absolute inset-x-0 top-[27%] text-center text-[10.5px] font-medium text-white drop-shadow"
            initial={false}
            animate={{ opacity: found && !placed ? 1 : 0 }}
          >
            Tap to place
          </motion.p>

          {/* Product sheet */}
          <motion.div
            className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/92 p-3.5 text-[#15161a] shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            initial={false}
            animate={{ y: sheet ? 0 : 160, opacity: sheet ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          >
            <span className="mx-auto mb-2.5 block h-1 w-9 rounded-full bg-black/15" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13.5px] font-semibold tracking-tight">Paneer Tikka Masala</p>
                <p className="mt-0.5 text-[10px] text-[#5b616d]">Serves 1–2 · 26 cm bowl · shown at true size</p>
              </div>
              <span className="text-[13.5px] font-semibold">₹320</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-[3px] text-[9px]"><Flame className="h-2.5 w-2.5" /> Medium</span>
              <span className="flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-[3px] text-[9px]"><Leaf className="h-2.5 w-2.5" /> Veg</span>
              <span className="ml-auto rounded-xl bg-[#15161a] px-3.5 py-[7px] text-[10.5px] font-medium text-white">Add to order</span>
            </div>
          </motion.div>

          {/* Pre-sheet hint strip */}
          <motion.p
            className="absolute inset-x-0 bottom-6 text-center text-[9.5px] text-white/80 drop-shadow"
            initial={false}
            animate={{ opacity: placed && !sheet ? 1 : 0 }}
          >
            Drag to move · pinch to resize
          </motion.p>
        </div>
      </Stage>
    </PhoneFrame>
  )
}
