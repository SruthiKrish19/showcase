/**
 * The Ciniops film score — synthesised from raw math, no samples, no assets.
 *
 * One pure function fills a stereo buffer, used two ways: a Node script bakes
 * it to a WAV to mux into the MP4, and the website builds the same buffer in
 * Web Audio so the film has sound in the browser too. Times are REAL seconds
 * on the 33.5 s timeline, so the hits land on what is happening on screen.
 *
 * It is built on a 102 BPM grid whose bar lines fall on the film's moments:
 * four bars of A-minor tension under the chaos, an implosion, the drop into a
 * warm C-major groove as the script lands, full energy while the work flows
 * out, and the logo on the beat.
 */

export const LENGTH = 33.5

const TAU = Math.PI * 2
/** Frequency from semitones above (or below) A4. */
const hz = (semis: number) => 440 * 2 ** (semis / 12)

const F1 = hz(-40), G1 = hz(-38), A1 = hz(-36), C2 = hz(-33), A2 = hz(-24)
const F3 = hz(-16), G3 = hz(-14), A3 = hz(-12), B3 = hz(-10)
const C4 = hz(-9), D4 = hz(-7), E4 = hz(-5), F4 = hz(-4), G4 = hz(-2)
const A4 = hz(0), B4 = hz(2), C5 = hz(3), D5 = hz(5), E5 = hz(7), G5 = hz(10), C6 = hz(15)

/* ---------- the grid ---------- */
/** One bar is 2.35 s, so bar 4 — the drop — lands exactly as the script does. */
const BAR = 2.35
const BEAT = BAR / 4
const STEP = BEAT / 4 // a 16th note
const at = (bar: number, step: number) => bar * BAR + step * STEP

type Chord = { pad: number[]; root: number; arp: number[] }
const C: Chord = { pad: [C4, E4, G4], root: C2, arp: [C5, E5, G5, E5] }
const AM: Chord = { pad: [A3, C4, E4], root: A1, arp: [A4, C5, E5, C5] }
const F: Chord = { pad: [F3, A3, C4], root: F1, arp: [F4, A4, C5, A4] }
const G: Chord = { pad: [G3, B3, D4], root: G1, arp: [G4, B4, D5, B4] }
/** Chord per bar. Bars 0–3 are the tension section; the groove starts at 4. */
const BARS: Chord[] = [AM, AM, AM, AM, C, AM, F, G, C, AM, F, G, C, C, C]
const chordAt = (bar: number) => BARS[Math.min(Math.max(bar, 0), BARS.length - 1)]

/* ---------- film moments, in real seconds ---------- */
const Q = [4.2, 5.5, 6.85] // the three questions
const IMPLODE = at(3, 11) // the pile-up collapses (~8.67 s)
const DROP = at(4, 0) // the script lands (9.4 s)
const TILES = [17.6, 17.8, 18.0, 18.2]
const LOGO = at(12, 4) // beat 2 of bar 12 (~28.79 s)
const TAGLINE = 30.35

/* ---------- the arrangement: lists of hits ---------- */
type Hit = { t: number; v: number; f?: number }

function arrange() {
  const kick: Hit[] = []
  const clap: Hit[] = []
  const hat: Hit[] = []
  const open: Hit[] = []
  const bass: Hit[] = []
  const arp: Hit[] = []
  const push = (list: Hit[], bar: number, steps: number[], v: number, f?: (k: number) => number) =>
    steps.forEach((s, k) => list.push({ t: at(bar, s), v, f: f?.(k) }))

  // Tension: off-beat hats, then a kick, then a roll into the implosion
  push(hat, 0, [2, 6, 10, 14], 0.3)
  push(hat, 1, [2, 6, 10, 14], 0.4)
  push(kick, 2, [0, 4, 8, 12], 0.55)
  push(hat, 2, [2, 6, 10, 14], 0.5)
  push(kick, 3, [0, 4, 8], 0.7)
  push(hat, 3, [2, 6], 0.5)
  ;[8, 9, 10].forEach((s, k) => clap.push({ t: at(3, s), v: 0.3 + k * 0.15 }))
  // …then half a bar of silence until the drop

  // Groove: bars 4–6 warm, 7–11 full
  for (let bar = 4; bar <= 11; bar++) {
    const full = bar >= 7
    const ch = chordAt(bar)
    push(kick, bar, full ? [0, 4, 8, 12] : [0, 8, 10], 0.9)
    push(clap, bar, [4, 12], 0.75)
    if (full) {
      for (let s = 0; s < 16; s++) hat.push({ t: at(bar, s), v: s % 2 ? 0.25 : 0.5 })
      push(open, bar, [2, 6, 10, 14], 0.35)
    } else {
      push(hat, bar, [0, 2, 4, 6, 8, 10, 12, 14], 0.4)
    }
    push(bass, bar, full ? [0, 2, 4, 6, 8, 10, 12, 14] : [0, 3, 6, 8, 11, 14], 0.8, () => ch.root)
    if (bar >= 7 && bar <= 9) push(arp, bar, [0, 2, 4, 6, 8, 10, 12, 14], 0.6, (k) => ch.arp[k % 4])
  }

  // Finale: the logo lands on beat 2, then the drums step away
  push(kick, 12, [0, 8], 0.9)
  push(clap, 12, [4, 12], 0.6)
  push(hat, 12, [0, 2, 4, 6, 8, 10, 12, 14], 0.3)
  push(open, 12, [4], 1)
  push(bass, 12, [0, 8], 0.8, () => C2)
  push(kick, 13, [0], 0.6)
  push(bass, 13, [0], 0.6, () => C2)

  const sort = (l: Hit[]) => l.sort((a, b) => a.t - b.t)
  return { kick: sort(kick), clap: sort(clap), hat: sort(hat), open: sort(open), bass: sort(bass), arp: sort(arp) }
}

