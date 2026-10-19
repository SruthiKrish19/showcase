import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCheck,
  Download,
  Eye,
  FileText,
  FileUp,
  Inbox as InboxIcon,
  Link2,
  Lock,
  MapPin,
  Pencil,
  Send,
  Users,
  Wallet,
  Clapperboard,
  MessageSquareText,
} from 'lucide-react'
import { BrowserFrame } from './DeviceFrame'
import { CameraStage } from './CameraStage'
import { MOBILE, useMediaQuery } from '../../lib/useMediaQuery'
import { Cursor } from './Cursor'
import { CaptionRail } from './CaptionRail'
import { Stream } from './Stream'

const INK = '#15181d'
const MUTED = '#6b7280'
const LINE = '#e5e7eb'
const PAPER = '#f4f5f7'
const ACCENT = '#d9485f'
const GREEN = '#15803d'
const EASE = [0.22, 1, 0.36, 1] as const

/* Tag colours — Finder-style labels on the script */
const TAG = {
  character: { bg: '#fde8ec', fg: '#b91c1c' },
  prop: { bg: '#fef3c7', fg: '#92400e' },
  location: { bg: '#dbeafe', fg: '#1d4ed8' },
  costume: { bg: '#ede9fe', fg: '#6d28d9' },
}

const CAPTIONS = [
  'Import the script and tag it once — characters, props, locations. Scenes attach to shoot days.',
  'A spender captures a bill on their phone, tagged to the scene. The line producer approves within her band.',
  'Money is India-native: lakh and crore, GST and TDS tags, Tally export with your own ledger names.',
  'Publish once; every person gets their own link. Sent, opened, confirmed — and a “call the rest” list.',
  'What the actor sees on that link: call time, directions, own scenes, own lines. Calendar in one tap.',
  'Availability by link: a manager marks free dates with no login; the AD sees where the cast overlaps.',
  'A scoped brief behind a private link — expiring, revocable, watermarked. Never the whole script.',
  'Every role gets an inbox of what needs their action. It empties as they act.',
]

type Nav = 'script' | 'cash' | 'calls' | 'people' | 'briefs' | 'inbox'

/** Step ranges per chapter, its name, the sidebar item, the caption, whose view. */
const SCENES: { to: number; name: string; nav: Nav; caption: number; who: string }[] = [
  { to: 3, name: 'Tag the script', nav: 'script', caption: 0, who: 'Director' },
  { to: 8, name: 'Cash on set', nav: 'cash', caption: 1, who: 'Priya · Line producer' },
  { to: 10, name: 'Export to Tally', nav: 'cash', caption: 2, who: 'Accountant' },
  { to: 13, name: 'Call sheet links', nav: 'calls', caption: 3, who: 'Deepak · 1st AD' },
  { to: 15, name: 'The actor’s link', nav: 'calls', caption: 4, who: 'Deepak · 1st AD' },
  { to: 18, name: 'Cast dates', nav: 'people', caption: 5, who: 'Deepak · 1st AD' },
  { to: 20, name: 'Private brief', nav: 'briefs', caption: 6, who: 'Director' },
  { to: 22, name: 'Inbox', nav: 'inbox', caption: 7, who: 'Producer' },
]
const sceneStart = (i: number) => (i === 0 ? 0 : SCENES[i - 1].to + 1)

/**
 * The viewer drives the walkthrough a chapter at a time. Within a chapter the
 * steps still play on their own — that is where the cursor shows what moves —
 * then it holds on the last step and waits for Next.
 */
function useChapters(interval: number) {
  const [scene, setScene] = useState(0)
  const [step, setStep] = useState(0)
  const done = step >= SCENES[scene].to

  useEffect(() => {
    if (done) return
    const id = setTimeout(() => setStep((s) => s + 1), interval)
    return () => clearTimeout(id)
  }, [step, done, interval])

  const go = useCallback((i: number) => {
    const next = (i + SCENES.length) % SCENES.length
    setScene(next)
    setStep(sceneStart(next))
  }, [])

  // Arrow keys move between chapters, unless a button or link has focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input')) return
      if (e.key === 'ArrowRight') go(scene + 1)
      if (e.key === 'ArrowLeft' && scene > 0) go(scene - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, scene])

  return { scene, step, done, go }
}

/* Where the pointer goes on each step. `at` is ms after the step starts, so
   one step can walk to the sidebar first and then to the control. */
const NAV_Y: Record<Nav, number> = { script: 86, cash: 118, calls: 150, people: 182, briefs: 214, inbox: 246 }
const nav = (n: Nav) => ({ x: 58, y: NAV_Y[n], click: true })
type Frame = { x: number; y: number; click?: boolean; at?: number }
const CURSOR: Frame[][] = [
  /* 0 */ [nav('script'), { x: 696, y: 68, click: true, at: 800 }],
  /* 1 */ [{ x: 330, y: 220 }],
  /* 2 */ [{ x: 612, y: 176, click: true, at: 80 }],
  /* 3 */ [{ x: 650, y: 318, click: true, at: 80 }],
  /* 4 */ [nav('cash'), { x: 648, y: 190, click: true, at: 900 }],
  /* 5 */ [{ x: 648, y: 300 }],
  /* 6 */ [{ x: 648, y: 418, click: true, at: 80 }],
  /* 7 */ [{ x: 462, y: 160 }],
  /* 8 */ [{ x: 462, y: 160, click: true, at: 80 }],
  /* 9 */ [{ x: 318, y: 68, click: true }, { x: 452, y: 236, click: true, at: 900 }],
  /* 10 */ [{ x: 690, y: 68, click: true, at: 80 }],
  /* 11 */ [nav('calls'), { x: 392, y: 404, click: true, at: 900 }],
  /* 12 */ [{ x: 600, y: 230 }],
  /* 13 */ [{ x: 610, y: 416 }],
  /* 14 */ [{ x: 668, y: 68, click: true, at: 80 }],
  /* 15 */ [{ x: 648, y: 418, click: true, at: 80 }],
  /* 16 */ [nav('people'), { x: 320, y: 152, click: true, at: 900 }],
  /* 17 */ [{ x: 560, y: 260 }],
  /* 18 */ [{ x: 668, y: 68, click: true, at: 80 }],
  /* 19 */ [nav('briefs'), { x: 638, y: 404, click: true, at: 900 }],
  /* 20 */ [{ x: 610, y: 300 }],
  /* 21 */ [nav('inbox'), { x: 448, y: 112, click: true, at: 900 }],
  /* 22 */ [{ x: 360, y: 240 }],
]

