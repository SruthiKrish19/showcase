import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarPlus,
  Check,
  CheckCheck,
  ChevronLeft,
  Download,
  Eye,
  FileUp,
  Link2,
  Lock,
  MapPin,
  Pencil,
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

/* Tag colours — Finder-style labels on the script */
const TAG = {
  character: { bg: '#fde8ec', fg: '#b91c1c' },
  prop: { bg: '#fef3c7', fg: '#92400e' },
  location: { bg: '#dbeafe', fg: '#1d4ed8' },
  costume: { bg: '#ede9fe', fg: '#6d28d9' },
}

const CAPTIONS = [
  'Import the script and tag it once — characters, props, locations. Scenes attach to shoot days.',
  'On set, a spender captures a bill in one page, tagged to the scene. The LP approves within their band.',
  'Money is India-native: lakh and crore, GST and TDS tags, Tally export with your own ledger names.',
  'One call sheet link per person. Sent, opened, confirmed — and a “call the rest” list.',
  'The actor’s page for today: call time, directions, own scenes, own lines. Calendar in one tap.',
  'Availability by link: a manager marks free dates with no login; the AD sees where the cast overlaps.',
  'A scoped brief behind a private link — expiring, revocable, watermarked. Never the whole script.',
  'Every role gets an inbox of what needs their action. It empties as they act.',
]

/* Step ranges per scene. The caption index is which sentence above applies. */
const SCENES = [
  { to: 3, caption: 0 }, // script & tags
  { to: 6, caption: 1 }, // spender
  { to: 8, caption: 1 }, // LP approves
  { to: 10, caption: 2 }, // accountant export
  { to: 13, caption: 3 }, // AD call sheet
  { to: 15, caption: 4 }, // actor's page
  { to: 18, caption: 5 }, // availability
  { to: 20, caption: 6 }, // brief
  { to: 22, caption: 7 }, // inbox
]
const STEPS = SCENES[SCENES.length - 1].to + 1

/**
 * Ciniops in use, one phone, many hands. The scenes follow the feature
 * list's USPs and P0s only: tagged script, cash on set, India-native money,
 * call sheet links, the actor's page, availability by link, scoped briefs
 * and the inbox. Names and amounts are illustrative fixture data.
 */