/** Walks a sorted hit list alongside a rising clock; returns the latest hit. */
function follower(list: Hit[]) {
  let i = -1
  return (t: number): Hit | null => {
    while (i + 1 < list.length && list[i + 1].t <= t) i++
    return i < 0 ? null : list[i]
  }
}

/* ---------- small helpers ---------- */
const tri = (ph: number) => {
  let x = (ph / TAU) % 1
  if (x < 0) x += 1
  return 4 * Math.abs(x - 0.5) - 1
}
const swell = (t: number, s: number, a: number, hold: number, rel: number) => {
  if (t < s) return 0
  const x = t - s
  if (x < a) return x / a
  if (x < a + hold) return 1
  return Math.max(0, 1 - (x - a - hold) / rel)
}
const decay = (t: number, s: number, tau: number) => (t < s ? 0 : Math.exp(-(t - s) / tau))
const smooth = (t: number, s: number, d: number) => {
  if (t < s) return 0
  const x = (t - s) / d
  return x >= 1 ? 1 : x * x * (3 - 2 * x)
}
/** A soft detuned chord, before filtering. */
const chordRaw = (t: number, freqs: number[]) => {
  let v = 0
  for (const f of freqs) {
    const p = TAU * f * t
    v += tri(p) + 0.5 * tri(p * 1.006) + 0.5 * tri(p * 0.994)
  }
  return v / (freqs.length * 2)
}

