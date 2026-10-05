import { useRef, type CSSProperties, type ReactNode } from 'react'
import { CheckCheck, Clapperboard, Link2, Lock, Pause, Play, RotateCcw } from 'lucide-react'
import { Stage } from '../demos/Stage'
import { cn } from '../../lib/cn'
import {
  clamp,
  easeBack as back,
  easeIn as inn,
  easeInOut as inOut,
  easeOut as out,
  mix,
  prog,
  useTimeline,
  type Timeline,
} from './useTimeline'

/* Canvas */
const W = 960
const H = 540
const CX = 480
const CY = 270

/**
 * The film is authored on a 15-second story clock, then played on a longer
 * real clock. The warp stretches the moments with something to read — the
 * questions, the tags, the tiles, the links, the name — and leaves the
 * quick ones (implode, pops, fly-outs) nearly at their authored speed.
 * Pairs of [real seconds, story seconds].
 */
const STORY = 15
const WARP: [number, number][] = [
  [0, 0],
  [3.5, 2.2], // Notes. Calls. WhatsApp.
  [8.5, 4.3], // the pile-up and the three questions
  [9.4, 5.0], // implode — kept quick
  [14.5, 7.5], // the script lands and gets tagged
  [16.5, 8.3], // hold on "311 items tagged"
  [18.6, 9.6], // tiles fly out
  [23, 11.35], // tiles at work
  [28, 13.3], // links reach six people
  [32, 15], // the name
]
const LENGTH = WARP[WARP.length - 1][0]

/** Piecewise-linear lookup through WARP, in either direction. */
function lookup(v: number, from: 0 | 1) {
  const to = from === 0 ? 1 : 0
  for (let i = 1; i < WARP.length; i++) {
    const a = WARP[i - 1]
    const b = WARP[i]
    if (v <= b[from]) return mix(a[to], b[to], (v - a[from]) / (b[from] - a[from]))
  }
  return WARP[WARP.length - 1][to]
}
const toStory = (real: number) => lookup(clamp(real, 0, LENGTH), 0)
const toReal = (story: number) => lookup(clamp(story, 0, STORY), 1)

