import { useLayoutEffect, useMemo, useRef } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { rng } from './textures'

export type DishKind = 'curry' | 'biryani' | 'grill'

/**
 * Three plated dishes built from real geometry with physically-based
 * materials: a lathe-turned bowl of glossy curry, a plate of individually
 * instanced rice grains, and a cast-iron sizzler of charred tikka.
 */
export function Dish({ kind = 'curry' as DishKind }) {
  if (kind === 'biryani') return <Biryani />
  if (kind === 'grill') return <Grill />
  return <Curry />
}

/* ---------- shared bits ---------- */

const CERAMIC = { roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12 }

/** A flattened dome with gentle lumps, UV-free: used for sauces and mounds. */
function useLumpyDome(radius: number, height: number, amp: number, seed: number) {
  return useMemo(() => {
    const geo = new THREE.SphereGeometry(radius, 72, 36, 0, Math.PI * 2, 0, Math.PI / 2)
    const p = geo.attributes.position as THREE.BufferAttribute
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const n =
        Math.sin(v.x * 7.1 + seed) * Math.sin(v.z * 6.3 - seed) * 0.55 +
        Math.sin(v.x * 13.7 - v.z * 11.2 + seed * 2) * 0.3 +
        Math.cos(v.x * 21 + v.z * 17) * 0.15
      const yScale = height / radius
      const edge = THREE.MathUtils.smoothstep(v.y / radius, 0.02, 0.35) // keep the rim flat
      p.setXYZ(i, v.x, v.y * yScale + n * amp * edge, v.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [radius, height, amp, seed])
}

function Plate({ color = '#f3f1ee', radius = 1.1 }: { color?: string; radius?: number }) {
  const profile = useMemo(() => {
    const pts: THREE.Vector2[] = []
    // Plate cross-section: flat well, gentle rise, rolled rim, underside
    const r = radius
    pts.push(new THREE.Vector2(0, 0.0))
    pts.push(new THREE.Vector2(r * 0.62, 0.0))
    pts.push(new THREE.Vector2(r * 0.78, 0.04))
    pts.push(new THREE.Vector2(r * 0.95, 0.1))
    pts.push(new THREE.Vector2(r, 0.13))
    pts.push(new THREE.Vector2(r * 0.99, 0.1))
    pts.push(new THREE.Vector2(r * 0.93, 0.075))
    pts.push(new THREE.Vector2(r * 0.76, 0.03))
    pts.push(new THREE.Vector2(r * 0.6, 0.0))
    pts.push(new THREE.Vector2(r * 0.55, -0.03))
    pts.push(new THREE.Vector2(0, -0.03))
    return pts
  }, [radius])
  return (
    <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
      <latheGeometry args={[profile, 96]} />
      <meshPhysicalMaterial color={color} {...CERAMIC} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Bowl({ color = '#f4f2ef' }: { color?: string }) {
  const profile = useMemo(
    () => [
      [0, 0], [0.5, 0], [0.7, 0.03], [0.86, 0.16], [0.97, 0.34], [1.02, 0.46], [1.05, 0.5],
      [0.98, 0.5], [0.92, 0.42], [0.82, 0.25], [0.66, 0.12], [0.46, 0.08], [0, 0.08],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  )
  return (
    <mesh castShadow receiveShadow position={[0, 0.01, 0]}>
      <latheGeometry args={[profile, 96]} />
      <meshPhysicalMaterial color={color} {...CERAMIC} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Leaf({ position, rotation, color = '#4f9a2e', size = 0.09 }: { position: [number, number, number]; rotation: [number, number, number]; color?: string; size?: number }) {
  return (
    <mesh castShadow position={position} rotation={rotation} scale={[1, 1, 0.45]}>
      <circleGeometry args={[size, 14]} />
      <meshStandardMaterial color={color} roughness={0.55} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ---------- Curry: paneer tikka masala in a bowl ---------- */

function Curry() {
  const sauce = useLumpyDome(0.84, 0.3, 0.035, 3)
  const items = useMemo(() => {
    const r = rng(11)
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + r() * 0.6
      const rad = 0.18 + r() * 0.42
      return {
        pos: [Math.cos(a) * rad, 0.3 + r() * 0.05, Math.sin(a) * rad] as [number, number, number],
        rot: [r() * 0.5, r() * Math.PI, r() * 0.4] as [number, number, number],
        s: 0.19 + r() * 0.07,
        tone: i % 3 === 0 ? '#c99a52' : '#e7c98c',
      }
    })
  }, [])
  const leaves = useMemo(() => {
    const r = rng(5)
    return Array.from({ length: 7 }, () => ({
      pos: [(r() - 0.5) * 1.1, 0.37 + r() * 0.06, (r() - 0.5) * 1.1] as [number, number, number],
      rot: [Math.PI / 2 - r() * 0.9, r() * Math.PI, r()] as [number, number, number],
    }))
  }, [])

  return (
    <group>
      <Bowl />
      {/* Sauce surface */}
      <mesh geometry={sauce} castShadow receiveShadow position={[0, 0.09, 0]}>
        <meshPhysicalMaterial color="#c6481c" roughness={0.3} clearcoat={0.55} clearcoatRoughness={0.25} sheen={0.4} sheenColor="#ff9f5a" />
      </mesh>
      {/* Cream swirl */}
      <mesh position={[0.02, 0.37, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.5]}>
        <torusGeometry args={[0.32, 0.028, 10, 60, Math.PI * 1.65]} />
        <meshPhysicalMaterial color="#fff5e6" roughness={0.35} clearcoat={0.4} />
      </mesh>
      <mesh position={[-0.05, 0.375, -0.03]} rotation={[Math.PI / 2, 0, 1.2]} scale={[1, 1, 0.5]}>
        <torusGeometry args={[0.16, 0.022, 10, 40, Math.PI * 1.3]} />
        <meshPhysicalMaterial color="#fff5e6" roughness={0.35} clearcoat={0.4} />
      </mesh>
      {/* Paneer */}
      {items.map((t, i) => (
        <RoundedBox key={i} args={[t.s, t.s * 0.8, t.s]} radius={t.s * 0.18} smoothness={4} castShadow receiveShadow position={t.pos} rotation={t.rot}>
          <meshStandardMaterial color={t.tone} roughness={0.6} />
        </RoundedBox>
      ))}
      {leaves.map((l, i) => (
        <Leaf key={i} position={l.pos} rotation={l.rot} size={0.075} />
      ))}
    </group>
  )
}

/* ---------- Biryani: instanced rice on a plate ---------- */

const RICE_COUNT = 1100
const RICE_TONES = ['#f4ecdc', '#f6efe1', '#efe3c9', '#f1c24d', '#e9a93c', '#d88a2f', '#fbf5e9']

function Biryani() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const chunks = useMemo(() => {
    const r = rng(21)
    return Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + 0.4
      return {
        pos: [Math.cos(a) * 0.36, 0.3 + r() * 0.05, Math.sin(a) * 0.36] as [number, number, number],
        rot: [r(), r() * Math.PI, r() * 0.5] as [number, number, number],
        s: 0.2 + r() * 0.08,
      }
    })
  }, [])

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    const r = rng(42)
    const o = new THREE.Object3D()
    const color = new THREE.Color()
    for (let i = 0; i < RICE_COUNT; i++) {
      const u = r()
      const rad = 0.82 * Math.sqrt(u)
      const a = r() * Math.PI * 2
      const h = 0.5 * (1 - (rad / 0.82) ** 2)
      const y = 0.12 + h + (r() - 0.5) * 0.05
      o.position.set(Math.cos(a) * rad, y, Math.sin(a) * rad)
      o.rotation.set(r() * Math.PI, r() * Math.PI, r() * Math.PI)
      const s = 0.8 + r() * 0.5
      o.scale.set(s, s, s)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      const t = r()
      color.set(RICE_TONES[t < 0.62 ? (i % 3) : t < 0.8 ? 6 : t < 0.92 ? 3 : t < 0.97 ? 4 : 5])
      m.setColorAt(i, color)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [])

  return (
    <group>
      <Plate />
      {/* Base mound under the grains so no plate shows through */}
      <mesh position={[0, 0.1, 0]} scale={[1, 0.55, 1]} receiveShadow>
        <sphereGeometry args={[0.8, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e8d9b4" roughness={0.9} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, RICE_COUNT]} castShadow receiveShadow>
        <capsuleGeometry args={[0.016, 0.055, 3, 8]} />
        <meshStandardMaterial roughness={0.75} />
      </instancedMesh>
      {chunks.map((c, i) => (
        <RoundedBox key={i} args={[c.s * 1.2, c.s * 0.9, c.s]} radius={c.s * 0.25} smoothness={4} castShadow position={c.pos} rotation={c.rot}>
          <meshStandardMaterial color="#5c2e12" roughness={0.55} />
        </RoundedBox>
      ))}
      {/* Fried onion */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.3) * 0.3, 0.6 - i * 0.02, Math.sin(i * 1.3) * 0.3]} rotation={[Math.PI / 2 + i * 0.3, i, 0]} castShadow>
          <torusGeometry args={[0.06, 0.012, 6, 14, Math.PI * 1.4]} />
          <meshStandardMaterial color="#8a4a1c" roughness={0.6} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <Leaf key={i} position={[Math.cos(i * 2.1 + 1) * 0.42, 0.56, Math.sin(i * 2.1 + 1) * 0.42]} rotation={[Math.PI / 2.6, i * 1.5, 0]} color="#3f8f33" size={0.1} />
      ))}
      {/* Lemon wedge */}
      <mesh position={[0.72, 0.17, 0.5]} rotation={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 18, 1, false, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#f5d44a" roughness={0.45} clearcoat={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ---------- Grill: paneer tikka on a cast-iron sizzler ---------- */

function Grill() {
  const cubes = useMemo(() => {
    const r = rng(77)
    return Array.from({ length: 8 }, (_, i) => ({
      pos: [-0.75 + (i % 4) * 0.5 + (r() - 0.5) * 0.08, 0.26, (i < 4 ? -0.22 : 0.22) + (r() - 0.5) * 0.08] as [number, number, number],
      rot: [r() * 0.4, r() * Math.PI, r() * 0.3] as [number, number, number],
      s: 0.3 + r() * 0.06,
      tone: ['#c7421d', '#b33718', '#d2552a', '#a93316'][i % 4],
    }))
  }, [])
  return (
    <group>
      {/* Wooden board */}
      <RoundedBox args={[3.1, 0.12, 2.0]} radius={0.05} smoothness={3} castShadow receiveShadow position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#8a5a33" roughness={0.85} />
      </RoundedBox>
      {/* Sizzler plate */}
      <mesh castShadow receiveShadow position={[0, 0.17, 0]} scale={[1.35, 1, 0.85]}>
        <cylinderGeometry args={[1, 0.96, 0.1, 64]} />
        <meshStandardMaterial color="#1c1a19" roughness={0.78} metalness={0.45} />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 0.85, 1]}>
        <torusGeometry args={[1, 0.045, 12, 80]} />
        <meshStandardMaterial color="#232120" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Onion bed */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[-0.9 + i * 0.2, 0.24, Math.sin(i * 1.7) * 0.3]} rotation={[Math.PI / 2 + Math.sin(i) * 0.4, i * 0.7, 0]} castShadow>
          <torusGeometry args={[0.13, 0.016, 8, 24, Math.PI * (0.8 + (i % 3) * 0.3)]} />
          <meshStandardMaterial color={i % 2 ? '#dbb5e3' : '#f1e3f3'} roughness={0.5} />
        </mesh>
      ))}
      {/* Tikka */}
      {cubes.map((c, i) => (
        <RoundedBox key={i} args={[c.s, c.s * 0.85, c.s]} radius={c.s * 0.2} smoothness={4} castShadow receiveShadow position={c.pos} rotation={c.rot}>
          <meshPhysicalMaterial color={c.tone} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.4} />
        </RoundedBox>
      ))}
      {/* Capsicum */}
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} args={[0.22, 0.12, 0.22]} radius={0.04} smoothness={3} castShadow position={[-0.5 + i * 0.5, 0.42, i % 2 ? -0.3 : 0.3]} rotation={[0.3, i, 0.2]}>
          <meshPhysicalMaterial color="#3c8a34" roughness={0.4} clearcoat={0.6} />
        </RoundedBox>
      ))}
      <Leaf position={[0.3, 0.46, 0.05]} rotation={[Math.PI / 2.3, 0.5, 0]} size={0.1} />
      <Leaf position={[-0.4, 0.44, -0.1]} rotation={[Math.PI / 2.5, 2.2, 0]} size={0.085} />
      {/* Lemon */}
      <mesh position={[1.15, 0.3, 0.35]} rotation={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 18, 1, false, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#f3d24c" roughness={0.45} clearcoat={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
