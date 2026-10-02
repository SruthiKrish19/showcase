import { motion } from 'framer-motion'
import { Check, Download, FileText, Lock, Mic, Paperclip, Sparkles } from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { Cursor } from './Cursor'
import { CaptionRail } from './CaptionRail'
import { Stream } from './Stream'
import { useCycle } from './useCycle'

const CHAT: { from: 'bot' | 'user'; text: string; at: number }[] = [
  { from: 'bot', text: 'Let’s do your work history. Where did you last work, and roughly when did you stop?', at: 0 },
  { from: 'user', text: 'Brightline Logistics, in the warehouse. I stopped last November.', at: 1 },
  { from: 'bot', text: 'Got it. What did a normal shift look like there?', at: 2 },
  { from: 'user', text: 'Loading and sorting parcels. On my feet the whole shift, lifting boxes up to about 40 pounds.', at: 3 },
  { from: 'bot', text: 'Thanks — I’ve filled Section 4 from that. I used “Warehouse Associate” as the job title; tap any box to change it.', at: 5 },
]

const SECTIONS = ['Information', 'Contacts', 'Conditions', 'Work history', 'Education', 'Medications', 'Tests', 'Providers', 'Remarks']

const CAPTIONS = [
  'Answer plain questions in your own words — typed or spoken',
  'The assistant maps each answer onto the official form, field by field',
  'Checkboxes, dates and unit conversions are handled for you',
  'Export the finished PDF, laid out exactly as the agency expects',
]