const INK = '#ededf2'
const ROSE = '#fb7185'
const VIOLET = '#7c5cff'
const CYAN = '#22d3ee'
const AMBER = '#fbbf24'
const GREEN = '#22c55e'
const DISPLAY = 'var(--font-display)'
const MONO = '"Courier New", Courier, monospace'
const GRADIENT: CSSProperties = {
  background: `linear-gradient(100deg, ${VIOLET}, ${CYAN} 55%, ${ROSE})`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

const CHAPTERS = [
  { at: 0, label: 'The set today' },
  { at: 4.95, label: 'One script' },
  { at: 8.6, label: 'It flows' },
  { at: 11.6, label: 'Just links' },
  { at: 13.5, label: 'Ciniops' },
]

/**
 * Ciniops in half a minute: the chaos of a set today collapses into one
 * tagged script, everything flows out of it, it reaches people as links,
 * and resolves into the name. Every element is a pure function of `t`, so
 * the viewer can scrub, pause and jump chapters; the pointer adds parallax.
 */
export function CiniopsFilm() {
  const tl = useTimeline(LENGTH, 2.2)
  const { px, py } = tl.frame
  const t = toStory(tl.frame.t)

  return (
    <div>
      <div
        className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#07070b] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]"
        onPointerMove={tl.onPointer}
        onPointerLeave={tl.onLeave}
        onClick={tl.toggle}
      >
        <Stage width={W} height={H}>
          <div className="relative h-full w-full overflow-hidden" style={{ color: INK }}>
            <Backdrop t={t} px={px} py={py} />

            <Layer d={22} px={px} py={py}><Chaos t={t} /></Layer>
            <Layer d={6} px={px} py={py}>
              <Opening t={t} />
              <Unread t={t} />
              <Questions t={t} />
            </Layer>
            <Ring t={t} at={4.85} color={ROSE} />
            <Ring t={t} at={5.0} color={VIOLET} size={460} />

            <Layer d={12} px={px} py={py}><Tiles t={t} /></Layer>
            <Layer d={8} px={px} py={py}>
              <ScriptPage t={t} />
              <TagChips t={t} />
              <Footnote t={t} />
            </Layer>
            <Layer d={10} px={px} py={py}><Links t={t} /></Layer>
            <Layer d={4} px={px} py={py}><Captions t={t} /></Layer>

            <Ring t={t} at={13.7} color={ROSE} />
            <Ring t={t} at={13.85} color={CYAN} size={420} />
            <Layer d={5} px={px} py={py}><Finale t={t} /></Layer>

            {!tl.playing && tl.frame.t < LENGTH && (
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[12px] text-white/80 backdrop-blur">
                <Pause className="h-3 w-3" /> Paused · click to play
              </span>
            )}
          </div>
        </Stage>
      </div>

      <Controls tl={tl} />
    </div>
  )
}

/* ---------- primitives ---------- */

/** Absolute placement around a centre point, with scale, rotation, fade, blur. */
function place(
  x: number,
  y: number,
  o: { s?: number; r?: number; a?: number; blur?: number } = {},
): CSSProperties {
  return {
    position: 'absolute',
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${o.s ?? 1}) rotate(${o.r ?? 0}deg)`,
    opacity: o.a ?? 1,
    filter: o.blur ? `blur(${o.blur}px)` : undefined,
    willChange: 'transform, opacity',
  }
}

/** A parallax plane — deeper layers move further with the pointer. */
function Layer({ d, px, py, children }: { d: number; px: number; py: number; children: ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ transform: `translate3d(${px * d}px, ${py * d}px, 0)` }}
    >
      {children}
    </div>
  )
}

function Ring({ t, at, color, size = 640, x = CX, y = CY }: { t: number; at: number; color: string; size?: number; x?: number; y?: number }) {
  const p = prog(t, at, at + 0.9)
  if (p <= 0 || p >= 1) return null
  return (
    <div
      style={{
        ...place(x, y, { s: 0.1 + out(p) * 0.9, a: (1 - p) * 0.8 }),
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        boxShadow: `0 0 40px ${color}55, inset 0 0 40px ${color}33`,
      }}
    />
  )
}

/** Point on a quadratic Bézier. */
function bez(a: readonly number[], c: readonly number[], b: readonly number[], u: number) {
  const v = 1 - u
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]
}

/* ---------- backdrop ---------- */

function Backdrop({ t, px, py }: { t: number; px: number; py: number }) {
  const chaos = prog(t, 0.8, 4.2) * (1 - prog(t, 4.3, 4.9))
  const finale = prog(t, 13.4, 14.6)
  const flicker = chaos * (0.75 + 0.25 * Math.sin(t * 23))
  const mask = 'radial-gradient(70% 70% at 50% 50%, black, transparent)'
  return (
    <>
      <div className="absolute inset-0" style={{ background: '#07070b' }} />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.08,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          backgroundPosition: `${t * 6}px ${t * 6}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(45% 55% at ${50 + px * 12}% ${45 + py * 12}%, rgba(251,113,133,${0.16 + finale * 0.24}), transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: flicker * 0.6,
          background: 'radial-gradient(60% 60% at 50% 50%, rgba(234,88,12,.3), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.7))' }}
      />
    </>
  )
}

/* ---------- 0–5 s: the set today ---------- */

