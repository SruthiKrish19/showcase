import { motion } from 'framer-motion'
import {
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Languages,
  LayoutGrid,
  Library,
  PieChart,
  Sparkles,
  ZoomIn,
} from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { CaptionRail } from './CaptionRail'
import { Stream } from './Stream'
import { useCycle } from './useCycle'

const INDIGO = '#4f46e5'

const QUESTIONS = [
  { type: 'MCQ', bloom: 'Remember', q: 'Which instrument is used to measure the amount of rainfall at a place?', ta: 'ஒரு இடத்தில் பெய்யும் மழையின் அளவை அளக்க எந்தக் கருவி பயன்படுத்தப்படுகிறது?' },
  { type: 'Short answer', bloom: 'Understand', q: 'In two sentences, explain why coastal towns feel a sea breeze in the afternoon.' },
  { type: 'Long answer', bloom: 'Analyse', q: 'Compare weather and climate using one example from your own town. Why do forecasters only predict a few days ahead?' },
  { type: 'Diagram', bloom: 'Apply', q: 'Label the four stages of the water cycle in Fig 2.3 and mark where energy from the sun enters.' },
]

const CAPTIONS = [
  'Start from the textbook chapter the teacher already uses',
  'The AI reads the pages and writes questions — MCQ, short, long and diagram-based',
  'One tap translates any question to Tamil for bilingual classrooms',
  'Review, then assign to the class with a due date',
]

