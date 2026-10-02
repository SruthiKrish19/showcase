import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import type { Group } from 'three'
import { Dish, type DishKind } from './Dish'
import { StudioEnvironment } from './Lights'

const KINDS: DishKind[] = ['curry', 'biryani', 'grill']
const FIT: Record<DishKind, number> = { curry: 1.12, biryani: 1.08, grill: 0.82 }

/**
 * One canvas, all three dishes mounted; the active one scales up while the
 * others scale away. Avoids tearing down the WebGL context on every change
 * (slow, and it blanks the viewer while shaders recompile).
 */
function Turntable({ kind, spin, boost }: { kind: DishKind; spin: boolean; boost: boolean }) {
  const ref = useRef<Group>(null)
  const items = useRef<Record<DishKind, Group | null>>({ curry: null, biryani: null, grill: null })
  const scales = useRef<Record<DishKind, number>>({ curry: 0, biryani: 0, grill: 0 })
  const speed = useRef(0.35)
  const frames = useRef(0)

  useFrame((_, dt) => {
    frames.current++
    if (ref.current && spin) {
      const target = boost ? 2.6 : 0.35
      speed.current += (target - speed.current) * Math.min(1, dt * 3.5)
      ref.current.rotation.y += dt * speed.current
    }
    for (const k of KINDS) {
      const g = items.current[k]
      if (!g) continue
      const target = k === kind ? FIT[k] : 0
      const cur = scales.current[k]
      const next = spin ? cur + (target - cur) * Math.min(1, dt * 6) : target
      scales.current[k] = next
      const s = Math.max(0.0001, next)
      g.scale.setScalar(s)
      // Keep everything visible for the first frames so shaders compile up front.
      g.visible = frames.current < 3 || next > 0.01
    }
  })

  return (
    <group ref={ref} rotation={[0, -0.6, 0]}>
      {KINDS.map((k) => (
        <group key={k} ref={(el) => { items.current[k] = el }} scale={0.0001}>
          <Dish kind={k} />
        </group>
      ))}
    </group>
  )
}

type Props = { kind?: DishKind; /** True while a (simulated) finger drags the model. */ boost?: boolean }

/** Product-viewer presentation: a lit studio with the dish turning. */
export function StudioScene({ kind = 'curry', boost = false }: Props) {
  const reduced = useReducedMotion()

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.7, 3.4], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <StudioEnvironment />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[2.4, 4.5, 2.6]}
          intensity={1.8}
          color="#fff4e8"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0003}
          shadow-normalBias={0.02}
        />
        <Turntable kind={kind} spin={!reduced} boost={boost} />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={7} blur={2.2} far={2.2} color="#3a2a1a" />
      </Suspense>
    </Canvas>
  )
}
