import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  Check,
  CheckCheck,
  ChevronLeft,
  Eye,
  Link2,
  Lock,
  Send,
  Wallet,
} from 'lucide-react'
import { PhoneFrame } from './DeviceFrame'
import { Stage } from './Stage'
import { CaptionRail } from './CaptionRail'
import { Stream } from './Stream'
import { useCycle } from './useCycle'

const INK = '#15181d'
const MUTED = '#6b7280'
const LINE = '#e5e7eb'
const ACCENT = '#d9485f'
const GREEN = '#15803d'

const CAPTIONS = [
  'Snap the bill the moment you spend — amount and vendor read from the photo',
  'The line producer approves from the set; the wallet balance updates',
  'The producer sees today’s spend live and taps through to the bill',
  'One call sheet link per person — see who opened and who confirmed',
  'A scoped brief behind a private link — never the whole script',
]

/**
 * Film Ops in use, one phone, five hands: a spot boy submitting a bill, the
 * line producer approving it, the producer's live spend, the AD's call sheet
 * confirmations and a director's private song brief. Names and amounts are
 * illustrative — nothing here is a measured figure.
 */
export function FilmOpsDemo() {
  const step = useCycle(14, 1500)
  const scene = step <= 3 ? 0 : step <= 6 ? 1 : step <= 8 ? 2 : step <= 11 ? 3 : 4

  return (
    <PhoneFrame className="h-full">
      <Stage width={300} height={620}>
        <div
          className="relative h-full w-full overflow-hidden bg-[#f4f5f7]"
          style={{ color: INK }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={scene}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bottom-9"
            >
              {scene === 0 && <Spend step={step} />}
              {scene === 1 && <Approve step={step} />}
              {scene === 2 && <Dashboard step={step} />}
              {scene === 3 && <CallSheet step={step} />}
              {scene === 4 && <Brief step={step} />}
            </motion.div>
          </AnimatePresence>

          <CaptionRail steps={CAPTIONS} current={scene} tint={ACCENT} />
        </div>
      </Stage>
    </PhoneFrame>
  )
}

/* ---------- shared bits ---------- */

function Header({ title, sub, who }: { title: string; sub?: string; who: string }) {
  return (
    <header className="flex items-center gap-2 bg-white px-4 pt-9 pb-3" style={{ borderBottom: `1px solid ${LINE}` }}>
      <ChevronLeft className="h-4 w-4" style={{ color: MUTED }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-none">{title}</p>
        {sub && <p className="mt-1 truncate text-[10px]" style={{ color: MUTED }}>{sub}</p>}
      </div>
      <span className="rounded-full px-2 py-[3px] text-[9px] font-medium" style={{ backgroundColor: '#fde8ec', color: ACCENT }}>
        {who}
      </span>
    </header>
  )
}

/** A fingertip ripple — the phone equivalent of the cursor click. */
function Tap({ on, className }: { on: boolean; className: string }) {
  if (!on) return null
  return (
    <motion.span
      initial={{ scale: 0.4, opacity: 0.6 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`pointer-events-none absolute z-20 h-7 w-7 rounded-full ${className}`}
      style={{ backgroundColor: ACCENT }}
    />
  )
}

function Field({ label, value, active, delay = 0 }: { label: string; value: string; active: boolean; delay?: number }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2" style={{ border: `1px solid ${LINE}` }}>
      <p className="text-[8.5px] uppercase tracking-wide" style={{ color: MUTED }}>{label}</p>
      <p className="mt-[2px] h-[14px] text-[12px] font-medium">
        <Stream text={value} active={active} delay={delay} speed={2} />
      </p>
    </div>
  )
}

function Button({ label, done, icon, muted }: { label: string; done?: boolean; icon?: React.ReactNode; muted?: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: done ? GREEN : muted ? '#e5e7eb' : INK }}
      className="flex h-9 items-center justify-center gap-1.5 rounded-xl text-[12px] font-medium"
      style={{ color: muted && !done ? MUTED : '#fff' }}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : icon}
      {label}
    </motion.div>
  )
}

/* ---------- scene 0: spot boy submits a bill ---------- */