export function CiniopsDemo() {
  const step = useCycle(STEPS, 1500)
  const scene = SCENES.findIndex((s) => step <= s.to)

  return (
    <PhoneFrame className="h-full">
      <Stage width={300} height={620}>
        <div className="relative h-full w-full overflow-hidden bg-[#f4f5f7]" style={{ color: INK }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={scene}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bottom-9"
            >
              {scene === 0 && <Script step={step} />}
              {scene === 1 && <Spend step={step} />}
              {scene === 2 && <Approve step={step} />}
              {scene === 3 && <Money step={step} />}
              {scene === 4 && <CallSheet step={step} />}
              {scene === 5 && <ActorPage step={step} />}
              {scene === 6 && <Availability step={step} />}
              {scene === 7 && <Brief step={step} />}
              {scene === 8 && <Inbox step={step} />}
            </motion.div>
          </AnimatePresence>

          <CaptionRail steps={CAPTIONS} current={SCENES[scene].caption} tint={ACCENT} />
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
      <span className="shrink-0 rounded-full px-2 py-[3px] text-[9px] font-medium" style={{ backgroundColor: '#fde8ec', color: ACCENT }}>
        {who}
      </span>
    </header>
  )
}

function Card({ children, className = '', border = LINE }: { children: React.ReactNode; className?: string; border?: string }) {
  return (
    <div className={`rounded-xl bg-white ${className}`} style={{ border: `1px solid ${border}` }}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[8.5px] uppercase tracking-wide" style={{ color: MUTED }}>{children}</p>
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
    <Card className="px-3 py-2">
      <Label>{label}</Label>
      <p className="mt-[2px] h-[14px] text-[12px] font-medium">
        <Stream text={value} active={active} delay={delay} speed={2} caret />
      </p>
    </Card>
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

function Toast({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
      className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[10px] text-white shadow-xl"
      style={{ backgroundColor: INK }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- scene 0: the script, tagged once ---------- */

function Tagged({ kind, on, children }: { kind: keyof typeof TAG; on: boolean; children: string }) {
  const t = TAG[kind]
  return (
    <motion.span
      initial={false}
      animate={{ backgroundColor: on ? t.bg : 'rgba(255,255,255,0)', color: on ? t.fg : INK }}
      transition={{ duration: 0.4 }}
      className="rounded-[3px] px-[2px] font-medium"
    >
      {children}
    </motion.span>
  )
}

function Script({ step }: { step: number }) {
  const imported = step >= 1
  const tagged = step >= 2
  const attached = step >= 3
  return (
    <div className="relative flex h-full flex-col">
      <Header title="Meera · script v3" sub={imported ? '118 scenes · tagged 311 items' : 'Importing…'} who="Director" />
      <div className="flex-1 space-y-2.5 px-4 py-3">
        <motion.div initial={false} animate={{ opacity: imported ? 1 : 0.35 }}>
          <Card className="px-4 py-3" border={attached ? GREEN : LINE}>
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold tracking-wide" style={{ color: MUTED }}>42 · EXT. STREET OUTSIDE MEERA’S HOUSE — NIGHT</p>
              <motion.span initial={false} animate={{ opacity: attached ? 1 : 0 }} className="rounded-full px-1.5 py-[2px] text-[8px] font-medium text-white" style={{ backgroundColor: GREEN }}>
                Day 15
              </motion.span>
            </div>
            <p className="mt-2 text-[10.5px] leading-[1.55]" style={{ fontFamily: '"Courier New", monospace' }}>
              <Tagged kind="character" on={tagged}>MEERA</Tagged> walks away from the <Tagged kind="location" on={tagged}>house</Tagged>, still in the <Tagged kind="costume" on={tagged}>wedding saree</Tagged>. A <Tagged kind="prop" on={tagged}>brass lamp</Tagged> burns in the window behind her. Her <Tagged kind="character" on={tagged}>FATHER</Tagged> does not come to the door.
            </p>
            <p className="mt-2 pl-10 text-[10.5px] leading-[1.55]" style={{ fontFamily: '"Courier New", monospace' }}>
              <span className="block pl-6">MEERA</span>
              Appa, I’m not coming back tonight.
            </p>
          </Card>
        </motion.div>

        <motion.div initial={false} animate={{ opacity: tagged ? 1 : 0, y: tagged ? 0 : 6 }}>
          <Card className="px-3.5 py-3">
            <div className="flex items-center justify-between">
              <Label>Tags in this scene</Label>
              <span className="text-[8.5px]" style={{ color: MUTED }}>tap to filter</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {([
                ['Meera', 'character', '61 sc'],
                ['Father', 'character', '14 sc'],
                ['Brass lamp', 'prop', '3 sc'],
                ['Wedding saree', 'costume', '5 sc'],
                ['Meera’s house', 'location', '9 sc'],
              ] as const).map(([name, kind, n]) => (
                <span key={name} className="rounded-md px-2 py-1 text-[9.5px] font-medium" style={{ backgroundColor: TAG[kind].bg, color: TAG[kind].fg }}>
                  {name} <span className="opacity-60">· {n}</span>
                </span>
              ))}
            </div>
            <div className="relative mt-2.5 rounded-lg px-2.5 py-2 text-[9.5px]" style={{ backgroundColor: '#f4f5f7' }}>
              <span className="font-medium">Brass lamp</span> <span style={{ color: MUTED }}>· prop · scenes 12, 42, 77 · Art dept</span>
              <Tap on={step === 2} className="-top-6 left-12" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={false} animate={{ opacity: attached ? 1 : 0, y: attached ? 0 : 6 }}>
          <Card className="flex items-center gap-2.5 px-3.5 py-2.5" border={GREEN}>
            <CheckCheck className="h-4 w-4 shrink-0" style={{ color: GREEN }} />
            <p className="text-[9.5px] leading-snug">
              <b>Scene 42 attached to Day 15.</b> <span style={{ color: MUTED }}>Shot list, call sheet and props list updated from it.</span>
            </p>
          </Card>
        </motion.div>
      </div>

      <Toast on={!imported}>
        <FileUp className="h-3.5 w-3.5" style={{ color: '#fbbf24' }} /> Meera_v3.pdf · reading 118 scenes…
      </Toast>
    </div>
  )
}

/* ---------- scene 1: spender captures a bill ---------- */

function Spend({ step }: { step: number }) {
  const shot = step >= 5
  const sent = step >= 6
  return (
    <div className="flex h-full flex-col">
      <Header title="New expense" sub="Wallet · ₹8,400 left" who="Vijay · Art" />
      <div className="flex-1 space-y-2 px-4 py-3">
        <div className="relative h-[128px] overflow-hidden rounded-xl bg-[#1b1f24]">
          <motion.div initial={false} animate={{ opacity: shot ? 1 : 0, scale: shot ? 1 : 1.08 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex items-center justify-center">
            <Receipt />
          </motion.div>
          {!shot && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="h-10 w-10 rounded-full border-[3px] border-white/90" />
              <span className="text-[9px] text-white/70">Photograph the bill</span>
            </div>
          )}
          <Tap on={step === 4} className="left-1/2 top-1/2 -ml-3.5 -mt-3.5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Amount" value="₹1,240" active={shot} />
          <Field label="Paid to" value="Saravana Stores" active={shot} delay={300} />
          <Field label="Category" value="Art / props" active={shot} delay={600} />
          <Field label="Cash / UPI" value="Cash" active={shot} delay={800} />
        </div>
        <Card className="px-3 py-2">
          <Label>Scene · shoot day</Label>
          <div className="mt-1 flex gap-1.5">
            <span className="rounded-md px-2 py-[3px] text-[9.5px] font-medium" style={{ backgroundColor: TAG.prop.bg, color: TAG.prop.fg }}>Brass lamp · sc 42</span>
            <span className="rounded-md px-2 py-[3px] text-[9.5px] font-medium" style={{ backgroundColor: '#f4f5f7' }}>Day 15</span>
          </div>
        </Card>
        <p className="text-[8.5px]" style={{ color: MUTED }}>One page, one hand. Within Priya’s band — she approves, not the producer.</p>
      </div>
      <div className="relative px-4 pb-4">
        <Button label={sent ? 'Sent to Priya' : 'Send'} done={sent} icon={<Send className="h-3.5 w-3.5" />} />
        <Tap on={step === 5} className="left-1/2 top-1 -ml-3.5" />
      </div>
    </div>
  )
}

function Receipt() {
  return (
    <div className="w-[100px] rotate-[-4deg] bg-[#fdfcf7] px-2.5 py-2 text-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.6)]" style={{ fontFamily: '"Courier New", monospace' }}>
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

/* ---------- scene 2: LP approves within her band ---------- */

const QUEUE = [
  { who: 'Vijay · Art', what: 'Saravana Stores · sc 42 · Day 15', amt: '₹1,240', band: 'your band' },
  { who: 'Mani · Transport', what: 'Diesel, unit van · Day 15', amt: '₹3,000', band: 'your band' },
  { who: 'Kumar · Lights', what: 'Generator hire · Day 15', amt: '₹12,000', band: 'producer' },
]

function Approve({ step }: { step: number }) {
  const approved = step >= 8
  return (
    <div className="flex h-full flex-col">
      <Header title="Approvals" sub="Day 15 · 3 waiting" who="Priya · LP" />
      <div className="flex-1 space-y-2 px-4 py-3">
        {QUEUE.map((q, i) => {
          const first = i === 0
          const up = q.band === 'producer'
          return (
            <Card key={q.who} className="relative p-3" border={first && approved ? GREEN : LINE}>
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1b1f24]"><span className="h-6 w-4 bg-[#fdfcf7]" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold">{q.amt} <span className="font-normal" style={{ color: MUTED }}>· {q.who}</span></p>
                  <p className="truncate text-[9.5px]" style={{ color: MUTED }}>{q.what}</p>
                </div>
                <span className="shrink-0 rounded-full px-1.5 py-[2px] text-[8px] font-medium" style={{ backgroundColor: up ? '#fde8ec' : '#f4f5f7', color: up ? ACCENT : MUTED }}>
                  {up ? 'above your band → producer' : 'within your band'}
                </span>
              </div>
              {!up && (
                <div className="relative mt-2.5 grid grid-cols-2 gap-2 text-[10.5px]">
                  <Button label="Query" muted />
                  <Button label={first && approved ? 'Approved' : 'Approve'} done={first && approved} />
                  {first && <Tap on={step === 7} className="right-10 top-1" />}
                </div>
              )}
            </Card>
          )
        })}
      </div>
      <Card className="mx-4 mb-4 flex items-center gap-2 px-3 py-2.5">
        <Wallet className="h-4 w-4" style={{ color: ACCENT }} />
        <p className="text-[10.5px]">Vijay’s wallet</p>
        <motion.p key={approved ? 'a' : 'b'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="ml-auto text-[12px] font-semibold tabular-nums">
          {approved ? '₹7,160' : '₹8,400'}
        </motion.p>
      </Card>
    </div>
  )
}

/* ---------- scene 3: India-native money, Tally export ---------- */

const LEDGERS = [
  { cat: 'Art / props', ledger: 'Set Properties', amt: '₹2,41,900' },
  { cat: 'Transport & fuel', ledger: 'Conveyance', amt: '₹1,76,300' },
  { cat: 'Food & catering', ledger: 'Unit Catering', amt: '₹1,53,000' },
  { cat: 'Batta / daily wages', ledger: 'Daily Wages (FEFSI)', amt: '₹3,15,000' },
]

function Money({ step }: { step: number }) {
  const edited = step >= 9
  const exported = step >= 10
  return (
    <div className="flex h-full flex-col">
      <Header title="Export · Tally" sub="Days 1–15 · ₹18,42,300 approved" who="Accountant" />
      <div className="flex-1 space-y-2.5 px-4 py-3">
        <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
          {[['₹18.4 L', 'approved'], ['₹1,12,400', 'GST input'], ['6 vendors', 'TDS 194C']].map(([v, k]) => (
            <Card key={k} className="py-2">
              <p className="text-[12px] font-semibold tabular-nums">{v}</p>
              <p style={{ color: MUTED }}>{k}</p>
            </Card>
          ))}
        </div>

        <Card>
          <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1.5">
            <Label>Category → your Tally ledger</Label>
            <span className="text-[8.5px]" style={{ color: MUTED }}>editable</span>
          </div>
          {LEDGERS.map((l, i) => (
            <div key={l.cat} className="relative flex items-center gap-2 px-3.5 py-2 text-[10px]" style={{ borderTop: `1px solid ${LINE}` }}>
              <span className="w-[88px] shrink-0 truncate" style={{ color: MUTED }}>{l.cat}</span>
              <span className="flex min-w-0 flex-1 items-center gap-1 font-medium">
                {i === 0 ? <Stream text={l.ledger} active={edited} speed={1} caret /> : l.ledger}
                {i === 0 && <Pencil className="h-2.5 w-2.5 shrink-0" style={{ color: ACCENT }} />}
              </span>
              <span className="tabular-nums">{l.amt}</span>
              {i === 0 && <Tap on={step === 8} className="left-28 top-0" />}
            </div>
          ))}
        </Card>

        <Card className="flex items-center gap-2.5 px-3.5 py-2.5">
          <span className="rounded-md px-1.5 py-[2px] text-[8px] font-semibold" style={{ backgroundColor: TAG.prop.bg, color: TAG.prop.fg }}>sc 42</span>
          <p className="text-[9.5px]"><b>Scene 42 cost ₹18,400</b> <span style={{ color: MUTED }}>· 7 bills · tap any to see the photo</span></p>
        </Card>
      </div>
      <div className="relative px-4 pb-4">
        <Button label={exported ? 'Tally CSV · 412 rows · ready' : 'Export for Tally'} done={exported} icon={<Download className="h-3.5 w-3.5" />} />
        <Tap on={step === 9} className="left-1/2 top-1 -ml-3.5" />
      </div>
    </div>
  )
}

/* ---------- scene 4: AD's call sheet, who confirmed ---------- */

const CREW = [
  { name: 'Arjun (lead)', call: '6:30 am', at: 11 },
  { name: 'Meera (lead)', call: '7:00 am', at: 12 },
  { name: 'Ravi · DOP', call: '5:30 am', at: 11 },
  { name: 'Shanthi · Makeup', call: '5:00 am', at: 12 },
  { name: 'Kumar · Lights', call: '5:30 am', at: 13 },
  { name: 'Mani · Transport', call: '4:45 am', at: 99 },
]

function CallSheet({ step }: { step: number }) {
  const confirmed = CREW.filter((c) => step >= c.at).length
  return (
    <div className="flex h-full flex-col">
      <Header title="Call sheet · Day 15" sub="v3 · published 10:48 pm · sc 42, 43, 45" who="Deepak · 1st AD" />
      <div className="flex-1 px-4 py-3">
        <Card className="p-3">
          <div className="flex items-center justify-between text-[9.5px]">
            <span style={{ color: MUTED }}>General call <b style={{ color: INK }}>6:00 am</b> · Aliyar dam road</span>
            <span className="rounded-full px-1.5 py-[2px] text-[8px] font-medium" style={{ backgroundColor: '#fde8ec', color: ACCENT }}>v3 · location changed</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[9px]">
            {[['Sent', 6], ['Opened', Math.min(6, confirmed + 1)], ['Confirmed', confirmed]].map(([k, v]) => (
              <div key={k as string} className="rounded-lg py-1.5" style={{ backgroundColor: '#f4f5f7' }}>
                <p className="text-[14px] font-semibold tabular-nums">{v}</p>
                <p style={{ color: MUTED }}>{k}</p>
              </div>
            ))}
          </div>
        </Card>

        <ul className="mt-2.5 overflow-hidden rounded-xl bg-white" style={{ border: `1px solid ${LINE}` }}>
          {CREW.map((c, i) => {
            const ok = step >= c.at
            const opened = !ok && step >= c.at - 1
            return (
              <li key={c.name} className="flex items-center gap-2 px-3 py-[7px] text-[10px]" style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}>
                <span className="h-5 w-5 shrink-0 rounded-full" style={{ background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }} />
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
        <p className="mt-2 text-[8.5px]" style={{ color: MUTED }}>Links shared to WhatsApp, message pre-filled. Nobody logged in.</p>
      </div>
      <div className="px-4 pb-4">
        <Button label={`Call the rest (${6 - confirmed})`} muted={confirmed === 6} />
      </div>
    </div>
  )
}

/* ---------- scene 5: the actor's page for today ---------- */

function ActorPage({ step }: { step: number }) {
  const added = step >= 15
  return (
    <div className="flex h-full flex-col">
      <Header title="Your day · Day 15" sub="Opened from your link · no login" who="Meera" />
      <div className="flex-1 space-y-2.5 px-4 py-3">
        <Card className="p-3.5">
          <Label>Your call</Label>
          <p className="mt-1 text-[26px] font-semibold leading-none tabular-nums">7:00 am</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px]">
            <MapPin className="h-3.5 w-3.5" style={{ color: ACCENT }} />
            <span>Aliyar dam road, Pollachi</span>
            <span className="ml-auto rounded-md px-2 py-[3px] text-[9px] font-medium text-white" style={{ backgroundColor: INK }}>Directions</span>
          </div>
        </Card>
        <Card className="p-3.5">
          <Label>Your scenes</Label>
          <div className="mt-1.5 flex gap-1.5">
            {['42 · night ext', '43 · night ext', '45 · int car'].map((s) => (
              <span key={s} className="rounded-md px-2 py-1 text-[9.5px] font-medium" style={{ backgroundColor: '#f4f5f7' }}>{s}</span>
            ))}
          </div>
          <Label><span className="mt-3 block">Your lines · sc 42</span></Label>
          <p className="mt-1 text-[10.5px] leading-snug" style={{ fontFamily: '"Courier New", monospace' }}>Appa, I’m not coming back tonight.</p>
          <Label><span className="mt-3 block">Your look</span></Label>
          <div className="mt-1.5 flex gap-1.5">
            {['#7c2d12', '#9f1239', '#1e3a8a'].map((c) => <span key={c} className="h-9 w-7 rounded-md" style={{ backgroundColor: c }} />)}
            <span className="self-center text-[9px]" style={{ color: MUTED }}>wedding saree · continuity from sc 41</span>
          </div>
        </Card>
      </div>
      <div className="relative grid grid-cols-2 gap-2 px-4 pb-4">
        <Button label="Confirmed" done />
        <Button label={added ? 'In your calendar' : 'Add to calendar'} done={added} icon={<CalendarPlus className="h-3.5 w-3.5" />} />
        <Tap on={step === 14} className="right-12 top-1" />
      </div>
    </div>
  )
}

/* ---------- scene 6: availability by link ---------- */

const ARJUN = new Set([3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 24, 25])
const MEERA = new Set([1, 2, 8, 9, 11, 12, 13, 14, 15, 16, 17, 22, 23, 29, 30])
const PICK = [12, 13, 14, 15, 16]

function Availability({ step }: { step: number }) {
  const marked = step >= 17
  const overlap = step >= 18
  return (
    <div className="flex h-full flex-col">
      <Header
        title={overlap ? 'Cast dates · November' : 'Arjun · free dates'}
        sub={overlap ? 'Where the leads overlap' : 'Link from Deepak · no login · tap the days he is free'}
        who={overlap ? 'Deepak · 1st AD' : 'Arjun’s manager'}
      />
      <div className="flex-1 space-y-2.5 px-4 py-3">
        <Card className="p-3.5">
          <div className="grid grid-cols-7 gap-1 text-center text-[8px]" style={{ color: MUTED }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="relative mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
              const a = ARJUN.has(d) || (marked && PICK.includes(d))
              const m = MEERA.has(d)
              const both = overlap && a && m
              const showA = overlap ? a : (marked ? a : ARJUN.has(d) && !PICK.includes(d))
              return (
                <motion.span
                  key={d}
                  initial={false}
                  animate={{
                    backgroundColor: both ? GREEN : showA ? ACCENT : overlap && m ? '#fbbf24' : '#f4f5f7',
                    color: both || showA || (overlap && m) ? '#fff' : INK,
                  }}
                  transition={{ duration: 0.3, delay: marked && PICK.includes(d) && !overlap ? PICK.indexOf(d) * 0.08 : 0 }}
                  className="flex h-[26px] items-center justify-center rounded-md text-[10px] font-medium tabular-nums"
                >
                  {d}
                </motion.span>
              )
            })}
            <Tap on={step === 16} className="left-[52%] top-[38%]" />
          </div>
          <div className="mt-2.5 flex gap-3 text-[8.5px]" style={{ color: MUTED }}>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ACCENT }} /> Arjun</span>
            {overlap && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: '#fbbf24' }} /> Meera</span>}
            {overlap && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: GREEN }} /> both</span>}
          </div>
        </Card>

        <motion.div initial={false} animate={{ opacity: marked ? 1 : 0, y: marked ? 0 : 6 }}>
          <Card className="flex items-center gap-2.5 px-3.5 py-2.5" border={GREEN}>
            <CheckCheck className="h-4 w-4 shrink-0" style={{ color: GREEN }} />
            <p className="text-[9.5px] leading-snug">
              {overlap ? <><b>Both leads free 11–16 Nov.</b> <span style={{ color: MUTED }}>Six days for sc 42–51. No phone calls made.</span></> : <><b>Saved.</b> <span style={{ color: MUTED }}>Deepak sees this now. Change it any time from the same link.</span></>}
            </p>
          </Card>
        </motion.div>
      </div>
      <div className="px-4 pb-4">
        <Button label={overlap ? 'Attach sc 42–51 to these days' : marked ? 'Saved' : 'Save dates'} done={marked && !overlap} />
      </div>
    </div>
  )
}

/* ---------- scene 7: director's private song brief ---------- */

function Brief({ step }: { step: number }) {
  const opened = step >= 20
  return (
    <div className="flex h-full flex-col">
      <Header title="Brief · Song 2" sub="Private link · 1 recipient · sc 42 excerpt only" who="Director" />
      <div className="flex-1 space-y-2.5 px-4 py-3">
        <Card className="relative overflow-hidden p-3.5">
          <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-[22px] font-bold tracking-[0.3em] opacity-[0.05]" style={{ transform: 'rotate(-18deg)' }}>SANTHOSH</span>
          <Label>Situation</Label>
          <p className="mt-1 text-[11px] leading-snug">Night. Meera walks home after the fight with her father. She is not sad — she is relieved, and ashamed of being relieved.</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[9px]">
            {[['Mood', 'Quiet, warm'], ['Length', '4:10'], ['Placement', 'After sc 42']].map(([k, v]) => (
              <div key={k} className="rounded-lg py-1.5" style={{ backgroundColor: '#f4f5f7' }}>
                <p className="font-semibold">{v}</p>
                <p style={{ color: MUTED }}>{k}</p>
              </div>
            ))}
          </div>
          <Label><span className="mt-3 block">References</span></Label>
          <div className="mt-1 flex gap-1.5">
            {['Scratch hum · 0:48', 'Kannathil… · 1:12'].map((r) => (
              <span key={r} className="rounded-md px-2 py-1 text-[9px]" style={{ backgroundColor: '#f4f5f7' }}>▶ {r}</span>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1 text-[8.5px]" style={{ color: MUTED }}>
            <Lock className="h-2.5 w-2.5" /> View only · watermarked · expires in 7 days · script not attached
          </p>
        </Card>

        <Card className="p-3" border={opened ? GREEN : LINE}>
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 shrink-0 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24, #fb7185)' }} />
            <div className="min-w-0 flex-1 text-[10px]">
              <p className="font-semibold">Santhosh · Music director</p>
              <motion.p key={opened ? 'o' : 's'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: opened ? GREEN : MUTED }}>
                {opened ? 'Opened · 9:42 pm · logged' : 'Link sent · not yet opened'}
              </motion.p>
            </div>
            {opened ? <Eye className="h-4 w-4" style={{ color: GREEN }} /> : <Link2 className="h-4 w-4" style={{ color: MUTED }} />}
          </div>
        </Card>
      </div>
      <div className="px-4 pb-4">
        <Button label="Revoke link" muted />
      </div>
    </div>
  )
}

/* ---------- scene 8: the producer's inbox empties ---------- */

const INBOX = [
  { title: 'Approve ₹12,000 · generator hire', sub: 'Kumar · Lights · above Priya’s band', action: 'Approve' },
  { title: 'Day 15 call sheet · 1 not confirmed', sub: 'Mani · Transport · last opened v2', action: 'Call' },
  { title: 'Script v3 · 2 scenes changed', sub: 'Sc 42 and 77 · props list updated', action: 'Review' },
]

function Inbox({ step }: { step: number }) {
  const acted = step >= 22
  const left = acted ? 2 : 3
  return (
    <div className="flex h-full flex-col">
      <Header title="Inbox" sub={`${left} need you · everything else is just a feed`} who="Producer" />
      <div className="flex-1 space-y-2 px-4 py-3">
        <AnimatePresence initial={false}>
          {INBOX.filter((_, i) => !(acted && i === 0)).map((it, i) => (
            <motion.div
              key={it.title}
              layout
              initial={false}
              exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="relative flex items-center gap-2.5 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10.5px] font-semibold">{it.title}</p>
                  <p className="truncate text-[9px]" style={{ color: MUTED }}>{it.sub}</p>
                </div>
                <span className="shrink-0 rounded-lg px-2.5 py-1.5 text-[9.5px] font-medium text-white" style={{ backgroundColor: INK }}>{it.action}</span>
                {i === 0 && !acted && <Tap on={step === 21} className="right-6 top-2" />}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <Card className="mt-3 p-3.5">
          <Label>Today, across everything</Label>
          <ul className="mt-2 space-y-1.5 text-[9.5px]">
            {[
              ['4:12 pm', 'Priya approved ₹1,240 · Vijay · sc 42'],
              ['3:40 pm', 'Santhosh opened Song 2 brief'],
              ['11:05 am', 'Arjun’s manager marked 5 free dates'],
              ['10:48 pm', 'Deepak published call sheet v3 · 5 of 6 confirmed'],
            ].map(([t, s]) => (
              <li key={s} className="flex gap-2"><span className="w-[46px] shrink-0 tabular-nums" style={{ color: MUTED }}>{t}</span><span className="truncate">{s}</span></li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
