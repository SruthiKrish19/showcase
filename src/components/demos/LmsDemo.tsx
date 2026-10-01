import { motion } from 'framer-motion'
import {
  Bell,
  BookOpen,
  Check,
  FileText,
  LayoutGrid,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { useCycle } from './useCycle'

const NAV = [
  { icon: LayoutGrid, label: 'Dashboard' },
  { icon: BookOpen, label: 'Lessons', active: true },
  { icon: FileText, label: 'Question bank' },
  { icon: Users, label: 'Teachers' },
]

const QUESTIONS = [
  { q: 'Why does the wind change direction along the coast?', type: 'Long answer' },
  { q: 'Define evaporation in your own words.', type: 'Short answer' },
  { q: 'Which instrument measures rainfall?', type: 'MCQ' },
  { q: 'Label the stages of the water cycle.', type: 'Diagram' },
]

export function LmsDemo() {
  const step = useCycle(6, 1250)
  const pct = Math.min(step * 22, 100)

  return (
    <BrowserFrame url="lms.vidyaschools.in/lessons/class-6/weather" className="h-full">
      <Stage width={760} height={420}>
        <div className="flex h-full w-full bg-[#0b0b11]">
          {/* Sidebar */}
          <aside className="flex w-[150px] shrink-0 flex-col border-r border-white/8 bg-white/[0.02] py-4">
            <div className="flex items-center gap-2 px-4 pb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan to-violet text-[11px] font-bold text-white">
                V
              </span>
              <span className="text-[12px] font-semibold text-white">Vidya</span>
            </div>
            {NAV.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`mx-2 flex items-center gap-2 rounded-md px-2 py-[7px] ${
                  active ? 'bg-white/[0.07]' : ''
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${active ? 'text-cyan' : 'text-white/35'}`}
                />
                <span
                  className={`text-[11.5px] ${
                    active ? 'text-white' : 'text-white/45'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top bar */}
            <header className="flex items-center gap-3 border-b border-white/8 px-5 py-3">
              <div className="flex flex-1 items-center gap-2 rounded-md bg-white/[0.05] px-2.5 py-1.5">
                <Search className="h-3 w-3 text-white/30" />
                <span className="text-[11px] text-white/30">Search lessons</span>
              </div>
              <Bell className="h-3.5 w-3.5 text-white/35" />
              <span className="h-6 w-6 rounded-full bg-gradient-to-br from-violet to-rose" />
            </header>

            <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.25fr] gap-4 p-5">
              {/* Source document */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                  Source
                </p>
                <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan" />
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] text-white">
                        Chapter 2 — Weather.pdf
                      </p>
                      <p className="text-[10px] text-white/35">
                        CBSE Class 6 · 14 pages
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-[5px]">
                    {[96, 88, 100, 72, 92, 80, 64].map((w, n) => (
                      <div
                        key={n}
                        className="h-[3px] rounded-full bg-white/12"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[10px] text-white/55">
                        <Sparkles className="h-3 w-3 text-violet" />
                        {step === 0 ? 'Extracting text' : step >= 5 ? 'Complete' : 'Generating'}
                      </span>
                      <span className="text-[10px] tabular-nums text-white/40">
                        {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan to-violet"
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                </div>

                {/* Translation output */}
                <motion.div
                  initial={false}
                  animate={{ opacity: step >= 5 ? 1 : 0.2, y: step >= 5 ? 0 : 6 }}
                  transition={{ duration: 0.45 }}
                  className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Tamil translation
                  </p>
                  <p className="mt-1.5 text-[12px] text-white/75">
                    கடற்கரையில் காற்று ஏன் திசை மாறுகிறது?
                  </p>
                </motion.div>
              </section>

              {/* Generated questions */}
              <section className="min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Generated questions
                  </p>
                  <span className="rounded-full bg-lime/15 px-2 py-[3px] text-[9.5px] text-lime">
                    Awaiting review
                  </span>
                </div>

                <div className="mt-2 space-y-[7px]">
                  {QUESTIONS.map((item, n) => {
                    const shown = step > n
                    return (
                      <motion.div
                        key={item.q}
                        initial={false}
                        animate={{
                          opacity: shown ? 1 : 0.18,
                          y: shown ? 0 : 8,
                        }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-2"
                      >
                        <span className="mt-[1px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border border-white/20 bg-lime/15">
                          <Check className="h-2.5 w-2.5 text-lime" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11.5px] leading-snug text-white/85">
                            {item.q}
                          </p>
                          <p className="mt-0.5 text-[9.5px] text-white/35">
                            {item.type}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.div
                  initial={false}
                  animate={{ opacity: step >= 5 ? 1 : 0.25 }}
                  className="mt-3 flex items-center gap-2"
                >
                  <span className="rounded-md bg-white px-3 py-[7px] text-[11px] font-medium text-black">
                    Approve lesson
                  </span>
                  <span className="rounded-md border border-white/15 px-3 py-[7px] text-[11px] text-white/60">
                    Regenerate
                  </span>
                </motion.div>
              </section>
            </div>
          </div>

          <Cursor
            x={step >= 5 ? 520 : 300}
            y={step >= 5 ? 372 : 250}
            clicking={step >= 5}
          />
        </div>
      </Stage>
    </BrowserFrame>
  )
}