function Spend({ step }: { step: number }) {
  const shot = step >= 1
  const sent = step >= 3
  return (
    <div className="flex h-full flex-col">
      <Header title="New expense" sub="Wallet · ₹8,400 left" who="Vijay · Art" />
      <div className="flex-1 space-y-2.5 px-4 py-3">
        {/* Camera / photo */}
        <div className="relative h-[150px] overflow-hidden rounded-xl bg-[#1b1f24]">
          <motion.div
            initial={false}
            animate={{ opacity: shot ? 1 : 0, scale: shot ? 1 : 1.08 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Receipt />
          </motion.div>
          {!shot && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="h-10 w-10 rounded-full border-[3px] border-white/90" />
              <span className="text-[9px] text-white/70">Tap to photograph the bill</span>
            </div>
          )}
          <Tap on={step === 0} className="left-1/2 top-1/2 -ml-3.5 -mt-3.5" />
          <motion.span
            initial={false}
            animate={{ opacity: step === 1 ? 1 : 0 }}
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/60 py-1 text-[9px] text-white"
          >
            <Camera className="h-3 w-3" /> Reading the bill…
          </motion.span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Amount" value="₹1,240" active={step >= 2} />
          <Field label="Paid to" value="Saravana Stores" active={step >= 2} delay={300} />
          <Field label="Category" value="Art / props" active={step >= 2} delay={600} />
          <Field label="Mode" value="Cash" active={step >= 2} delay={800} />
        </div>
        <Field label="GSTIN (from bill)" value="33AAHCS2781K1ZV · GST ₹189" active={step >= 2} delay={1000} />
        <p className="text-[8.5px]" style={{ color: MUTED }}>Pre-filled from the photo. Check it, then send.</p>
      </div>
      <div className="relative px-4 pb-4">
        <Button label={sent ? 'Sent · pending approval' : 'Send'} done={sent} icon={<Send className="h-3.5 w-3.5" />} />
        <Tap on={step === 2} className="left-1/2 top-1 -ml-3.5" />
      </div>
    </div>
  )
}

function Receipt() {
  return (
    <div className="w-[110px] rotate-[-4deg] bg-[#fdfcf7] px-2.5 py-2 text-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.6)]" style={{ fontFamily: '"Courier New", monospace' }}>
      <p className="text-center text-[7px] font-bold">SARAVANA STORES</p>
      <p className="text-center text-[5px]">T. Nagar · GSTIN 33AAHCS2781K1ZV</p>
      <div className="my-1 border-t border-dashed border-[#bbb]" />
      {[['Brass lamp x2', '640'], ['Jute rope 20m', '310'], ['Paint, ochre', '101']].map(([k, v]) => (
        <p key={k} className="flex justify-between text-[5.5px]"><span>{k}</span><span>{v}</span></p>
      ))}
      <div className="my-1 border-t border-dashed border-[#bbb]" />
      <p className="flex justify-between text-[5.5px]"><span>GST 18%</span><span>189</span></p>
      <p className="flex justify-between text-[7px] font-bold"><span>TOTAL</span><span>1240</span></p>
    </div>
  )
}

/* ---------- scene 1: line producer approves ---------- */

const QUEUE = [
  { who: 'Vijay · Art', what: 'Saravana Stores · props', amt: '₹1,240', photo: true },
  { who: 'Mani · Transport', what: 'Diesel, unit van', amt: '₹3,000', photo: true },
  { who: 'Kala · Costume', what: 'Tailor advance', amt: '₹2,500', photo: false },
]

function Approve({ step }: { step: number }) {
  const approved = step >= 6
  return (
    <div className="flex h-full flex-col">
      <Header title="Approvals" sub="Day 14 · 3 waiting" who="Priya · LP" />
      <div className="flex-1 space-y-2 px-4 py-3">
        {QUEUE.map((q, i) => {
          const first = i === 0
          return (
            <motion.div
              key={q.who}
              initial={false}
              animate={{ opacity: step >= 4 || !first ? 1 : 0, y: step >= 4 || !first ? 0 : -8 }}
              className="relative rounded-xl bg-white p-3"
              style={{ border: `1px solid ${first && approved ? GREEN : LINE}` }}
            >
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#1b1f24]">
                  {q.photo ? <span className="h-6 w-4 bg-[#fdfcf7]" /> : <span className="text-[7px] text-white/60">no bill</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold">{q.amt} <span className="font-normal" style={{ color: MUTED }}>· {q.who}</span></p>
                  <p className="truncate text-[9.5px]" style={{ color: MUTED }}>{q.what}</p>
                </div>
              </div>
              {first ? (
                <div className="relative mt-2.5 grid grid-cols-2 gap-2 text-[10.5px]">
                  <Button label="Query" muted />
                  <Button label={approved ? 'Approved' : 'Approve'} done={approved} />
                  <Tap on={step === 5} className="right-10 top-1" />
                </div>
              ) : (
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10.5px]">
                  <Button label="Query" muted />
                  <Button label="Approve" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
      <div className="mx-4 mb-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5" style={{ border: `1px solid ${LINE}` }}>
        <Wallet className="h-4 w-4" style={{ color: ACCENT }} />
        <p className="text-[10.5px]">Vijay’s wallet</p>
        <motion.p key={approved ? 'a' : 'b'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="ml-auto text-[12px] font-semibold tabular-nums">
          {approved ? '₹7,160' : '₹8,400'}
        </motion.p>
      </div>
    </div>
  )
}

/* ---------- scene 2: producer's live spend ---------- */

const DEPTS = [
  { name: 'Art / props', pct: 78, amt: '₹24,900' },
  { name: 'Transport & fuel', pct: 55, amt: '₹17,600' },
  { name: 'Food & catering', pct: 48, amt: '₹15,300' },
  { name: 'Batta / daily wages', pct: 36, amt: '₹11,500' },
  { name: 'Costume & makeup', pct: 20, amt: '₹6,400' },
]

function Dashboard({ step }: { step: number }) {
  const on = step >= 7
  return (
    <div className="flex h-full flex-col">
      <Header title="Spend · Today" sub="Day 14 · Pollachi unit" who="Producer" />
      <div className="flex-1 space-y-3 px-4 py-3">
        <div className="rounded-xl bg-white p-3.5" style={{ border: `1px solid ${LINE}` }}>
          <p className="text-[9px] uppercase tracking-wide" style={{ color: MUTED }}>Approved today</p>
          <p className="mt-1 text-[26px] font-semibold leading-none tabular-nums">₹75,700</p>
          <div className="mt-2.5 flex gap-4 text-[9.5px]" style={{ color: MUTED }}>
            <span>Pending <b style={{ color: INK }}>₹5,500</b></span>
            <span>Cash with crew <b style={{ color: INK }}>₹42,000</b> · 6 wallets</span>
          </div>
        </div>

        <div className="relative rounded-xl bg-white p-3.5" style={{ border: `1px solid ${LINE}` }}>
          <Tap on={step === 7} className="left-10 top-9" />
          <p className="text-[9px] uppercase tracking-wide" style={{ color: MUTED }}>By department</p>
          <div className="mt-2 space-y-2">
            {DEPTS.map((d, i) => (
              <div key={d.name}>
                <div className="flex justify-between text-[9.5px]">
                  <span>{d.name}</span>
                  <span className="tabular-nums" style={{ color: MUTED }}>{d.amt}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eef0f3]">
                  <motion.span
                    initial={false}
                    animate={{ width: on ? `${d.pct}%` : '0%' }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                    className="block h-full rounded-full"
                    style={{ backgroundColor: i === 0 ? ACCENT : INK }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: step >= 8 ? 1 : 0, y: step >= 8 ? 0 : 6 }}
          className="relative flex items-center gap-2.5 rounded-xl bg-white p-3"
          style={{ border: `1px solid ${LINE}` }}
        >
          <span className="h-8 w-6 shrink-0 bg-[#fdfcf7] shadow" />
          <div className="min-w-0 flex-1 text-[9.5px]">
            <p className="font-semibold" style={{ color: INK }}>₹1,240 · Saravana Stores</p>
            <p style={{ color: MUTED }}>Vijay · Art / props · approved by Priya, 4:12 pm</p>
          </div>
          <Eye className="h-3.5 w-3.5" style={{ color: MUTED }} />
        </motion.div>
      </div>
    </div>
  )
}

/* ---------- scene 3: AD's call sheet, who confirmed ---------- */

const CREW = [
  { name: 'Arjun (lead)', call: '6:30 am', at: 9 },
  { name: 'Meera (lead)', call: '7:00 am', at: 10 },
  { name: 'Ravi · DOP', call: '5:30 am', at: 9 },
  { name: 'Shanthi · Makeup', call: '5:00 am', at: 10 },
  { name: 'Kumar · Lights', call: '5:30 am', at: 11 },
  { name: 'Mani · Transport', call: '4:45 am', at: 99 },
]

function CallSheet({ step }: { step: number }) {
  const confirmed = CREW.filter((c) => step >= c.at).length
  return (
    <div className="flex h-full flex-col">
      <Header title="Call sheet · Day 15" sub="v3 · published 10:48 pm" who="Deepak · 1st AD" />
      <div className="flex-1 px-4 py-3">
        <div className="rounded-xl bg-white p-3" style={{ border: `1px solid ${LINE}` }}>
          <div className="flex items-center justify-between text-[9.5px]">
            <span style={{ color: MUTED }}>General call <b style={{ color: INK }}>6:00 am</b> · Aliyar dam road</span>
            <span className="rounded-full px-1.5 py-[2px] text-[8px] font-medium" style={{ backgroundColor: '#fde8ec', color: ACCENT }}>v3 · location changed</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[9px]">
            {[['Sent', 6], ['Opened', Math.min(6, confirmed + 1)], ['Confirmed', confirmed]].map(([k, v]) => (
              <div key={k as string} className="rounded-lg bg-[#f4f5f7] py-1.5">
                <p className="text-[14px] font-semibold tabular-nums">{v}</p>
                <p style={{ color: MUTED }}>{k}</p>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-2.5 overflow-hidden rounded-xl bg-white" style={{ border: `1px solid ${LINE}` }}>
          {CREW.map((c, i) => {
            const ok = step >= c.at
            const opened = !ok && step >= c.at - 1
            return (
              <li key={c.name} className="flex items-center gap-2 px-3 py-[7px] text-[10px]" style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}>
                <span className="h-5 w-5 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, #cbd5e1, #94a3b8)` }} />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="tabular-nums" style={{ color: MUTED }}>{c.call}</span>
                <motion.span
                  key={ok ? 'ok' : opened ? 'op' : 'sent'}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex w-[64px] items-center justify-end gap-1 text-[8.5px] font-medium"
                  style={{ color: ok ? GREEN : opened ? INK : MUTED }}
                >
                  {ok ? <><CheckCheck className="h-3 w-3" /> Confirmed</> : opened ? <><Eye className="h-3 w-3" /> Opened</> : <><Check className="h-3 w-3" /> Sent</>}
                </motion.span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="px-4 pb-4">
        <Button label={`Call the rest (${6 - confirmed})`} muted={confirmed === 6} />
      </div>
    </div>
  )
}

/* ---------- scene 4: director's private song brief ---------- */

function Brief({ step }: { step: number }) {
  const opened = step >= 13
  return (
    <div className="flex h-full flex-col">
      <Header title="Brief · Song 2" sub="Private link · 1 recipient" who="Director" />
      <div className="flex-1 space-y-2.5 px-4 py-3">
        <div className="rounded-xl bg-white p-3.5" style={{ border: `1px solid ${LINE}` }}>
          <p className="text-[9px] uppercase tracking-wide" style={{ color: MUTED }}>Situation</p>
          <p className="mt-1 text-[11px] leading-snug">
            Night. Meera walks home after the fight with her father. She is not sad — she is relieved, and ashamed of being relieved.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[9px]">
            {[['Mood', 'Quiet, warm'], ['Length', '4:10'], ['Placement', 'After sc. 42']].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-[#f4f5f7] py-1.5">
                <p className="font-semibold">{v}</p>
                <p style={{ color: MUTED }}>{k}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] uppercase tracking-wide" style={{ color: MUTED }}>References</p>
          <div className="mt-1 flex gap-1.5">
            {['Scratch hum · 0:48', 'Kannathil… · 1:12'].map((r) => (
              <span key={r} className="rounded-md px-2 py-1 text-[9px]" style={{ backgroundColor: '#f4f5f7' }}>▶ {r}</span>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1 text-[8.5px]" style={{ color: MUTED }}>
            <Lock className="h-2.5 w-2.5" /> Script not attached. Scene 42 excerpt only.
          </p>
        </div>

        <div className="rounded-xl bg-white p-3" style={{ border: `1px solid ${opened ? GREEN : LINE}` }}>
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 shrink-0 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24, #fb7185)' }} />
            <div className="min-w-0 flex-1 text-[10px]">
              <p className="font-semibold">Santhosh · Music director</p>
              <motion.p key={opened ? 'o' : 's'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: opened ? GREEN : MUTED }}>
                {opened ? 'Opened · 9:42 pm · view only' : 'Link sent · expires in 7 days'}
              </motion.p>
            </div>
            {opened ? <Eye className="h-4 w-4" style={{ color: GREEN }} /> : <Link2 className="h-4 w-4" style={{ color: MUTED }} />}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <Button label="Revoke link" muted />
      </div>
    </div>
  )
}