export function renderCiniopsScore(sampleRate = 48000): {
  left: Float32Array<ArrayBuffer>
  right: Float32Array<ArrayBuffer>
  sampleRate: number
} {
  const N = Math.ceil(LENGTH * sampleRate)
  const left = new Float32Array(N)
  const right = new Float32Array(N)

  const hits = arrange()
  const lastKick = follower(hits.kick)
  const lastClap = follower(hits.clap)
  const lastHat = follower(hits.hat)
  const lastOpen = follower(hits.open)
  const lastBass = follower(hits.bass)
  const lastArp = follower(hits.arp)

  let tenseLp = 0 // filter memories
  let grooveLp = 0
  let riserLp = 0
  let prevNoise = 0
  let seed = 9123 // deterministic noise, so the WAV and the browser match
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x3fffffff - 1
  }

  for (let i = 0; i < N; i++) {
    const t = i / sampleRate
    const noise = rand()
    const bright = noise - prevNoise // first difference: a cheap high-pass, for hats
    prevNoise = noise
    let L = 0
    let R = 0

    /* --- drums --- */
    const k = lastKick(t)
    let duck = 1
    if (k) {
      const s = t - k.t
      if (s < 0.6) {
        // Pitch falls 155 → 45 Hz; phase is the integral of that sweep
        const ph = TAU * (45 * s + 110 * 0.03 * (1 - Math.exp(-s / 0.03)))
        const kv = Math.sin(ph) * Math.exp(-s / 0.22) * k.v * 0.95
        L += kv
        R += kv
      }
      duck = 1 - 0.45 * Math.exp(-s / 0.14) // the pad breathes with the kick
    }
    const c = lastClap(t)
    if (c) {
      const s = t - c.t
      if (s < 0.4) {
        const cv = (bright * 0.9 * Math.exp(-s / 0.07) + Math.sin(TAU * 190 * s) * 0.3 * Math.exp(-s / 0.04)) * c.v * 0.4
        L += cv * 0.95
        R += cv
      }
    }
    const h = lastHat(t)
    if (h) {
      const s = t - h.t
      if (s < 0.15) {
        const hv = bright * Math.exp(-s / 0.022) * h.v * 0.16
        L += hv * 0.8
        R += hv
      }
    }
    const o = lastOpen(t)
    if (o) {
      const s = t - o.t
      if (s < 0.8) {
        const ov = bright * Math.exp(-s / (o.v > 0.9 ? 0.6 : 0.13)) * o.v * 0.13
        L += ov
        R += ov * 0.85
      }
    }

    /* --- bass, following the chord root --- */
    const b = lastBass(t)
    if (b && b.f) {
      const s = t - b.t
      if (s < 1.2) {
        const env = Math.min(1, s / 0.005) * Math.exp(-s / 0.24)
        const raw = Math.sin(TAU * b.f * s) + 0.35 * Math.sin(TAU * b.f * 2 * s)
        const bv = Math.tanh(raw * 1.4) * env * b.v * 0.42
        L += bv
        R += bv
      }
    }

    /* --- arpeggio while the tiles flow --- */
    const a = lastArp(t)
    if (a && a.f) {
      const s = t - a.t
      if (s < 0.6) {
        const av = (Math.sin(TAU * a.f * s) + 0.3 * Math.sin(TAU * a.f * 2 * s)) * Math.exp(-s / 0.12) * a.v * 0.16
        const side = Math.round(a.t / (STEP * 2)) % 2 ? 1.15 : 0.85
        L += av * side
        R += av * (2 - side)
      }
    }

    /* --- tension: sub drone + A-minor pad, gone at the implosion --- */
    const tensionOff = 1 - smooth(t, IMPLODE, 0.15)
    const sub = Math.sin(TAU * A2 * t) * 0.45 * swell(t, 0.4, 2.5, 6, 1) * tensionOff
    L += sub
    R += sub
    const tenseEnv = swell(t, 0.6, 2.4, 6, 1) * tensionOff
    if (tenseEnv > 0) {
      tenseLp += (chordRaw(t, AM.pad) - tenseLp) * 0.2
      const tv = tenseLp * tenseEnv * 0.45
      L += tv * 0.95
      R += tv
    }
    for (const q of Q) {
      const e = decay(t, q, 0.5)
      if (e > 0.001) {
        const sv = (tri(TAU * E4 * t) + tri(TAU * A3 * t)) * 0.12 * e
        L += sv
        R += sv
      }
    }

    /* --- riser and the implosion --- */
    if (t > 6.4 && t < IMPLODE) {
      const r = smooth(t, 6.4, IMPLODE - 6.4)
      riserLp += (bright - riserLp) * (0.05 + r * 0.4)
      const rv = Math.sin(TAU * (200 + r * r * 700) * t) * 0.16 * r + riserLp * 0.5 * r
      L += rv
      R += rv * 0.92
    }
    if (t >= IMPLODE && t < IMPLODE + 1.5) {
      const s = t - IMPLODE
      const ph = TAU * (42 * s + 88 * 0.18 * (1 - Math.exp(-s / 0.18)))
      const boom = Math.sin(ph) * Math.exp(-s / 0.4) * 0.95 + noise * Math.exp(-s / 0.06) * 0.45
      L += boom
      R += boom
    }

    /* --- the groove pad: changes chord each bar, pumps with the kick --- */
    if (t >= DROP) {
      const bar = Math.floor(t / BAR)
      const since = t - bar * BAR
      const fadeIn = Math.min(1, since / 0.05)
      const fadeOut = bar > 4 ? Math.max(0, 1 - since / 0.12) : 0
      const raw = chordRaw(t, chordAt(bar).pad) * fadeIn + chordRaw(t, chordAt(bar - 1).pad) * fadeOut
      grooveLp += (raw - grooveLp) * 0.18
      const gv = grooveLp * 0.36 * duck * smooth(t, DROP, 0.4)
      L += gv
      R += gv * 0.96
    }

    /* --- whooshes as the tiles fly out --- */
    for (const tile of TILES) {
      const e = decay(t, tile, 0.12)
      if (e > 0.001) {
        const wv = noise * e * 0.25
        L += wv
        R += wv * 0.85
      }
    }

    /* --- the name: a full major chord and a shimmer --- */
    const finEnv = swell(t, LOGO - 0.05, 0.4, 2, 2.6)
    if (finEnv > 0) {
      const fv = chordRaw(t, [C4, E4, G4, C5]) * 0.45 * finEnv
      const sv = noise * decay(t, LOGO, 0.9) * 0.1
      L += fv + sv
      R += fv * 0.97 + sv
    }
    {
      const e = decay(t, TAGLINE, 0.8)
      if (e > 0.001) {
        const bv = (Math.sin(TAU * G5 * t) + 0.5 * Math.sin(TAU * C6 * t)) * 0.13 * e
        L += bv
        R += bv
      }
    }

    left[i] = L
    right[i] = R
  }

  /* ---------- master: gentle level, soft-clip, fades top and tail ---------- */
  const fadeIn = Math.round(0.04 * sampleRate)
  const fadeOut = Math.round(1.6 * sampleRate)
  for (let i = 0; i < N; i++) {
    let g = 0.78
    if (i < fadeIn) g *= i / fadeIn
    if (i > N - fadeOut) g *= Math.max(0, (N - i) / fadeOut)
    left[i] = Math.tanh(left[i] * g)
    right[i] = Math.tanh(right[i] * g)
  }

  return { left, right, sampleRate }
}
