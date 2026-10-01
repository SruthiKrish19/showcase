import { motion } from 'framer-motion'
import { Check, FileCheck2, Lock, Sparkles } from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { useCycle } from './useCycle'

const CHAT = [
  { from: 'bot', text: 'Where did you last work, and when did you stop?' },
  { from: 'user', text: 'Brightline Logistics. I stopped last November.' },
  { from: 'bot', text: 'Thanks — what did you do there day to day?' },
  { from: 'user', text: 'Loading and sorting parcels, mostly on my feet.' },
]

const FIELDS = [
  { label: '4a. Employer name', value: 'Brightline Logistics Pvt Ltd' },
  { label: '4b. Job title', value: 'Warehouse Operative' },
  { label: '4c. Date last worked', value: '08 / 11 / 2024' },
  { label: '4d. Duties performed', value: 'Loading, sorting, standing 7h/day' },
]

export function FormFillDemo() {
  const step = useCycle(7, 1150)
  const filled = Math.max(0, step - 2)
  const pct = Math.round((Math.min(filled, FIELDS.length) / FIELDS.length) * 100)

  return (
    <BrowserFrame url="formwise.app/ssa-3368-bk/section-4" className="h-full">
      <Stage width={760} height={420}>
        <div className="flex h-full w-full flex-col bg-[#0b0b11]">
          {/* App bar */}
          <header className="flex items-center justify-between border-b border-white/8 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet to-cyan text-[11px] font-bold text-white">
                F
              </span>
              <span className="text-[12px] font-semibold text-white">Formwise</span>
              <span className="ml-2 rounded-full bg-white/[0.07] px-2 py-[3px] text-[9.5px] text-white/55">
                SSA-3368-BK · Disability Report
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-white/40">
              <Lock className="h-3 w-3" />
              Saved · resume anytime
            </span>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.1fr]">
            {/* Conversation */}
            <section className="flex min-h-0 flex-col border-r border-white/8 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                In your own words
              </p>

              <div className="mt-3 flex-1 space-y-2.5">
                {CHAT.map((m, n) => {
                  const shown = step > n - 1
                  const isBot = m.from === 'bot'
                  return (
                    <motion.div
                      key={m.text}
                      initial={false}
                      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 8 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={isBot ? 'flex gap-2' : 'flex justify-end'}
                    >
                      {isBot && (
                        <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan">
                          <Sparkles className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}
                      <p
                        className={`max-w-[205px] rounded-xl px-2.5 py-2 text-[11.5px] leading-snug ${
                          isBot
                            ? 'rounded-tl-sm bg-white/[0.06] text-white/80'
                            : 'rounded-tr-sm bg-violet/25 text-white'
                        }`}
                      >
                        {m.text}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
                <span className="flex-1 text-[11px] text-white/30">
                  Type your answer…
                </span>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="h-3 w-[1.5px] bg-white/50"
                />
              </div>
            </section>

            {/* The official form */}
            <section className="min-h-0 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                  Official form · Section 4
                </p>
                <span className="text-[10px] tabular-nums text-white/45">
                  {pct}% complete
                </span>
              </div>

              <div className="mt-1.5 h-[4px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="mt-3 space-y-2">
                {FIELDS.map((f, n) => {
                  const done = filled > n
                  return (
                    <div key={f.label}>
                      <p className="text-[9.5px] text-white/35">{f.label}</p>
                      <motion.div
                        initial={false}
                        animate={{
                          borderColor: done
                            ? 'rgba(163,230,53,0.3)'
                            : 'rgba(255,255,255,0.1)',
                          backgroundColor: done
                            ? 'rgba(163,230,53,0.05)'
                            : 'rgba(255,255,255,0.03)',
                        }}
                        transition={{ duration: 0.4 }}
                        className="mt-1 flex h-[26px] items-center gap-2 rounded-md border px-2"
                      >
                        <motion.span
                          initial={false}
                          animate={{ opacity: done ? 1 : 0 }}
                          transition={{ duration: 0.35, delay: done ? 0.12 : 0 }}
                          className="truncate text-[11px] text-white/90"
                        >
                          {f.value}
                        </motion.span>
                        <motion.span
                          initial={false}
                          animate={{ scale: done ? 1 : 0 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                          className="ml-auto flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-lime/20"
                        >
                          <Check className="h-2.5 w-2.5 text-lime" />
                        </motion.span>
                      </motion.div>
                    </div>
                  )
                })}
              </div>

              <motion.div
                initial={false}
                animate={{ opacity: step >= 6 ? 1 : 0.25 }}
                className="mt-3 flex items-center gap-2"
              >
                <span className="flex items-center gap-1.5 rounded-md bg-white px-3 py-[7px] text-[11px] font-medium text-black">
                  <FileCheck2 className="h-3 w-3" />
                  Generate PDF
                </span>
                <span className="rounded-md border border-white/15 px-3 py-[7px] text-[11px] text-white/60">
                  Save &amp; exit
                </span>
              </motion.div>
            </section>
          </div>

          <Cursor
            x={step >= 6 ? 438 : 300}
            y={step >= 6 ? 378 : 300}
            clicking={step >= 6}
          />
        </div>
      </Stage>
    </BrowserFrame>
  )
}
