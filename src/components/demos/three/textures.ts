import * as THREE from 'three'

/** Deterministic pseudo-random, so scenes never reshuffle between renders. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

/** Procedural oak, drawn into a canvas at runtime — no texture file to fetch. */
export function makeWoodTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 1024
  const g = c.getContext('2d')!
  const r = rng(7)

  g.fillStyle = '#7a5637'
  g.fillRect(0, 0, 1024, 1024)

  // Broad tonal variation between planks
  for (let p = 0; p < 5; p++) {
    g.fillStyle = `rgba(${40 + r() * 40},${20 + r() * 20},${8 + r() * 10},${0.12 + r() * 0.12})`
    g.fillRect(0, (p / 5) * 1024, 1024, 1024 / 5)
  }

  // Fine grain
  for (let i = 0; i < 5200; i++) {
    const y = r() * 1024
    const w = 80 + r() * 520
    const x = r() * 1024 - 100
    const a = 0.04 + r() * 0.2
    g.strokeStyle = r() > 0.45 ? `rgba(38,22,10,${a})` : `rgba(170,126,86,${a})`
    g.lineWidth = 0.5 + r() * 2.2
    g.beginPath()
    g.moveTo(x, y)
    g.bezierCurveTo(x + w * 0.3, y - 4 + r() * 8, x + w * 0.6, y + 4 - r() * 8, x + w, y + (r() - 0.5) * 6)
    g.stroke()
  }

  // Knots
  for (let k = 0; k < 4; k++) {
    const x = r() * 1024
    const y = r() * 1024
    for (let ring = 7; ring > 0; ring--) {
      g.strokeStyle = `rgba(40,22,10,${0.08 + ring * 0.03})`
      g.lineWidth = 1.2
      g.beginPath()
      g.ellipse(x, y, ring * 6, ring * 3.4, 0.3, 0, Math.PI * 2)
      g.stroke()
    }
  }

  // Plank seams
  for (let p = 1; p < 5; p++) {
    const y = (p / 5) * 1024
    g.fillStyle = 'rgba(18,9,3,0.7)'
    g.fillRect(0, y - 2, 1024, 4)
    g.fillStyle = 'rgba(200,160,120,0.12)'
    g.fillRect(0, y + 2, 1024, 2)
  }

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2.2, 2.2)
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** A QR code lookalike for the table stand. */
export function makeQrTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 320
  const g = c.getContext('2d')!
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, 256, 320)

  const r = rng(99)
  const cell = 8
  const n = 21
  const ox = (256 - n * cell) / 2
  const oy = 28
  g.fillStyle = '#111111'
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const finder = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
      if (finder) continue
      if (r() > 0.52) g.fillRect(ox + x * cell, oy + y * cell, cell, cell)
    }
  }
  const finderAt = (fx: number, fy: number) => {
    g.fillStyle = '#111'
    g.fillRect(ox + fx * cell, oy + fy * cell, 7 * cell, 7 * cell)
    g.fillStyle = '#fff'
    g.fillRect(ox + (fx + 1) * cell, oy + (fy + 1) * cell, 5 * cell, 5 * cell)
    g.fillStyle = '#111'
    g.fillRect(ox + (fx + 2) * cell, oy + (fy + 2) * cell, 3 * cell, 3 * cell)
  }
  finderAt(0, 0)
  finderAt(n - 7, 0)
  finderAt(0, n - 7)

  g.fillStyle = '#333'
  g.font = 'bold 15px Helvetica, Arial, sans-serif'
  g.textAlign = 'center'
  g.fillText('SCAN TO SEE THE MENU', 128, 240)
  g.font = '12px Helvetica, Arial, sans-serif'
  g.fillStyle = '#777'
  g.fillText('in 3D · on your table', 128, 262)
  g.fillText('The Copper Pot · Table 14', 128, 300)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}