export function LmsDemo() {
  const step = useCycle(9, 1500)
  const reading = step === 1
  const shown = Math.max(0, Math.min(step - 1, QUESTIONS.length)) // questions visible
  const generated = step >= 5
  const tamil = step >= 6
  const assigned = step >= 8
  const caption = step === 0 ? 0 : step <= 5 ? 1 : step === 6 ? 2 : 3

  return (
    <BrowserFrame url="app.vidyaschools.in/classes/6b/science/ch-2/generate" tabTitle="Chapter 2 · Weather — Vidya" className="h-full">
      <Stage width={760} height={500}>
        <div className="relative h-full w-full overflow-hidden bg-[#f5f6fa] text-[#1a1d29]">
          <div className="absolute inset-x-0 top-0 bottom-9 flex">
          {/* Sidebar */}
          <aside className="flex w-[148px] shrink-0 flex-col border-r border-[#e4e6ef] bg-white px-3 py-4">
            <div className="flex items-center gap-2 px-1.5 pb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-md text-white" style={{ backgroundColor: INDIGO }}>
                <GraduationCap className="h-3.5 w-3.5" />
              </span>
              <span className="text-[12.5px] font-semibold">Vidya</span>
            </div>
            {[
              { icon: LayoutGrid, l: 'Dashboard' },
              { icon: Library, l: 'Classes' },
              { icon: BookOpen, l: 'Lessons', active: true },
              { icon: ClipboardList, l: 'Question bank' },
              { icon: FileText, l: 'Assessments' },
              { icon: PieChart, l: 'Reports' },
            ].map(({ icon: Icon, l, active }) => (
              <div
                key={l}
                className={`flex items-center gap-2 rounded-md px-2 py-[7px] text-[11.5px] ${active ? 'bg-[#eef0ff] font-medium' : 'text-[#5d6275]'}`}
                style={active ? { color: INDIGO } : undefined}
              >
                <Icon className="h-3.5 w-3.5" /> {l}
              </div>
            ))}
            <div className="mt-auto flex items-center gap-2 rounded-md bg-[#f5f6fa] px-2 py-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fde68a] text-[9px] font-semibold text-[#92400e]">LK</span>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium">Mrs. Lakshmi</p>
                <p className="text-[9px] text-[#8a8fa3]">Science · 6B, 7A</p>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top bar */}
            <header className="flex items-center gap-2 border-b border-[#e4e6ef] bg-white px-5 py-2.5 text-[11px] text-[#5d6275]">
              <span>Class 6B</span><ChevronRight className="h-3 w-3" />
              <span>Science</span><ChevronRight className="h-3 w-3" />
              <span className="font-medium text-[#1a1d29]">Chapter 2 · Weather and Climate</span>
              <span className="ml-auto flex items-center gap-1 rounded-full bg-[#eef0ff] px-2 py-[3px] text-[9.5px]" style={{ color: INDIGO }}>
                <Sparkles className="h-2.5 w-2.5" /> 412 AI credits
              </span>
              <Bell className="ml-2 h-3.5 w-3.5" />
            </header>

            <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.15fr] gap-4 p-4">
              {/* PDF viewer */}
              <section className="flex min-h-0 min-w-0 flex-col rounded-lg border border-[#e4e6ef] bg-white">
                <div className="flex items-center gap-2 border-b border-[#e4e6ef] px-3 py-2 text-[10px] text-[#5d6275]">
                  <FileText className="h-3 w-3 text-[#d93025]" />
                  <span className="truncate text-[#1a1d29]">NCERT_Class6_Science_Ch2.pdf</span>
                  <span className="ml-auto whitespace-nowrap">3 / 14</span>
                  <ZoomIn className="h-3 w-3" />
                </div>
                <div className="relative flex-1 overflow-hidden bg-[#e9ebf2] p-3">
                  <TextbookPage />
                  {/* Reading sweep */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: reading ? 1 : 0 }}
                    className="pointer-events-none absolute inset-3 overflow-hidden rounded-sm"
                  >
                    <motion.div
                      animate={reading ? { top: ['0%', '100%'] } : { top: '0%' }}
                      transition={{ duration: 1.4, ease: 'linear', repeat: reading ? Infinity : 0 }}
                      className="absolute inset-x-0 h-10"
                      style={{ background: 'linear-gradient(180deg, transparent, rgba(79,70,229,0.18), transparent)' }}
                    />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{ opacity: reading ? 1 : 0, y: reading ? 0 : 6 }}
                    className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#1a1d29] px-2.5 py-1 text-[9.5px] text-white"
                  >
                    <span className="h-2.5 w-2.5 animate-spin rounded-full border border-white/30 border-t-white" />
                    Reading 14 pages · extracting figures
                  </motion.div>
                </div>
              </section>

              {/* Generator */}
              <section className="flex min-h-0 min-w-0 flex-col">
                <div className="rounded-lg border border-[#e4e6ef] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-[12px] font-medium"><Sparkles className="h-3.5 w-3.5" style={{ color: INDIGO }} /> Generate questions</p>
                    <span className="text-[9.5px] text-[#8a8fa3]">Source: pages 1–14</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {['MCQ', 'Short answer', 'Long answer', 'Diagram'].map((t) => (
                      <span key={t} className="flex items-center gap-1 rounded-full border px-2 py-[3px] text-[9.5px]" style={{ borderColor: INDIGO, color: INDIGO, backgroundColor: '#eef0ff' }}>
                        <Check className="h-2.5 w-2.5" strokeWidth={3} /> {t}
                      </span>
                    ))}
                    <span className="ml-auto flex overflow-hidden rounded-md border border-[#e4e6ef] text-[9.5px]">
                      {['Easy', 'Mixed', 'Hard'].map((d) => (
                        <span key={d} className={`px-2 py-[3px] ${d === 'Mixed' ? 'bg-[#1a1d29] text-white' : 'text-[#5d6275]'}`}>{d}</span>
                      ))}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 whitespace-nowrap rounded-md border border-[#e4e6ef] px-2 py-[4px] text-[10px]">10 questions <ChevronDown className="h-2.5 w-2.5" /></span>
                    <span className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-[4px] text-[10px] transition-colors ${tamil ? 'border-[#4f46e5] bg-[#eef0ff]' : 'border-[#e4e6ef]'}`} style={tamil ? { color: INDIGO } : undefined}>
                      <Languages className="h-3 w-3" /> English {tamil ? '+ தமிழ்' : 'only'}
                    </span>
                    <motion.span
                      initial={false}
                      animate={{ backgroundColor: step >= 1 && !generated ? '#6b63f0' : INDIGO }}
                      className="ml-auto flex items-center gap-1.5 rounded-md px-3 py-[6px] text-[10.5px] font-medium text-white"
                    >
                      {step >= 1 && !generated ? (
                        <><span className="h-2.5 w-2.5 animate-spin rounded-full border border-white/40 border-t-white" /> Generating…</>
                      ) : generated ? 'Regenerate' : 'Generate'}
                    </motion.span>
                  </div>
                </div>

                {/* Output */}
                <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-hidden pb-1">
                  {QUESTIONS.map((item, n) => {
                    const on = shown > n
                    return (
                      <motion.div
                        key={item.q}
                        initial={false}
                        animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-lg border border-[#e4e6ef] bg-white px-3 py-2"
                      >
                        <div className="flex items-center gap-1.5 text-[9px]">
                          <span className="rounded-sm bg-[#eef0ff] px-1.5 py-[1px] font-medium" style={{ color: INDIGO }}>{item.type}</span>
                          <span className="rounded-sm bg-[#f1f3f8] px-1.5 py-[1px] text-[#5d6275]">Bloom’s · {item.bloom}</span>
                          <span className="ml-auto text-[#8a8fa3]">Q{n + 1}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug">
                          <Stream text={item.q} active={on} speed={3} caret />
                        </p>
                        {item.ta && (
                          <motion.p
                            initial={false}
                            animate={{ opacity: tamil ? 1 : 0, height: tamil ? 'auto' : 0 }}
                            className="mt-1 overflow-hidden text-[10.5px] leading-snug text-[#3f3a99]"
                          >
                            <Stream text={item.ta} active={tamil} speed={2} />
                          </motion.p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                <motion.div
                  initial={false}
                  animate={{ opacity: generated ? 1 : 0.3 }}
                  className="mt-2 flex items-center gap-2"
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-[7px] text-[10.5px] font-medium text-white" style={{ backgroundColor: assigned ? '#15803d' : '#1a1d29' }}>
                    {assigned ? <><Check className="h-3 w-3" /> Assigned to 6B · due Fri 10 Oct</> : 'Assign to Class 6B'}
                  </span>
                  <span className="whitespace-nowrap rounded-md border border-[#e4e6ef] bg-white px-3 py-[7px] text-[10.5px] text-[#5d6275]">Save to bank</span>
                  <span className="ml-auto whitespace-nowrap text-[9.5px] text-[#8a8fa3]">{generated ? '10 generated · 4 shown' : ''}</span>
                </motion.div>
              </section>
            </div>
          </div>
          </div>

          <Cursor
            x={step === 0 ? 560 : step <= 5 ? 690 : step === 6 ? 470 : 440}
            y={step === 0 ? 300 : step <= 5 ? 160 : step === 6 ? 160 : 452}
            clicking={step === 1 || step === 6 || step === 7}
          />
          <CaptionRail steps={CAPTIONS} current={caption} tint="#22d3ee" />
        </div>
      </Stage>
    </BrowserFrame>
  )
}

/** A believable textbook page: running head, two columns, a figure. */
function TextbookPage() {
  return (
    <div className="h-full w-full rounded-sm bg-white px-5 py-4 shadow-[0_2px_10px_rgba(20,20,40,0.12)]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#222' }}>
      <div className="flex items-center justify-between border-b border-[#ccc] pb-1 text-[6.5px] uppercase tracking-[0.12em] text-[#888]">
        <span>Science · Class VI</span><span>Chapter 2</span>
      </div>
      <h3 className="mt-2.5 text-[12px] font-bold leading-tight">2.1 What makes the weather?</h3>
      <div className="mt-1.5 grid grid-cols-2 gap-3 text-[6.6px] leading-[1.45] text-justify">
        <div>
          <p>
            Step outside on two different mornings and the air may feel completely different. On one it is cool and still; on the next, warm with a breeze. These day-to-day changes in temperature, humidity, rainfall, wind and cloud cover are what we call <b>weather</b>.
          </p>
          <p className="mt-1.5">
            The weather at a place is driven by energy from the Sun. Land heats up faster than water, and the warmer air above it rises. Cooler air from over the sea moves in to take its place. This is why towns near the coast often feel a <i>sea breeze</i> in the afternoon.
          </p>
          <p className="mt-1.5">
            Meteorologists measure these changes with instruments. A <b>rain gauge</b> collects rainfall, a thermometer records temperature and an anemometer measures wind speed.
          </p>
        </div>
        <div>
          <WaterCycle />
          <p className="mt-1 text-center text-[5.8px] italic text-[#555]">Fig 2.3 The water cycle</p>
          <p className="mt-1.5">
            Because the weather is affected by so many things at once, forecasters can only predict it with confidence for a few days ahead. The average pattern of weather at a place over many years is called its <b>climate</b>.
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-[#ddd] pt-1 text-[6px] text-[#888]">
        <span>Weather and Climate</span><span>27</span>
      </div>
    </div>
  )
}

function WaterCycle() {
  return (
    <svg viewBox="0 0 120 70" className="h-[70px] w-full rounded-sm border border-[#e5e5e5] bg-[#f3f7fb]">
      <circle cx="100" cy="14" r="8" fill="#f6c343" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1={100 + Math.cos((a * Math.PI) / 180) * 10} y1={14 + Math.sin((a * Math.PI) / 180) * 10} x2={100 + Math.cos((a * Math.PI) / 180) * 13} y2={14 + Math.sin((a * Math.PI) / 180) * 13} stroke="#f6c343" strokeWidth="1" />
      ))}
      <path d="M0 48 L22 26 L38 40 L52 22 L74 48 Z" fill="#8fae7a" />
      <rect x="0" y="48" width="120" height="22" fill="#79b4de" />
      <path d="M0 52 Q10 49 20 52 T40 52 T60 52 T80 52 T100 52 T120 52" stroke="#5e9ccc" strokeWidth="0.8" fill="none" />
      <ellipse cx="40" cy="16" rx="12" ry="5" fill="#fff" stroke="#bbb" strokeWidth="0.5" />
      <ellipse cx="50" cy="13" rx="9" ry="5" fill="#fff" stroke="#bbb" strokeWidth="0.5" />
      <ellipse cx="31" cy="14" rx="7" ry="4" fill="#fff" stroke="#bbb" strokeWidth="0.5" />
      <path d="M95 46 L95 24" stroke="#d9480f" strokeWidth="0.8" strokeDasharray="1.5 1" markerEnd="url(#a)" />
      <path d="M44 22 L44 44" stroke="#1c7ed6" strokeWidth="0.8" strokeDasharray="1.5 1" />
      <text x="97" y="36" fontSize="4.2" fill="#d9480f">evaporation</text>
      <text x="46" y="34" fontSize="4.2" fill="#1c7ed6">precipitation</text>
      <text x="2" y="63" fontSize="4.2" fill="#fff">collection (sea)</text>
      <text x="26" y="8" fontSize="4.2" fill="#555">condensation</text>
    </svg>
  )
}