function useCursor(step: number) {
  const [pos, setPos] = useState<Frame>({ x: 380, y: 260 })
  useEffect(() => {
    const timers = (CURSOR[step] ?? []).map((f) =>
      setTimeout(() => setPos({ x: f.x, y: f.y, click: !!f.click }), f.at ?? 0),
    )
    return () => timers.forEach(clearTimeout)
  }, [step])
  return pos
}

/**
 * Ciniops on a desktop, one production, many hands. The pointer walks the
 * sidebar and clicks the controls so the viewer always knows what moved.
 * The phone appears as an inset only where the person on the other end of
 * a link is the point. Names and amounts are illustrative fixture data.
 */
export function CiniopsDemo() {
  const chapters = useChapters(1800)
  const { step } = chapters
  const sceneIdx = chapters.scene
  const scene = SCENES[sceneIdx]
  const cursor = useCursor(step)
  // On a phone the whole desktop app is too small to read, so the camera
  // punches in and follows the cursor to whatever is being clicked.
  const zoomed = useMediaQuery(MOBILE)

  return (
    <div>
    <BrowserFrame url="app.ciniops.in/meera" tabTitle="Meera — Ciniops">
      <CameraStage
        width={760}
        height={500}
        focus={cursor}
        zoomed={zoomed}
        view={{ w: 340, h: 420 }}
        overlay={<CaptionRail steps={CAPTIONS} current={scene.caption} tint={ACCENT} />}
      >
        <div className="relative flex h-full w-full overflow-hidden" style={{ backgroundColor: PAPER, color: INK }}>
          <Sidebar active={scene.nav} />

          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar who={scene.who} />
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={sceneIdx}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 bottom-9 p-4"
                >
                  {sceneIdx === 0 && <Script step={step} />}
                  {sceneIdx === 1 && <Cash step={step} />}
                  {sceneIdx === 2 && <Money step={step} />}
                  {(sceneIdx === 3 || sceneIdx === 4) && <CallSheet step={step} />}
                  {sceneIdx === 5 && <Availability step={step} />}
                  {sceneIdx === 6 && <Brief step={step} />}
                  {sceneIdx === 7 && <InboxScene step={step} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <Cursor x={cursor.x} y={cursor.y} clicking={cursor.click} always />
        </div>
      </CameraStage>
    </BrowserFrame>
    <ChapterNav {...chapters} />
    </div>
  )
}

/* ---------- chapter controls, under the frame ---------- */

function ChapterNav({ scene, done, go }: { scene: number; done: boolean; go: (i: number) => void }) {
  const reduced = useReducedMotion()
  const last = scene === SCENES.length - 1
  const ready = done && !reduced // nudge Next once the chapter has played

  return (
    <div className="mt-4 flex items-center gap-3 sm:gap-4">
      <button
        onClick={() => go(scene - 1)}
        disabled={scene === 0}
        aria-label="Previous chapter"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-ink transition-colors hover:border-white/35 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-30"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-sm font-medium text-ink">
          <span className="mr-2 font-display text-xs tabular-nums text-faint">
            {pad2(scene + 1)} / {pad2(SCENES.length)}
          </span>
          {SCENES[scene].name}
        </p>
        <div className="mt-2 flex justify-center gap-1.5">
          {SCENES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => go(i)}
              aria-label={`Go to ${s.name}`}
              aria-current={i === scene}
              className="group py-1.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === scene ? 'w-6 bg-ink' : i < scene ? 'w-1.5 bg-white/50' : 'w-1.5 bg-white/20 group-hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <motion.button
        onClick={() => go(scene + 1)}
        aria-label={last ? 'Start over' : 'Next chapter'}
        animate={ready ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={ready ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
        className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-bg transition-shadow hover:bg-white sm:px-5 ${
          ready ? 'shadow-[0_0_0_4px_rgba(251,113,133,0.25)]' : ''
        }`}
      >
        <span className="hidden sm:inline">{last ? 'Start over' : 'Next'}</span>
        {last ? <RotateCcw className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </motion.button>
    </div>
  )
}

const pad2 = (n: number) => String(n).padStart(2, "0")

/* ---------- chrome ---------- */

const NAV: { key: Nav; label: string; icon: React.ReactNode }[] = [
  { key: 'script', label: 'Script', icon: <FileText className="h-3.5 w-3.5" /> },
  { key: 'cash', label: 'Cash', icon: <Wallet className="h-3.5 w-3.5" /> },
  { key: 'calls', label: 'Call sheets', icon: <Clapperboard className="h-3.5 w-3.5" /> },
  { key: 'people', label: 'People', icon: <Users className="h-3.5 w-3.5" /> },
  { key: 'briefs', label: 'Briefs', icon: <MessageSquareText className="h-3.5 w-3.5" /> },
  { key: 'inbox', label: 'Inbox', icon: <InboxIcon className="h-3.5 w-3.5" /> },
]

function Sidebar({ active }: { active: Nav }) {
  return (
    <aside className="flex w-[150px] shrink-0 flex-col bg-white" style={{ borderRight: `1px solid ${LINE}` }}>
      <div className="flex items-center gap-2 px-4 pt-4 pb-5">
        <span className="h-5 w-5 rounded-md" style={{ background: `linear-gradient(135deg, ${ACCENT}, #fb923c)` }} />
        <div className="leading-none">
          <p className="text-[12px] font-semibold">Ciniops</p>
          <p className="mt-[3px] text-[9px]" style={{ color: MUTED }}>Meera · 2026</p>
        </div>
      </div>
      <nav className="space-y-0.5 px-2">
        {NAV.map((n) => {
          const on = n.key === active
          return (
            <div key={n.key} className="relative flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[11.5px]" style={{ color: on ? INK : MUTED, fontWeight: on ? 600 : 400 }}>
              {on && (
                <motion.span layoutId="nav-pill" transition={{ duration: 0.4, ease: EASE }} className="absolute inset-0 rounded-lg" style={{ backgroundColor: PAPER }} />
              )}
              <span className="relative" style={{ color: on ? ACCENT : MUTED }}>{n.icon}</span>
              <span className="relative">{n.label}</span>
              {n.key === 'inbox' && <span className="relative ml-auto rounded-full px-1.5 text-[9px] font-semibold text-white" style={{ backgroundColor: ACCENT }}>3</span>}
            </div>
          )
        })}
      </nav>
      <div className="mt-auto px-4 pb-4 text-[9px] leading-snug" style={{ color: MUTED }}>
        <p>Day 15 of 42 · Pollachi unit</p>
        <p className="mt-0.5">Data in ap-south-1</p>
      </div>
    </aside>
  )
}

function TopBar({ who }: { who: string }) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-3 bg-white px-4" style={{ borderBottom: `1px solid ${LINE}` }}>
      <span className="text-[11px]" style={{ color: MUTED }}>Meera</span>
      <span className="text-[11px]" style={{ color: LINE }}>/</span>
      <span className="text-[11px] font-medium">Day 15 · Thu 6 Nov</span>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-[9.5px]" style={{ color: MUTED }}>Viewing as</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={who}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="rounded-full px-2.5 py-1 text-[10px] font-medium"
            style={{ backgroundColor: '#fde8ec', color: ACCENT }}
          >
            {who}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- shared bits ---------- */

function Card({ children, className = '', border = LINE, style }: { children: React.ReactNode; className?: string; border?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl bg-white ${className}`} style={{ border: `1px solid ${border}`, ...style }}>
      {children}
    </div>
  )
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[8.5px] uppercase tracking-wide ${className}`} style={{ color: MUTED }}>{children}</p>
}

function Button({ label, done, icon, muted, small }: { label: string; done?: boolean; icon?: React.ReactNode; muted?: boolean; small?: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: done ? GREEN : muted ? '#e5e7eb' : INK }}
      transition={{ duration: 0.35 }}
      className={`flex items-center justify-center gap-1.5 rounded-lg font-medium ${small ? 'h-7 px-3 text-[10px]' : 'h-9 px-4 text-[11.5px]'}`}
      style={{ color: muted && !done ? MUTED : '#fff' }}
    >
      {done ? <Check className={small ? 'h-3 w-3' : 'h-3.5 w-3.5'} /> : icon}
      {label}
    </motion.div>
  )
}

function Field({ label, value, active, delay = 0 }: { label: string; value: string; active: boolean; delay?: number }) {
  return (
    <div className="rounded-lg px-2.5 py-1.5" style={{ backgroundColor: PAPER }}>
      <Label>{label}</Label>
      <p className="mt-[1px] h-[13px] text-[11px] font-medium">
        <Stream text={value} active={active} delay={delay} speed={2} caret />
      </p>
    </div>
  )
}

function Rise({ on, children, className = '' }: { on: boolean; children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }} transition={{ duration: 0.45, ease: EASE }} className={className}>
      {children}
    </motion.div>
  )
}