function Opening({ t }: { t: number }) {
  if (t > 2.2) return null
  const exit = prog(t, 1.5, 2.1)
  const lead = out(prog(t, 0, 0.35))
  return (
    <div
      style={place(CX, CY, { s: mix(1, 1.3, inOut(exit)), a: 1 - exit, blur: exit * 12 })}
      className="whitespace-nowrap text-center"
    >
      <p className="text-[18px] text-white/55" style={{ opacity: lead, transform: `translateY(${(1 - lead) * 10}px)` }}>
        Every film set runs on
      </p>
      <p className="mt-2 flex gap-4 text-[78px] font-semibold leading-none tracking-[-0.04em]" style={{ fontFamily: DISPLAY }}>
        {['Notes.', 'Calls.', 'WhatsApp.'].map((w, i) => {
          const p = back(prog(t, 0.2 + i * 0.28, 0.65 + i * 0.28))
          return (
            <span
              key={w}
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 34}px) scale(${mix(0.6, 1, p)})`,
                opacity: clamp(p * 1.5),
                color: i === 2 ? '#25d366' : INK,
              }}
            >
              {w}
            </span>
          )
        })}
      </p>
    </div>
  )
}

type ChaosItem = { k: 'bubble' | 'voucher' | 'file' | 'note'; text: string; x: number; y: number; r: number; at: number }

const CHAOS: ChaosItem[] = [
  { k: 'bubble', text: 'location changed!!', x: 165, y: 120, r: -6, at: 0.9 },
  { k: 'file', text: 'CallSheet_v1.pdf', x: 480, y: 92, r: 2, at: 1.0 },
  { k: 'bubble', text: 'v3 FINAL?? or v4', x: 760, y: 105, r: 5, at: 1.2 },
  { k: 'voucher', text: '₹640 · tea shop', x: 300, y: 205, r: -12, at: 1.4 },
  { k: 'bubble', text: 'who has the cash bundle', x: 655, y: 430, r: -4, at: 1.6 },
  { k: 'file', text: 'CallSheet_v2_final.pdf', x: 505, y: 122, r: -2, at: 1.8 },
  { k: 'bubble', text: 'send me the full script', x: 235, y: 410, r: 4, at: 2.0 },
  { k: 'voucher', text: '₹2,500 · no bill', x: 640, y: 225, r: 9, at: 2.1 },
  { k: 'bubble', text: 'call time 5 or 5:30?', x: 820, y: 280, r: -3, at: 2.3 },
  { k: 'note', text: 'shot division — notebook p.14', x: 345, y: 330, r: 7, at: 2.4 },
  { k: 'file', text: 'CallSheet_v3_FINAL_real.pdf', x: 530, y: 152, r: 3, at: 2.6 },
  { k: 'bubble', text: 'bill photo?? anyone', x: 120, y: 280, r: 3, at: 2.6 },
  { k: 'voucher', text: '₹310 · rope', x: 790, y: 380, r: -8, at: 2.8 },
  { k: 'bubble', text: 'Ravi not picking up', x: 450, y: 480, r: -2, at: 3.0 },
]

function Chaos({ t }: { t: number }) {
  if (t > 5) return null
  const shake = 6 * inOut(prog(t, 2.4, 4.3))
  const imp = inn(prog(t, 4.3, 4.9))
  return (
    <>
      {CHAOS.map((c, i) => {
        const enter = back(prog(t, c.at, c.at + 0.45))
        if (enter <= 0) return null
        const jx = Math.sin(t * 13 + i * 1.7) * shake
        const jy = Math.cos(t * 11 + i * 2.3) * shake
        return (
          <div
            key={c.text}
            style={place(mix(c.x + jx, CX, imp), mix(c.y + jy, CY, imp), {
              s: enter * (1 - imp),
              r: c.r + imp * (i % 2 ? 140 : -140),
              a: clamp(enter * 1.4),
            })}
          >
            <ChaosCard c={c} i={i} />
          </div>
        )
      })}
    </>
  )
}

function ChaosCard({ c, i }: { c: ChaosItem; i: number }) {
  switch (c.k) {
    case 'bubble': {
      const mine = i % 3 === 0
      return (
        <div
          className="whitespace-nowrap rounded-2xl px-3.5 py-2 text-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
          style={{
            backgroundColor: mine ? '#005c4b' : '#202c33',
            color: '#e9edef',
            borderTopRightRadius: mine ? 4 : undefined,
            borderTopLeftRadius: mine ? undefined : 4,
          }}
        >
          {c.text}
          <span className="ml-2 text-[10px]" style={{ color: 'rgba(233,237,239,.55)' }}>
            11:{40 + (i % 19)} pm{mine ? ' ✓✓' : ''}
          </span>
        </div>
      )
    }
    case 'voucher':
      return (
        <div
          className="w-[156px] px-3 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
          style={{ background: '#f5f0e1', color: '#3b3226', fontFamily: MONO, border: '1px dashed #b9ad94' }}
        >
          <p className="text-[9px] tracking-[0.2em]">CASH VOUCHER</p>
          <p className="mt-1 text-[16px] font-bold">{c.text}</p>
          <p className="mt-1 text-[9px] italic">sign: ________</p>
        </div>
      )
    case 'file':
      return (
        <div className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#1a1a24] px-3 py-2 text-[13px] text-white/85 shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
          <span className="rounded bg-[#e5484d] px-1.5 py-[1px] text-[9px] font-bold text-white">PDF</span>
          {c.text}
        </div>
      )
    case 'note':
      return (
        <div
          className="w-[150px] px-3 py-3 text-[14px] leading-snug shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
          style={{ background: '#fde68a', color: '#3f2d0b', fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}
        >
          {c.text}
        </div>
      )
  }
}

function Unread({ t }: { t: number }) {
  const a = out(prog(t, 0.9, 1.3)) * (1 - prog(t, 4.2, 4.5))
  if (a <= 0) return null
  const n = Math.round(47 * prog(t, 0.9, 4.2))
  return (
    <div
      style={place(CX, 34, { a })}
      className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/55 px-3.5 py-1.5 text-[12px] text-white/75"
    >
      <span className="h-2 w-2 rounded-full bg-[#25d366]" />
      4 groups · <b className="tabular-nums text-white">{n}</b> unread · 11:48 pm
    </div>
  )
}

const QUESTIONS = [
  { q: 'Who has the cash?', at: 2.5 },
  { q: 'Who read v3?', at: 3.05 },
  { q: 'Who has the script?', at: 3.6 },
]

function Questions({ t }: { t: number }) {
  const panel = out(prog(t, 2.35, 2.8))
  const imp = inn(prog(t, 4.3, 4.85))
  if (panel <= 0 || imp >= 1) return null
  return (
    <div
      style={{
        ...place(CX, CY, { s: mix(0.94, 1, panel) * (1 - imp * 0.9), a: panel * (1 - imp) }),
        background: 'rgba(7,7,11,.8)',
        backdropFilter: 'blur(10px)',
      }}
      className="rounded-3xl border border-white/10 px-11 py-8 text-center"
    >
      {QUESTIONS.map(({ q, at }, i) => {
        const p = out(prog(t, at, at + 0.4))
        return (
          <p
            key={q}
            className="whitespace-nowrap text-[42px] font-semibold leading-[1.15] tracking-[-0.03em]"
            style={{
              fontFamily: DISPLAY,
              opacity: p,
              transform: `translateY(${(1 - p) * 16}px)`,
              color: i === 2 ? ROSE : INK,
            }}
          >
            {q}
          </p>
        )
      })}
    </div>
  )
}

/* ---------- 5–8.5 s: one script, tagged once ---------- */

const TAGS = [
  { label: 'Meera', kind: 'character · 61 scenes', color: ROSE, paper: '#fecdd3', at: 6.0, chip: [170, 200] },
  { label: 'Meera’s house', kind: 'location · 9 scenes', color: '#60a5fa', paper: '#bfdbfe', at: 6.35, chip: [790, 200] },
  { label: 'Wedding saree', kind: 'costume · 5 scenes', color: '#a78bfa', paper: '#ddd6fe', at: 6.7, chip: [170, 360] },
  { label: 'Brass lamp', kind: 'prop · 3 scenes', color: AMBER, paper: '#fde68a', at: 7.05, chip: [790, 360] },
] as const

type Tag = (typeof TAGS)[number]

/** A highlighter stroke that sweeps left to right under a word. */
function Mark({ t, tag, children }: { t: number; tag: Tag; children: string }) {
  const p = out(prog(t, tag.at, tag.at + 0.35))
  return (
    <span className="relative whitespace-nowrap">
      <span
        className="absolute -inset-x-[3px] inset-y-[1px] rounded-[3px]"
        style={{ background: tag.paper, transform: `scaleX(${p})`, transformOrigin: 'left' }}
      />
      <span className="relative font-bold">{children}</span>
    </span>
  )
}

function ScriptPage({ t }: { t: number }) {
  if (t < 4.9 || t > 12.2) return null
  const enter = back(prog(t, 4.95, 5.6))
  const shrink = inOut(prog(t, 8.3, 8.9))
  const leave = inOut(prog(t, 11.4, 11.9))
  const sheen = prog(t, 5.5, 6.1)
  return (
    <div
      style={{
        ...place(CX, mix(285, CY, shrink), {
          s: mix(0.4, 1, enter) * mix(1, 0.44, shrink) * mix(1, 0.5, leave),
          r: mix(-10, 0, enter),
          a: clamp(enter * 2) * (1 - leave),
        }),
        width: 370,
        background: '#f7f5ef',
        color: '#1b1b1f',
      }}
      className="overflow-hidden rounded-xl px-7 py-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)]"
    >
      {/* light sweep as it lands */}
      {sheen > 0 && sheen < 1 && (
        <span
          className="pointer-events-none absolute inset-y-0 w-24"
          style={{
            left: `${mix(-30, 130, sheen)}%`,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)',
            transform: 'skewX(-18deg)',
          }}
        />
      )}
      <div className="flex justify-between text-[10px] text-black/45">
        <span>MEERA · script v3</span>
        <span>Scene 42 of 118</span>
      </div>
      <p className="mt-3 text-[11px] font-bold tracking-wide text-black/60" style={{ fontFamily: MONO }}>
        42 · EXT. STREET OUTSIDE MEERA’S HOUSE — NIGHT
      </p>
      <p className="mt-3 text-[12.5px] leading-[1.8]" style={{ fontFamily: MONO }}>
        <Mark t={t} tag={TAGS[0]}>MEERA</Mark> walks away from the <Mark t={t} tag={TAGS[1]}>house</Mark>, still
        in the <Mark t={t} tag={TAGS[2]}>wedding saree</Mark>. A <Mark t={t} tag={TAGS[3]}>brass lamp</Mark> burns
        in the window behind her. Her father does not come to the door.
      </p>
      <p className="mt-4 text-center text-[12.5px]" style={{ fontFamily: MONO }}>MEERA</p>
      <p className="px-8 text-center text-[12.5px] leading-[1.6]" style={{ fontFamily: MONO }}>
        Appa, I’m not coming back tonight.
      </p>
    </div>
  )
}

function TagChips({ t }: { t: number }) {
  if (t < 6 || t > 8.8) return null
  const pull = inn(prog(t, 8.3, 8.75))
  return (
    <>
      {TAGS.map((tag) => {
        const p = back(prog(t, tag.at + 0.1, tag.at + 0.65))
        if (p <= 0) return null
        const x = mix(mix(CX, tag.chip[0], p), CX, pull)
        const y = mix(mix(CY, tag.chip[1], p), CY, pull)
        return (
          <div
            key={tag.label}
            style={{
              ...place(x, y, { s: mix(0.5, 1, clamp(p)) * (1 - pull), a: clamp(p * 2) }),
              borderColor: `${tag.color}66`,
              boxShadow: `0 0 30px ${tag.color}33`,
            }}
            className="flex items-center gap-2.5 whitespace-nowrap rounded-xl border bg-[#14141d]/95 px-3.5 py-2.5"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tag.color, boxShadow: `0 0 10px ${tag.color}` }} />
            <span className="text-[15px] font-semibold text-white">{tag.label}</span>
            <span className="text-[12px] text-white/50">{tag.kind}</span>
          </div>
        )
      })}
    </>
  )
}

function Footnote({ t }: { t: number }) {
  const a = out(prog(t, 7.45, 7.85)) * (1 - prog(t, 8.2, 8.45))
  if (a <= 0) return null
  return (
    <p style={place(CX, 490, { a })} className="whitespace-nowrap text-[13px] text-white/55">
      <b className="text-white">311 items</b> tagged across <b className="text-white">118 scenes</b> · a person confirms each one
    </p>
  )
}

/* ---------- 8.5–11.5 s: everything flows from it ---------- */

const TILES = [
  { key: 'shots', x: 205, y: 150, at: 9.0, color: CYAN },
  { key: 'calls', x: 755, y: 150, at: 9.12, color: GREEN },
  { key: 'cash', x: 205, y: 400, at: 9.24, color: AMBER },
  { key: 'brief', x: 755, y: 400, at: 9.36, color: VIOLET },
] as const

type TileKey = (typeof TILES)[number]['key']

function Tiles({ t }: { t: number }) {
  if (t < 8.85 || t > 12) return null
  const leave = inOut(prog(t, 11.35, 11.85))
  return (
    <>
      <svg width={W} height={H} className="absolute inset-0" style={{ opacity: 1 - leave }}>
        {TILES.map((tile) => {
          const c = [tile.x, CY]
          const p = out(prog(t, tile.at - 0.05, tile.at + 0.5))
          return (
            <g key={tile.key}>
              <path
                d={`M ${CX} ${CY} Q ${c[0]} ${c[1]} ${tile.x} ${tile.y}`}
                fill="none"
                stroke={tile.color}
                strokeOpacity={0.5}
                strokeWidth={1.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
              {t > 9.6 &&
                [0, 1, 2].map((k) => {
                  const u = ((t - 9.6) * 0.65 + k / 3) % 1
                  const [x, y] = bez([CX, CY], c, [tile.x, tile.y], u)
                  return (
                    <g key={k}>
                      <circle cx={x} cy={y} r={8} fill={tile.color} opacity={0.18} />
                      <circle cx={x} cy={y} r={2.8} fill={tile.color} />
                    </g>
                  )
                })}
            </g>
          )
        })}
      </svg>

      {TILES.map((tile) => {
        const e = back(prog(t, tile.at, tile.at + 0.6))
        if (e <= 0) return null
        const pos = out(prog(t, tile.at, tile.at + 0.6))
        const x = mix(mix(CX, tile.x, pos), CX, leave * 0.25)
        const y = mix(mix(CY, tile.y, pos), CY, leave * 0.25)
        return (
          <div
            key={tile.key}
            style={{
              ...place(x, y, { s: mix(0.4, 1, e) * mix(1, 0.85, leave), a: clamp(e * 2) * (1 - leave) }),
              width: 256,
              borderColor: `${tile.color}55`,
              boxShadow: `0 20px 50px -20px rgba(0,0,0,.9), 0 0 40px ${tile.color}1f`,
            }}
            className="rounded-2xl border bg-[#111119]/95 p-4"
          >
            <TileBody k={tile.key} t={t} color={tile.color} />
          </div>
        )
      })}
    </>
  )
}

function TileHead({ color, title, sub }: { color: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      <span className="text-[13px] font-semibold text-white">{title}</span>
      <span className="ml-auto text-[10px] text-white/45">{sub}</span>
    </div>
  )
}

const SHOTS = ['42A · wide, street', '42B · MCU Meera', '42C · insert, lamp', '42D · track out']

function TileBody({ k, t, color }: { k: TileKey; t: number; color: string }) {
  switch (k) {
    case 'shots':
      return (
        <>
          <TileHead color={color} title="Shot list · sc 42" sub="from the script" />
          <ul className="mt-3 space-y-1.5">
            {SHOTS.map((s, i) => {
              const d = back(prog(t, 9.8 + i * 0.33, 10.1 + i * 0.33))
              return (
                <li key={s} className="flex items-center gap-2 text-[12px] text-white/80">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-white/25">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color, transform: `scale(${d})` }} />
                  </span>
                  {s}
                </li>
              )
            })}
          </ul>
        </>
      )
    case 'calls': {
      const lit = [0, 1, 2, 3, 4].filter((i) => t >= 9.9 + i * 0.25).length
      return (
        <>
          <TileHead color={color} title="Call sheet · Day 15" sub="v3" />
          <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums" style={{ fontFamily: DISPLAY }}>6:00 am</p>
          <div className="mt-3 flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-full transition-colors duration-300"
                style={{ backgroundColor: i < lit ? color : 'rgba(255,255,255,.14)', boxShadow: i < lit ? `0 0 10px ${color}88` : undefined }}
              />
            ))}
            <span className="ml-2 text-[12px] tabular-nums text-white/70">{lit}/6 confirmed</span>
          </div>
        </>
      )
    }
    case 'cash': {
      const amount = Math.round((1842300 * out(prog(t, 9.5, 11))) / 100) * 100
      return (
        <>
          <TileHead color={color} title="Cash · days 1–15" sub="approved" />
          <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums" style={{ fontFamily: DISPLAY }}>
            ₹{amount.toLocaleString('en-IN')}
          </p>
          <div className="mt-3 flex gap-1.5">
            {['GST', 'TDS 194C', 'Tally ✓'].map((c, i) => {
              const p = back(prog(t, 10.4 + i * 0.2, 10.75 + i * 0.2))
              return (
                <span
                  key={c}
                  className="rounded-md px-2 py-[3px] text-[11px] font-medium"
                  style={{ backgroundColor: `${color}22`, color, transform: `scale(${p})`, opacity: clamp(p * 2) }}
                >
                  {c}
                </span>
              )
            })}
          </div>
        </>
      )
    }
    case 'brief': {
      const opened = out(prog(t, 10.9, 11.2))
      return (
        <>
          <TileHead color={color} title="Brief · Song 2" sub="private link" />
          <p className="mt-2.5 flex items-center gap-1.5 text-[12px] text-white/80">
            <Lock className="h-3.5 w-3.5" style={{ color }} /> Scene 42 excerpt only
          </p>
          <p className="mt-1 text-[12px] text-white/55">View only · watermarked · expires</p>
          <p
            className="mt-2 flex items-center gap-1.5 text-[12px] font-medium"
            style={{ color: GREEN, opacity: opened, transform: `translateY(${(1 - opened) * 6}px)` }}
          >
            <CheckCheck className="h-3.5 w-3.5" /> Opened by the music director
          </p>
        </>
      )
    }
  }
}

/* ---------- 11.5–13.5 s: no logins, just links ---------- */

const NODE = [CX, 200] as const

const PEOPLE = [
  { role: 'Producer', initials: 'PR', status: 'approved ₹12,000', hue: ['#fb7185', '#f97316'] },
  { role: 'Line producer', initials: 'LP', status: 'wallets settled', hue: ['#fbbf24', '#f59e0b'] },
  { role: '1st AD', initials: 'AD', status: 'v3 confirmed', hue: ['#22d3ee', '#0ea5e9'] },
  { role: 'Actor', initials: 'AC', status: '7:00 am · ✓', hue: ['#a78bfa', '#7c3aed'] },
  { role: 'Spot boy', initials: 'SB', status: 'bill sent', hue: ['#a3e635', '#65a30d'] },
  { role: 'Music director', initials: 'MD', status: 'opened brief', hue: ['#f472b6', '#db2777'] },
]

const personAt = (i: number) => {
  const x = mix(150, 810, i / 5)
  return [x, 365 + 60 * ((x - CX) / 330) ** 2] as const
}

function Links({ t }: { t: number }) {
  if (t < 11.55 || t > 14) return null
  const fin = inn(prog(t, 13.3, 13.75))
  const n = back(prog(t, 11.6, 12.1))
  return (
    <>
      <svg width={W} height={H} className="absolute inset-0" style={{ opacity: 1 - fin }}>
        {PEOPLE.map((p, i) => {
          const [x, y] = personAt(i)
          const c = [x, NODE[1]]
          const s = 12.25 + i * 0.13
          const d = out(prog(t, s, s + 0.4))
          const [dx, dy] = bez(NODE, c, [x, y], d)
          return (
            <g key={p.role}>
              <path
                d={`M ${NODE[0]} ${NODE[1]} Q ${c[0]} ${c[1]} ${x} ${y}`}
                fill="none"
                stroke={p.hue[0]}
                strokeOpacity={0.45}
                strokeWidth={1.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - d}
              />
              {d > 0 && d < 1 && (
                <>
                  <circle cx={dx} cy={dy} r={10} fill={p.hue[0]} opacity={0.2} />
                  <circle cx={dx} cy={dy} r={3.5} fill="#fff" />
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* The link node */}
      <div
        style={{
          ...place(NODE[0], NODE[1], { s: n * (1 - fin), a: clamp(n * 2) * (1 - fin) }),
          width: 88,
          height: 88,
          background: `linear-gradient(135deg, ${ROSE}, #f97316)`,
          boxShadow: `0 0 0 ${8 + Math.sin(t * 6) * 4}px rgba(251,113,133,.15), 0 0 60px rgba(251,113,133,.5)`,
        }}
        className="flex items-center justify-center rounded-full"
      >
        <Link2 className="h-9 w-9 text-white" strokeWidth={2.4} />
      </div>
      <Ring t={t} at={11.75} color={ROSE} size={300} x={NODE[0]} y={NODE[1]} />

      {PEOPLE.map((p, i) => {
        const [x0, y0] = personAt(i)
        const e = back(prog(t, 11.85 + i * 0.07, 12.3 + i * 0.07))
        if (e <= 0) return null
        const arrive = 12.65 + i * 0.13
        const badge = back(prog(t, arrive, arrive + 0.35))
        const status = out(prog(t, arrive, arrive + 0.4))
        const x = mix(x0, CX, fin)
        const y = mix(y0, CY, fin)
        return (
          <div key={p.role} style={place(x, y + 22, { s: mix(0.3, 1, e) * (1 - fin), a: clamp(e * 2) * (1 - fin) })} className="flex w-[130px] flex-col items-center text-center">
            <div className="relative">
              <Ring t={t} at={arrive} color={GREEN} size={90} x={30} y={30} />
              <div
                className="flex h-[60px] w-[60px] items-center justify-center rounded-full text-[16px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${p.hue[0]}, ${p.hue[1]})`, boxShadow: `0 10px 30px -8px ${p.hue[0]}` }}
              >
                {p.initials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#07070b]"
                style={{ backgroundColor: GREEN, transform: `scale(${badge})` }}
              >
                <CheckCheck className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </span>
            </div>
            <p className="mt-2.5 whitespace-nowrap text-[13px] font-medium text-white/90">{p.role}</p>
            <p className="whitespace-nowrap text-[11px]" style={{ color: GREEN, opacity: status }}>{p.status}</p>
          </div>
        )
      })}
    </>
  )
}

/* ---------- captions ---------- */

const CAPTIONS = [
  { from: 5.4, to: 8.4, lead: 'Tag the script', punch: 'once.' },
  { from: 8.6, to: 11.5, lead: 'Everything', punch: 'flows from it.' },
  { from: 11.75, to: 13.35, lead: 'No logins.', punch: 'Just links.' },
]

function Captions({ t }: { t: number }) {
  return (
    <>
      {CAPTIONS.map((c) => {
        const i = out(prog(t, c.from, c.from + 0.55))
        const o = prog(t, c.to - 0.35, c.to)
        const a = i * (1 - o)
        if (a <= 0) return null
        return (
          <p
            key={c.lead}
            style={{ ...place(CX, 58 + (1 - i) * 16 - o * 10, { a, blur: o * 6 }), fontFamily: DISPLAY }}
            className="whitespace-nowrap text-[36px] font-semibold tracking-[-0.03em]"
          >
            <span className="text-white/90">{c.lead} </span>
            <span style={GRADIENT}>{c.punch}</span>
          </p>
        )
      })}
    </>
  )
}

/* ---------- 13.5–15 s: the name ---------- */

function Finale({ t }: { t: number }) {
  if (t < 13.55) return null
  const m = back(prog(t, 13.65, 14.15))
  const tag = out(prog(t, 14.3, 14.75))
  const sub = out(prog(t, 14.55, 14.95))
  return (
    <div style={place(CX, CY)} className="flex flex-col items-center whitespace-nowrap text-center">
      <div
        className="flex h-[78px] w-[78px] items-center justify-center rounded-[22px]"
        style={{
          transform: `scale(${m}) rotate(${mix(-30, 0, clamp(m))}deg)`,
          opacity: clamp(m * 2),
          background: `linear-gradient(135deg, ${ROSE}, #f97316)`,
          boxShadow: '0 20px 60px -10px rgba(251,113,133,.7)',
        }}
      >
        <Clapperboard className="h-9 w-9 text-white" strokeWidth={2.2} />
      </div>
      <p className="mt-5 flex text-[80px] font-semibold leading-none tracking-[-0.045em]" style={{ fontFamily: DISPLAY }}>
        {'Ciniops'.split('').map((ch, i) => {
          const l = out(prog(t, 13.85 + i * 0.045, 14.3 + i * 0.045))
          return (
            <span key={i} style={{ display: 'inline-block', opacity: l, transform: `translateY(${(1 - l) * 30}px)`, filter: `blur(${(1 - l) * 8}px)` }}>
              {ch}
            </span>
          )
        })}
      </p>
      <p className="mt-4 text-[23px] font-medium" style={{ opacity: tag, transform: `translateY(${(1 - tag) * 10}px)` }}>
        <span className="text-white/70">Cash. Crew. Calls. </span>
        <span style={GRADIENT}>Tracked, not chased.</span>
      </p>
      <p className="mt-3 text-[13px] text-white/45" style={{ opacity: sub }}>
        Tag the script once. Everything on set flows from it.
      </p>
    </div>
  )
}

/* ---------- controls ---------- */

function Controls({ tl }: { tl: Timeline }) {
  const { t } = tl.frame
  const track = useRef<HTMLDivElement>(null)
  const ended = t >= LENGTH
  const chapters = CHAPTERS.map((c) => ({ ...c, at: toReal(c.at) }))
  const current = chapters.reduce((acc, c, i) => (t >= c.at ? i : acc), 0)

  const seekAt = (clientX: number) => {
    const el = track.current
    if (!el) return
    const r = el.getBoundingClientRect()
    tl.seek(((clientX - r.left) / r.width) * LENGTH)
  }

  return (
    <div className="mt-3 flex items-center gap-3 sm:gap-4">
      <button
        onClick={tl.toggle}
        aria-label={ended ? 'Replay' : tl.playing ? 'Pause' : 'Play'}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-bg transition-colors hover:bg-white"
      >
        {ended && !tl.playing ? (
          <RotateCcw className="h-4 w-4" />
        ) : tl.playing ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Film timeline"
          aria-valuemin={0}
          aria-valuemax={LENGTH}
          aria-valuenow={Number(t.toFixed(1))}
          className="relative h-5 cursor-pointer touch-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            tl.startScrub()
            seekAt(e.clientX)
          }}
          onPointerMove={(e) => {
            if (tl.isScrubbing()) seekAt(e.clientX)
          }}
          onPointerUp={tl.endScrub}
          onPointerCancel={tl.endScrub}
        >
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/10" />
          <div
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
            style={{ width: `${(t / LENGTH) * 100}%`, background: `linear-gradient(90deg, ${VIOLET}, ${CYAN}, ${ROSE})` }}
          />
          {chapters.slice(1).map((c) => (
            <span
              key={c.label}
              className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/30"
              style={{ left: `${(c.at / LENGTH) * 100}%` }}
            />
          ))}
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.5)]"
            style={{ left: `${(t / LENGTH) * 100}%` }}
          />
        </div>

        {/* Chapters — click to jump */}
        <div className="relative mt-1 hidden h-4 sm:block">
          {chapters.map((c, i) => (
            <button
              key={c.label}
              onClick={() => tl.seek(c.at)}
              className={cn(
                'absolute whitespace-nowrap text-[11px] transition-colors',
                i === current ? 'text-ink' : 'text-faint hover:text-muted',
              )}
              style={{ left: `${(c.at / LENGTH) * 100}%` }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <span className="shrink-0 font-display text-xs tabular-nums text-faint">
        {t.toFixed(1)} / {LENGTH}.0s
      </span>
    </div>
  )
}