export function FormFillDemo() {
  const step = useCycle(10, 1350)
  const typing = step === 4
  const exported = step >= 9
  const caption = step <= 1 ? 0 : step <= 5 ? 1 : step <= 7 ? 2 : 3
  const pct = step < 2 ? 36 : step < 4 ? 41 : step < 6 ? 46 : step < 8 ? 50 : 52

  return (
    <BrowserFrame url="app.formwise.co/cases/2841/ssa-3368-bk/section-4" tabTitle="Work history · Formwise" className="h-full">
      <Stage width={760} height={500}>
        <div className="relative h-full w-full overflow-hidden bg-[#eef0f3] text-[#1b1f24]">
          <div className="absolute inset-x-0 top-0 bottom-9 flex">
          {/* Chat */}
          <section className="flex w-[292px] shrink-0 flex-col border-r border-[#dfe3e8] bg-white">
            <header className="flex items-center gap-2 border-b border-[#eceff2] px-4 py-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1b1f24] text-white"><Sparkles className="h-3 w-3" /></span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold leading-none">Formwise</p>
                <p className="mt-[3px] truncate text-[9.5px] text-[#6b7280]">Disability Report · SSA-3368-BK</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-[9px] text-[#6b7280]"><Lock className="h-2.5 w-2.5" /> Encrypted</span>
            </header>

            <div className="flex min-h-0 flex-1 flex-col justify-end space-y-2.5 overflow-hidden px-4 py-3">
              <p className="text-center text-[9px] text-[#9aa1ab]">Section 4 of 9 · Work history</p>
              {CHAT.map((m) => {
                const on = step >= m.at
                const bot = m.from === 'bot'
                return (
                  <motion.div
                    key={m.text}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8, height: on ? 'auto' : 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex ${bot ? '' : 'justify-end'}`}
                  >
                    <p className={`max-w-[220px] rounded-2xl px-3 py-2 text-[11px] leading-snug ${bot ? 'rounded-tl-sm bg-[#f1f3f6]' : 'rounded-tr-sm bg-[#1b1f24] text-white'}`}>
                      {bot ? <Stream text={m.text} active={on} speed={3} /> : m.text}
                    </p>
                  </motion.div>
                )
              })}
              <motion.div initial={false} animate={{ opacity: typing ? 1 : 0 }} className="flex gap-1 pl-3">
                {[0, 1, 2].map((n) => (
                  <motion.span key={n} className="h-1.5 w-1.5 rounded-full bg-[#9aa1ab]" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: n * 0.15 }} />
                ))}
              </motion.div>
            </div>

            <div className="border-t border-[#eceff2] p-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#dfe3e8] px-3 py-2">
                <Paperclip className="h-3 w-3 text-[#9aa1ab]" />
                <span className="flex-1 text-[10.5px] text-[#9aa1ab]">Type or speak your answer…</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1b1f24]"><Mic className="h-2.5 w-2.5 text-white" /></span>
              </div>
              <p className="mt-1.5 text-center text-[8.5px] text-[#9aa1ab]">Nothing is submitted until you review every page.</p>
            </div>
          </section>

          {/* Form viewer */}
          <section className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center gap-3 border-b border-[#dfe3e8] bg-white px-4 py-2">
              <FileText className="h-3.5 w-3.5 text-[#6b7280]" />
              <span className="text-[11px] font-medium">SSA-3368-BK · Section 4</span>
              <div className="ml-2 flex flex-1 gap-[3px]">
                {SECTIONS.map((s, n) => (
                  <span key={s} title={s} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: n < 3 ? '#1b1f24' : n === 3 ? '#4f46e5' : '#dfe3e8' }} />
                ))}
              </div>
              <span className="text-[10px] tabular-nums text-[#6b7280]">{pct}% complete</span>
              <motion.span
                initial={false}
                animate={{ backgroundColor: exported ? '#15803d' : '#1b1f24' }}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-[5px] text-[10px] font-medium text-white"
              >
                {exported ? <><Check className="h-3 w-3" /> PDF ready</> : <><Download className="h-3 w-3" /> Export PDF</>}
              </motion.span>
            </header>

            <div className="relative flex-1 overflow-hidden p-4">
              <Paper step={step} />
              <motion.div
                initial={false}
                animate={{ opacity: exported ? 1 : 0, y: exported ? 0 : 8 }}
                className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-[#1b1f24] px-3 py-2 text-[10px] text-white shadow-xl"
              >
                <FileText className="h-3.5 w-3.5 text-[#a3e635]" /> SSA-3368-BK_Daniels.pdf · 15 pages · ready to review
              </motion.div>
            </div>
          </section>
          </div>

          <Cursor
            x={step <= 1 ? 150 : step <= 7 ? 520 : 700}
            y={step <= 1 ? 440 : step <= 7 ? 250 : 70}
            clicking={step === 8}
          />
          <CaptionRail steps={CAPTIONS} current={caption} tint="#7c5cff" />
        </div>
      </Stage>
    </BrowserFrame>
  )
}

/* The paper form — modelled on the real SSA layout: black section bars,
   boxed fields with tiny caps labels, OMB number, form footer. */

function Box({ label, value, active, delay = 0, className = '', lines = 1 }: { label: string; value: string; active: boolean; delay?: number; className?: string; lines?: number }) {
  return (
    <div className={`border border-black px-1.5 py-1 ${className}`} style={{ minHeight: lines > 1 ? lines * 11 + 14 : undefined }}>
      <p className="text-[5.6px] uppercase leading-none text-[#333]">{label}</p>
      <p className="mt-[3px] text-[8px] leading-[1.35]" style={{ fontFamily: '"Courier New", Courier, monospace', color: '#1d3fb4' }}>
        <Stream text={value} active={active} delay={delay} speed={2} />
      </p>
    </div>
  )
}

function Tick({ label, on, delay = 0 }: { label: string; on: boolean; delay?: number }) {
  return (
    <span className="flex items-center gap-[3px] text-[6.5px]">
      <span className="flex h-[7px] w-[7px] items-center justify-center border border-black">
        <motion.span initial={false} animate={{ scale: on ? 1 : 0 }} transition={{ delay: on ? delay : 0, type: 'spring', stiffness: 500, damping: 20 }}>
          <Check className="h-[6px] w-[6px]" strokeWidth={4} style={{ color: '#1d3fb4' }} />
        </motion.span>
      </span>
      {label}
    </span>
  )
}

function Paper({ step }: { step: number }) {
  const f1 = step >= 2
  const f2 = step >= 3
  const f3 = step >= 5
  const f4 = step >= 6
  const f5 = step >= 7
  return (
    <div className="mx-auto h-full w-[420px] bg-white px-5 pt-4 shadow-[0_6px_24px_rgba(20,30,50,0.16)]" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#111' }}>
      <div className="flex items-start justify-between text-[6px] leading-tight">
        <div>
          <p className="font-bold">SOCIAL SECURITY ADMINISTRATION</p>
          <p className="mt-[2px]">Form SSA-3368-BK</p>
        </div>
        <div className="text-right">
          <p>Form Approved</p>
          <p>OMB No. 0960-0160</p>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] font-bold tracking-wide">DISABILITY REPORT – ADULT</p>

      <div className="mt-2 bg-black px-1.5 py-[3px] text-[7px] font-bold text-white">SECTION 4 – WORK HISTORY</div>
      <p className="mt-1 text-[6px] leading-snug text-[#333]">
        Tell us about the job you held the longest in the 15 years before you became unable to work. If you are unsure of exact dates, give your best estimate.
      </p>

      <div className="mt-1.5 grid grid-cols-[1.3fr_1fr]">
        <Box label="4.A  Job title" value="Warehouse Associate" active={f1} className="border-r-0" />
        <Box label="Type of business" value="Parcel logistics" active={f1} delay={500} />
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] border-t-0">
        <Box label="4.B  Dates worked – from (mm/yyyy)" value="03/2021" active={f1} delay={900} className="border-t-0 border-r-0" />
        <Box label="To (mm/yyyy)" value="11/2024" active={f1} delay={1100} className="border-t-0 border-r-0" />
        <Box label="Hours per day" value="8" active={f2} className="border-t-0 border-r-0" />
        <Box label="Days per week" value="5" active={f2} delay={200} className="border-t-0" />
      </div>
      <div className="grid grid-cols-[1fr_1fr_1.4fr]">
        <Box label="4.C  Rate of pay" value="$17.25" active={f2} delay={400} className="border-t-0 border-r-0" />
        <Box label="Per" value="Hour" active={f2} delay={600} className="border-t-0 border-r-0" />
        <Box label="Supervised other people?" value="No" active={f2} delay={800} className="border-t-0" />
      </div>
      <Box
        label="4.D  Describe this job. What did you do all day?"
        value="Loaded and unloaded delivery trucks, sorted parcels onto conveyor lines by route, scanned items and stacked outbound pallets. Standing and walking for the full shift."
        active={f3}
        lines={4}
        className="border-t-0"
      />

      <div className="border border-t-0 border-black px-1.5 py-1">
        <p className="text-[5.6px] uppercase text-[#333]">4.E  In this job, how many hours each day did you:</p>
        <div className="mt-1 grid grid-cols-4 gap-y-1">
          <Tick label="Walk · 6" on={f4} />
          <Tick label="Stand · 7" on={f4} delay={0.1} />
          <Tick label="Sit · 1" on={f4} delay={0.2} />
          <Tick label="Climb" on={false} />
          <Tick label="Stoop · 3" on={f4} delay={0.3} />
          <Tick label="Kneel" on={false} />
          <Tick label="Crouch" on={false} />
          <Tick label="Handle large objects · 6" on={f4} delay={0.4} />
        </div>
      </div>

      <div className="border border-t-0 border-black px-1.5 py-1">
        <p className="text-[5.6px] uppercase text-[#333]">4.F  Heaviest weight lifted</p>
        <div className="mt-1 flex gap-2.5">
          {['Less than 10 lbs', '10 lbs', '20 lbs', '25 lbs', '50 lbs', '100 lbs or more'].map((w) => (
            <Tick key={w} label={w} on={f5 && w === '50 lbs'} />
          ))}
        </div>
        <motion.p initial={false} animate={{ opacity: f5 ? 1 : 0 }} className="mt-1 text-[5.8px] italic text-[#4f46e5]">
          “about 40 pounds” → rounded up to the next bracket on the form (50 lbs)
        </motion.p>
      </div>

      <div className="mt-2 flex items-center justify-between text-[5.6px] text-[#333]">
        <span>Form SSA-3368-BK (05-2024) UF</span>
        <span>Page 4 of 15</span>
      </div>
    </div>
  )
}