/** A phone inset: what the person on the other end of a link is looking at. */
function Phone({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex h-full flex-col items-center">
      <p className="mb-2 text-[9px]" style={{ color: MUTED }}>{title}</p>
      <div className="relative w-[200px] flex-1 overflow-hidden rounded-[22px] border-[5px] border-[#1c1c24] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
        <span className="absolute left-1/2 top-1.5 z-10 h-[12px] w-[52px] -translate-x-1/2 rounded-full bg-black" />
        <div className="h-full pt-6">{children}</div>
      </div>
    </div>
  )
}

/* ---------- scene 0: the script, tagged once ---------- */

function Tagged({ kind, on, children }: { kind: keyof typeof TAG; on: boolean; children: string }) {
  const t = TAG[kind]
  return (
    <motion.span
      initial={false}
      animate={{ backgroundColor: on ? t.bg : 'rgba(255,255,255,0)', color: on ? t.fg : INK }}
      transition={{ duration: 0.5 }}
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
    <div className="flex h-full gap-4">
      {/* Script page */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-[13px] font-semibold">Script</p>
          <span className="text-[10px]" style={{ color: MUTED }}>{imported ? 'Meera_v3.pdf · 118 scenes · 311 tagged items' : 'No script yet'}</span>
          <div className="ml-auto">
            <Button small done={imported} icon={<FileUp className="h-3 w-3" />} label={imported ? 'Imported v3' : 'Import script'} />
          </div>
        </div>
        <motion.div initial={false} animate={{ opacity: imported ? 1 : 0.3, filter: imported ? 'blur(0px)' : 'blur(2px)' }} transition={{ duration: 0.5 }} className="min-h-0 flex-1">
          <Card className="h-full overflow-hidden px-6 py-5" border={attached ? GREEN : LINE}>
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-semibold tracking-wide" style={{ color: MUTED }}>42 · EXT. STREET OUTSIDE MEERA’S HOUSE — NIGHT</p>
              <motion.span initial={false} animate={{ opacity: attached ? 1 : 0, scale: attached ? 1 : 0.9 }} className="rounded-full px-2 py-[2px] text-[8.5px] font-medium text-white" style={{ backgroundColor: GREEN }}>
                Day 15
              </motion.span>
            </div>
            <div className="mt-3 text-[11px] leading-[1.7]" style={{ fontFamily: '"Courier New", monospace' }}>
              <p>
                <Tagged kind="character" on={tagged}>MEERA</Tagged> walks away from the <Tagged kind="location" on={tagged}>house</Tagged>, still in the <Tagged kind="costume" on={tagged}>wedding saree</Tagged>. A <Tagged kind="prop" on={tagged}>brass lamp</Tagged> burns in the window behind her. Her <Tagged kind="character" on={tagged}>FATHER</Tagged> does not come to the door.
              </p>
              <p className="mt-3 pl-24">MEERA</p>
              <p className="pl-12">Appa, I’m not coming back tonight.</p>
              <p className="mt-3">She does not look back. The street is empty except for a <Tagged kind="prop" on={tagged}>stray dog</Tagged> and the <Tagged kind="prop" on={tagged}>autorickshaw</Tagged> waiting at the corner.</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tag panel */}
      <div className="flex w-[232px] shrink-0 flex-col gap-3">
        <Rise on={tagged}>
          <Card className="p-3.5">
            <div className="flex items-center justify-between">
              <Label>Tags in scene 42</Label>
              <span className="text-[8.5px]" style={{ color: MUTED }}>click to filter</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {([
                ['Meera', 'character', 61],
                ['Father', 'character', 14],
                ['Brass lamp', 'prop', 3],
                ['Wedding saree', 'costume', 5],
                ['Meera’s house', 'location', 9],
                ['Autorickshaw', 'prop', 2],
              ] as const).map(([name, kind, n]) => (
                <span key={name} className="rounded-md px-2 py-1 text-[9.5px] font-medium" style={{ backgroundColor: TAG[kind].bg, color: TAG[kind].fg, outline: name === 'Brass lamp' && step >= 2 ? `1.5px solid ${TAG[kind].fg}` : 'none' }}>
                  {name} <span className="opacity-60">· {n}</span>
                </span>
              ))}
            </div>
          </Card>
        </Rise>
        <Rise on={tagged}>
          <Card className="p-3.5">
            <Label>Brass lamp · prop · Art dept</Label>
            <ul className="mt-2 space-y-1 text-[10px]">
              {[['12', 'INT. POOJA ROOM — DAY', 'Day 9 · shot'], ['42', 'EXT. STREET — NIGHT', attached ? 'Day 15' : 'unscheduled'], ['77', 'INT. HOSPITAL — NIGHT', 'unscheduled']].map(([n, h, d]) => (
                <li key={n} className="flex items-center gap-2">
                  <span className="w-5 font-semibold tabular-nums">{n}</span>
                  <span className="flex-1 truncate" style={{ color: MUTED }}>{h}</span>
                  <span className="text-[8.5px]" style={{ color: d.startsWith('Day') ? GREEN : MUTED }}>{d}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Button small done={attached} label={attached ? 'Scene 42 on Day 15' : 'Attach scene 42 to Day 15'} />
            </div>
          </Card>
        </Rise>
        <Rise on={attached}>
          <Card className="flex items-start gap-2 px-3.5 py-2.5" border={GREEN}>
            <CheckCheck className="mt-[1px] h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
            <p className="text-[9.5px] leading-snug"><b>Flowed from the script:</b> <span style={{ color: MUTED }}>shot list, call sheet draft and the Art props list for Day 15.</span></p>
          </Card>
        </Rise>
      </div>
    </div>
  )
}

/* ---------- scene 1: cash — spender's phone, LP's queue ---------- */

const QUEUE = [
  { who: 'Mani · Transport', what: 'Diesel, unit van · Day 15', amt: '₹3,000', band: 'within your band' },
  { who: 'Kumar · Lights', what: 'Generator hire · Day 15', amt: '₹12,000', band: 'above your band → producer' },
]

function Cash({ step }: { step: number }) {
  const shot = step >= 5
  const sent = step >= 6
  const landed = step >= 7
  const approved = step >= 8
  const items = landed ? [{ who: 'Vijay · Art', what: 'Saravana Stores · brass lamp · sc 42 · Day 15', amt: '₹1,240', band: 'within your band' }, ...QUEUE] : QUEUE
  return (
    <div className="flex h-full gap-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-4 text-[11px]">
          <span className="font-semibold">Approvals</span>
          <span style={{ color: MUTED }}>Wallets</span>
          <span style={{ color: MUTED }}>Export</span>
          <span className="ml-auto text-[10px]" style={{ color: MUTED }}>{items.length} waiting</span>
        </div>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((q, i) => {
              const first = i === 0 && landed
              const up = q.band.startsWith('above')
              return (
                <motion.div key={q.who} layout initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}>
                  <Card className="flex items-center gap-3 p-3" border={first && approved ? GREEN : LINE}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1b1f24]"><span className="h-6 w-4 bg-[#fdfcf7]" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-semibold">{q.amt} <span className="font-normal" style={{ color: MUTED }}>· {q.who}</span></p>
                      <p className="truncate text-[9.5px]" style={{ color: MUTED }}>{q.what}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2 py-[3px] text-[8.5px] font-medium" style={{ backgroundColor: up ? '#fde8ec' : PAPER, color: up ? ACCENT : MUTED }}>{q.band}</span>
                    {!up && (
                      <div className="flex shrink-0 gap-1.5">
                        <Button small muted label="Query" />
                        <Button small label={first && approved ? 'Approved' : 'Approve'} done={first && approved} />
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        <Card className="mt-auto flex items-center gap-3 px-3.5 py-2.5">
          <Wallet className="h-4 w-4" style={{ color: ACCENT }} />
          <p className="text-[10.5px]">Vijay’s wallet <span style={{ color: MUTED }}>· issued ₹10,000 cash this morning</span></p>
          <motion.p key={approved ? 'a' : 'b'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="ml-auto text-[12px] font-semibold tabular-nums">
            {approved ? '₹7,160' : '₹8,400'} <span className="text-[9px] font-normal" style={{ color: MUTED }}>left</span>
          </motion.p>
        </Card>
      </div>

      <div className="w-[216px] shrink-0">
        <Phone title="Vijay’s phone · opened from his link">
          <div className="flex h-full flex-col px-3 pb-3">
            <p className="text-[11px] font-semibold">New expense</p>
            <p className="text-[8.5px]" style={{ color: MUTED }}>Art wallet · ₹8,400 left</p>
            <div className="relative mt-2 h-[88px] overflow-hidden rounded-lg bg-[#1b1f24]">
              <motion.div initial={false} animate={{ opacity: shot ? 1 : 0, scale: shot ? 1 : 1.1 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center">
                <div className="w-[64px] rotate-[-5deg] bg-[#fdfcf7] px-1.5 py-1 shadow-lg" style={{ fontFamily: '"Courier New", monospace' }}>
                  <p className="text-center text-[5px] font-bold">SARAVANA STORES</p>
                  <div className="my-0.5 border-t border-dashed border-[#bbb]" />
                  <p className="flex justify-between text-[4.5px]"><span>Brass lamp x2</span><span>640</span></p>
                  <p className="flex justify-between text-[4.5px]"><span>Jute rope</span><span>310</span></p>
                  <p className="flex justify-between text-[5px] font-bold"><span>TOTAL</span><span>1240</span></p>
                </div>
              </motion.div>
              {!shot && <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white/90" />}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <Field label="Amount" value="₹1,240" active={shot} />
              <Field label="Paid to" value="Saravana" active={shot} delay={250} />
              <Field label="Category" value="Art / props" active={shot} delay={500} />
              <Field label="Cash / UPI" value="Cash" active={shot} delay={700} />
            </div>
            <div className="mt-1.5 rounded-lg px-2.5 py-1.5" style={{ backgroundColor: PAPER }}>
              <Label>Scene · day</Label>
              <p className="mt-[1px] text-[9.5px] font-medium"><span className="rounded px-1" style={{ backgroundColor: TAG.prop.bg, color: TAG.prop.fg }}>Brass lamp · sc 42</span> · Day 15</p>
            </div>
            <div className="mt-auto">
              <Button label={sent ? 'Sent to Priya' : 'Send'} done={sent} icon={<Send className="h-3 w-3" />} />
            </div>
          </div>
        </Phone>
      </div>
    </div>
  )
}

/* ---------- scene 2: India-native money, Tally export ---------- */

const LEDGERS = [
  { cat: 'Art / props', ledger: 'Set Properties', gst: '₹18,400', tds: '—', amt: '₹2,41,900' },
  { cat: 'Transport & fuel', ledger: 'Conveyance', gst: '₹9,100', tds: '194C · 2', amt: '₹1,76,300' },
  { cat: 'Food & catering', ledger: 'Unit Catering', gst: '₹7,650', tds: '194C · 1', amt: '₹1,53,000' },
  { cat: 'Equipment hire', ledger: 'Equipment Hire', gst: '₹41,200', tds: '194C · 3', amt: '₹2,28,900' },
  { cat: 'Batta / daily wages', ledger: 'Daily Wages (FEFSI)', gst: '—', tds: '—', amt: '₹3,15,000' },
]

function Money({ step }: { step: number }) {
  const edited = step >= 9
  const exported = step >= 10
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-4 text-[11px]">
        <span style={{ color: MUTED }}>Approvals</span>
        <span style={{ color: MUTED }}>Wallets</span>
        <span className="font-semibold">Export</span>
        <span className="ml-3 text-[10px]" style={{ color: MUTED }}>Days 1–15 · ₹18,42,300 approved</span>
        <div className="ml-auto">
          <Button small done={exported} icon={<Download className="h-3 w-3" />} label={exported ? 'Tally CSV · 412 rows · ready' : 'Export for Tally'} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[['₹18.4 L', 'approved, days 1–15'], ['₹1,12,400', 'GST input, 38 bills'], ['6 vendors', 'TDS 194C to deduct'], ['₹42,000', 'cash with crew · 6 wallets']].map(([v, k]) => (
          <Card key={k} className="px-3.5 py-2.5">
            <p className="text-[15px] font-semibold tabular-nums">{v}</p>
            <p className="text-[9px]" style={{ color: MUTED }}>{k}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-3 overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1.6fr_0.8fr_0.8fr_0.9fr] px-4 py-2 text-[8.5px] uppercase tracking-wide" style={{ color: MUTED, backgroundColor: PAPER }}>
          <span>Category</span><span>Your Tally ledger · editable</span><span>GST input</span><span>TDS</span><span className="text-right">Amount</span>
        </div>
        {LEDGERS.map((l, i) => (
          <div key={l.cat} className="grid grid-cols-[1.2fr_1.6fr_0.8fr_0.8fr_0.9fr] items-center px-4 py-2 text-[10.5px]" style={{ borderTop: `1px solid ${LINE}` }}>
            <span style={{ color: MUTED }}>{l.cat}</span>
            <span className="flex items-center gap-1.5 font-medium">
              {i === 0 ? <Stream text={l.ledger} active={edited} delay={950} speed={1} caret /> : l.ledger}
              {i === 0 && <Pencil className="h-2.5 w-2.5" style={{ color: ACCENT }} />}
            </span>
            <span className="tabular-nums">{l.gst}</span>
            <span className="tabular-nums" style={{ color: l.tds === '—' ? MUTED : INK }}>{l.tds}</span>
            <span className="text-right tabular-nums">{l.amt}</span>
          </div>
        ))}
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Card className="flex items-center gap-2.5 px-3.5 py-2.5">
          <span className="rounded px-1.5 py-[2px] text-[8.5px] font-semibold" style={{ backgroundColor: TAG.prop.bg, color: TAG.prop.fg }}>sc 42</span>
          <p className="text-[9.5px]"><b>Scene 42 cost ₹18,400</b> <span style={{ color: MUTED }}>· 7 bills · click any to see the photo</span></p>
        </Card>
        <Card className="flex items-center gap-2.5 px-3.5 py-2.5">
          <Lock className="h-3.5 w-3.5" style={{ color: MUTED }} />
          <p className="text-[9.5px]"><b>Days 1–14 locked</b> <span style={{ color: MUTED }}>· filed to Tally on Sat · nobody edits last week</span></p>
        </Card>
      </div>
    </div>
  )
}

/* ---------- scenes 3 + 4: the call sheet, then what the actor sees ---------- */

const CREW = [
  { name: 'Arjun (lead)', call: '6:30 am', at: 12 },
  { name: 'Meera (lead)', call: '7:00 am', at: 13 },
  { name: 'Ravi · DOP', call: '5:30 am', at: 12 },
  { name: 'Shanthi · Makeup', call: '5:00 am', at: 13 },
  { name: 'Kumar · Lights', call: '5:30 am', at: 13 },
  { name: 'Mani · Transport', call: '4:45 am', at: 99 },
]

function CallSheet({ step }: { step: number }) {
  const published = step >= 12
  const preview = step >= 14
  const added = step >= 15
  const confirmed = CREW.filter((c) => step >= c.at).length
  return (
    <div className="flex h-full gap-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-[13px] font-semibold">Call sheet · Day 15</p>
          <span className="rounded-full px-2 py-[2px] text-[8.5px] font-medium" style={{ backgroundColor: '#fde8ec', color: ACCENT }}>v3 · location changed</span>
          <span className="ml-auto text-[10px]" style={{ color: MUTED }}>{published ? 'Published 10:48 pm' : 'Draft from the shoot day'}</span>
        </div>
        <Card className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-3 text-[10.5px]">
            <div><Label>General call</Label><p className="mt-0.5 text-[16px] font-semibold tabular-nums">6:00 am</p></div>
            <div><Label>Location</Label><p className="mt-0.5 font-medium">Aliyar dam road, Pollachi</p><p className="text-[9px]" style={{ color: MUTED }}>pin + directions on every link</p></div>
            <div><Label>Scenes</Label><p className="mt-0.5 font-medium">42, 43, 45</p><p className="text-[9px]" style={{ color: MUTED }}>from the shot list</p></div>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg" style={{ border: `1px solid ${LINE}` }}>
            <div className="grid grid-cols-[1.4fr_0.7fr_0.9fr] px-3 py-1.5 text-[8.5px] uppercase tracking-wide" style={{ color: MUTED, backgroundColor: PAPER }}>
              <span>Person</span><span>Call</span><span className="text-right">Status</span>
            </div>
            {CREW.map((c) => {
              const ok = published && step >= c.at
              const opened = published && !ok && step >= c.at - 1
              return (
                <div key={c.name} className="grid grid-cols-[1.4fr_0.7fr_0.9fr] items-center px-3 py-[6px] text-[10px]" style={{ borderTop: `1px solid ${LINE}` }}>
                  <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full" style={{ background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }} />{c.name}</span>
                  <span className="tabular-nums" style={{ color: MUTED }}>{c.call}</span>
                  <motion.span key={ok ? 'ok' : opened ? 'op' : published ? 'sent' : 'draft'} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-end gap-1 text-[8.5px] font-medium" style={{ color: ok ? GREEN : opened ? INK : MUTED }}>
                    {ok ? <><CheckCheck className="h-3 w-3" /> Confirmed</> : opened ? <><Eye className="h-3 w-3" /> Opened</> : published ? <><Check className="h-3 w-3" /> Sent</> : <>—</>}
                  </motion.span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button label={published ? `Published v3 · ${confirmed} of 6 confirmed` : 'Publish v3 & send personal links'} done={published} icon={<Send className="h-3.5 w-3.5" />} />
            <Rise on={published}><Button muted label={`Call the rest (${6 - confirmed})`} /></Rise>
            <span className="ml-auto text-[9px]" style={{ color: MUTED }}>Share to WhatsApp, message pre-filled</span>
          </div>
        </Card>
      </div>

      <div className="flex w-[216px] shrink-0 flex-col">
        <div className="mb-2 flex justify-end">
          <Button small label={preview ? 'Previewing as Meera' : 'Preview as Meera'} done={preview} icon={<Eye className="h-3 w-3" />} />
        </div>
        <div className="min-h-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            {preview ? (
              <motion.div key="phone" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="h-full">
                <Phone title="Meera’s link · no login">
                  <div className="flex h-full flex-col px-3 pb-3">
                    <Label>Your call · Day 15</Label>
                    <p className="text-[20px] font-semibold leading-none tabular-nums">7:00 am</p>
                    <p className="mt-1.5 flex items-center gap-1 text-[9px]"><MapPin className="h-3 w-3" style={{ color: ACCENT }} /> Aliyar dam road <span className="ml-auto rounded px-1.5 py-[2px] text-[8px] font-medium text-white" style={{ backgroundColor: INK }}>Directions</span></p>
                    <Label className="mt-2.5">Your scenes</Label>
                    <div className="mt-1 flex gap-1">{['42', '43', '45'].map((s) => <span key={s} className="rounded px-1.5 py-[2px] text-[9px] font-medium" style={{ backgroundColor: PAPER }}>{s}</span>)}</div>
                    <Label className="mt-2.5">Your lines · sc 42</Label>
                    <p className="mt-0.5 text-[9.5px] leading-snug" style={{ fontFamily: '"Courier New", monospace' }}>Appa, I’m not coming back tonight.</p>
                    <Label className="mt-2.5">Your look</Label>
                    <div className="mt-1 flex items-center gap-1">{['#7c2d12', '#9f1239'].map((c) => <span key={c} className="h-7 w-5 rounded" style={{ backgroundColor: c }} />)}<span className="ml-1 text-[8px]" style={{ color: MUTED }}>saree · from sc 41</span></div>
                    <div className="mt-auto grid grid-cols-2 gap-1.5">
                      <Button small done label="Confirmed" />
                      <Button small done={added} icon={<CalendarPlus className="h-3 w-3" />} label={added ? 'In calendar' : 'Calendar'} />
                    </div>
                  </div>
                </Phone>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col gap-2">
                <Card className="p-3.5">
                  <Label>Every link</Label>
                  <ul className="mt-1.5 space-y-1 text-[9.5px]">
                    {['Always shows the latest version', 'Own call time, not a 20-row PDF', 'One tap to confirm', 'Add to calendar · directions'].map((t) => <li key={t} className="flex gap-1.5"><Check className="mt-[2px] h-2.5 w-2.5 shrink-0" style={{ color: GREEN }} />{t}</li>)}
                  </ul>
                </Card>
                <Card className="p-3.5">
                  <Label>Versions</Label>
                  <ul className="mt-1.5 space-y-1 text-[9.5px]" style={{ color: MUTED }}>
                    <li>v1 · 7:10 pm · first draft</li><li>v2 · 9:30 pm · Ravi’s call moved</li><li style={{ color: INK }}>v3 · location changed</li>
                  </ul>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ---------- scene 5: availability by link ---------- */

const ARJUN = new Set([3, 4, 5, 10, 11, 24, 25])
const PICK = [12, 13, 14, 15, 16]
const MEERA = new Set([1, 2, 8, 9, 11, 12, 13, 14, 15, 16, 17, 22, 23, 29, 30])

function Availability({ step }: { step: number }) {
  const sentLink = step >= 17
  const marked = step >= 17
  const overlay = step >= 18
  return (
    <div className="flex h-full gap-4">
      <div className="flex w-[224px] shrink-0 flex-col gap-2">
        <p className="text-[13px] font-semibold">Cast dates · November</p>
        {[
          { name: 'Arjun (lead)', via: 'manager · Divya', state: marked ? 'marked 12 days' : sentLink ? 'link sent' : 'not asked' },
          { name: 'Meera (lead)', via: 'manager · Suresh', state: 'marked 15 days' },
          { name: 'Prakash (father)', via: 'direct', state: 'not asked' },
        ].map((p, i) => (
          <Card key={p.name} className="p-3" border={i === 0 && marked ? GREEN : LINE}>
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full" style={{ background: i === 0 ? `linear-gradient(135deg, ${ACCENT}, #fb923c)` : i === 1 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }} />
              <div className="min-w-0 flex-1 text-[10px]">
                <p className="font-semibold">{p.name}</p>
                <p className="truncate text-[8.5px]" style={{ color: MUTED }}>{p.via} · {p.state}</p>
              </div>
            </div>
            {i === 0 && <div className="mt-2"><Button small done={sentLink} icon={<Link2 className="h-3 w-3" />} label={marked ? 'Dates in · no login' : sentLink ? 'Link sent to Divya' : 'Send dates link'} /></div>}
          </Card>
        ))}
        <Rise on={overlay} className="mt-auto">
          <Card className="flex items-start gap-2 px-3 py-2.5" border={GREEN}>
            <CheckCheck className="mt-[1px] h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
            <p className="text-[9.5px] leading-snug"><b>Both leads free 11–16 Nov.</b> <span style={{ color: MUTED }}>Six days for sc 42–51. No phone calls made.</span></p>
          </Card>
        </Rise>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2 text-[10px]">
          <CalendarDays className="h-3.5 w-3.5" style={{ color: MUTED }} />
          <span style={{ color: MUTED }}>{marked ? 'Divya marked Arjun’s free days from her phone' : 'Nothing from Arjun yet'}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 text-[8.5px]" style={{ color: MUTED }}><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ACCENT }} /> Arjun</span>
            <Button small done={overlay} label={overlay ? 'Meera overlaid' : 'Overlay Meera'} />
          </div>
        </div>
        <Card className="flex-1 p-3">
          <div className="grid grid-cols-7 gap-1 text-center text-[8.5px]" style={{ color: MUTED }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
              const a = ARJUN.has(d) || (marked && PICK.includes(d))
              const m = overlay && MEERA.has(d)
              const both = a && m
              const bg = both ? GREEN : a ? ACCENT : m ? '#fbbf24' : PAPER
              return (
                <motion.span
                  key={d}
                  initial={false}
                  animate={{ backgroundColor: bg, color: a || m ? '#fff' : INK }}
                  transition={{ duration: 0.4, delay: marked && !overlay && PICK.includes(d) ? PICK.indexOf(d) * 0.12 : 0 }}
                  className="flex h-[46px] flex-col items-start justify-between rounded-md px-1.5 py-1 text-[10px] font-medium tabular-nums"
                >
                  {d}
                  {both && <span className="self-end text-[7px] font-semibold uppercase">both</span>}
                </motion.span>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ---------- scene 6: director's private song brief ---------- */

function Brief({ step }: { step: number }) {
  const sent = step >= 20
  const opened = step >= 20
  return (
    <div className="flex h-full gap-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-[13px] font-semibold">Brief · Song 2</p>
          <span className="text-[10px]" style={{ color: MUTED }}>Template: Song / BGM · attached: scene 42 excerpt only</span>
        </div>
        <Card className="relative flex-1 overflow-hidden p-5">
          <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-[40px] font-bold tracking-[0.35em] opacity-[0.045]" style={{ transform: 'rotate(-18deg)' }}>SANTHOSH</span>
          <Label>Situation</Label>
          <p className="mt-1 max-w-[380px] text-[11.5px] leading-relaxed">Night. Meera walks home after the fight with her father. She is not sad — she is relieved, and ashamed of being relieved. The song is the walk.</p>
          <div className="mt-4 grid grid-cols-4 gap-2 text-[9.5px]">
            {[['Mood', 'Quiet, warm'], ['Length', '4:10'], ['Placement', 'After sc 42'], ['Deadline', 'Scratch by 20 Nov']].map(([k, v]) => (
              <div key={k} className="rounded-lg px-2.5 py-2" style={{ backgroundColor: PAPER }}>
                <p className="font-semibold">{v}</p>
                <p style={{ color: MUTED }}>{k}</p>
              </div>
            ))}
          </div>
          <Label className="mt-4">References</Label>
          <div className="mt-1.5 flex gap-2">
            {['Scratch hum · 0:48', 'Kannathil Muthamittal · 1:12', 'Street at night · 3 stills'].map((r) => (
              <span key={r} className="rounded-md px-2.5 py-1.5 text-[9.5px]" style={{ backgroundColor: PAPER }}>▶ {r}</span>
            ))}
          </div>
          <Label className="mt-4">From the script</Label>
          <p className="mt-1 text-[10px] leading-relaxed" style={{ fontFamily: '"Courier New", monospace', color: MUTED }}>42 · EXT. STREET — NIGHT · MEERA walks away from the house… <span style={{ color: ACCENT }}>[excerpt · 6 lines of 118 scenes]</span></p>
        </Card>
      </div>

      <div className="flex w-[232px] shrink-0 flex-col gap-2">
        <Card className="p-3.5">
          <Label>Recipient</Label>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="h-8 w-8 shrink-0 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24, #fb7185)' }} />
            <div className="min-w-0 flex-1 text-[10px]">
              <p className="font-semibold">Santhosh · Music director</p>
              <motion.p key={opened ? 'o' : sent ? 's' : 'n'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: opened ? GREEN : MUTED }}>
                {opened ? 'Opened · 9:42 pm · logged' : sent ? 'Link sent · not yet opened' : 'No link yet'}
              </motion.p>
            </div>
            {opened && <Eye className="h-4 w-4" style={{ color: GREEN }} />}
          </div>
        </Card>
        <Card className="p-3.5">
          <Label>This link</Label>
          <ul className="mt-2 space-y-1.5 text-[9.5px]">
            {['View only · no download', 'Watermarked with his name', 'Expires in 7 days', 'Revocable any time', 'Every open logged', 'Script never attached'].map((t) => (
              <li key={t} className="flex items-center gap-2"><span className="flex h-3.5 w-6 items-center justify-end rounded-full p-[2px]" style={{ backgroundColor: GREEN }}><span className="h-2.5 w-2.5 rounded-full bg-white" /></span>{t}</li>
            ))}
          </ul>
        </Card>
        <div className="mt-auto space-y-1.5">
          <Button done={sent} icon={<Lock className="h-3.5 w-3.5" />} label={sent ? 'Private link sent' : 'Send private link'} />
          <Rise on={sent}><Button small muted label="Revoke link" /></Rise>
        </div>
      </div>
    </div>
  )
}

/* ---------- scene 7: the producer's inbox empties ---------- */

const INBOX = [
  { title: 'Approve ₹12,000 · generator hire', sub: 'Kumar · Lights · Day 15 · above Priya’s band', action: 'Approve' },
  { title: 'Day 15 call sheet · 1 not confirmed', sub: 'Mani · Transport · last opened v2', action: 'Call' },
  { title: 'Script v3 · 2 scenes changed', sub: 'Sc 42 and 77 · props list updated', action: 'Review' },
]

function InboxScene({ step }: { step: number }) {
  const acted = step >= 22
  const items = acted ? INBOX.slice(1) : INBOX
  return (
    <div className="flex h-full gap-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-[13px] font-semibold">Inbox</p>
          <motion.span key={items.length} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="text-[10px]" style={{ color: MUTED }}>{items.length} need you · everything else is just a feed</motion.span>
        </div>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.div key={it.title} layout exit={{ opacity: 0, x: 80, height: 0, marginBottom: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                <Card className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold">{it.title}</p>
                    <p className="truncate text-[9.5px]" style={{ color: MUTED }}>{it.sub}</p>
                  </div>
                  <Button small label={it.action} />
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <Card className="w-[248px] shrink-0 p-3.5">
        <Label>Today, across everything</Label>
        <ul className="mt-2 space-y-2 text-[9.5px]">
          {[
            ['4:12 pm', 'Priya approved ₹1,240 · Vijay · sc 42'],
            ['3:40 pm', 'Santhosh opened the Song 2 brief'],
            ['11:05 am', 'Divya marked Arjun’s free dates'],
            ['10:48 pm', 'Deepak published call sheet v3 · 5 of 6 confirmed'],
            ['9:30 am', 'Script v3 imported · 2 scenes changed'],
          ].map(([t, s]) => (
            <li key={s} className="flex gap-2"><span className="w-[46px] shrink-0 tabular-nums" style={{ color: MUTED }}>{t}</span><span>{s}</span></li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
