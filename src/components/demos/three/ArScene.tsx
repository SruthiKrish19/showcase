import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, RoundedBox } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { Dish } from './Dish'
import { InteriorEnvironment } from './Lights'
import { makeQrTexture, makeWoodTexture } from './textures'

/** Handheld camera: slow drift, slight roll, and the micro-jitter of a hand. */
function HandheldCamera({ active }: { active: boolean }) {
  const { camera } = useThree()
  const t = useRef(0)
  useFrame((_, dt) => {
    if (!active) return
    t.current += dt
    const s = t.current
    const x = Math.sin(s * 0.3) * 0.7 + Math.sin(s * 6.1) * 0.008
    const y = 2.45 + Math.sin(s * 0.21) * 0.14 + Math.sin(s * 7.3) * 0.005
    const z = 4.3 + Math.cos(s * 0.26) * 0.22 + Math.cos(s * 5.7) * 0.006
    camera.position.set(x, y, z)
    camera.up.set(Math.sin(s * 0.37) * 0.02, 1, 0)
    camera.lookAt(0.05, 0.15, -0.15)
  })
  return null
}

function Table() {
  const tex = useMemo(() => makeWoodTexture(), [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial map={tex} roughness={0.62} metalness={0.02} />
    </mesh>
  )
}

function Glass({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.24, 0.2, 0.88, 56, 1, true]} />
        <meshPhysicalMaterial transmission={1} thickness={0.3} roughness={0.05} ior={1.5} color="#f2f8fa" transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 56]} />
        <meshPhysicalMaterial transmission={1} thickness={0.6} roughness={0.08} ior={1.5} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.215, 0.185, 0.6, 56]} />
        <meshPhysicalMaterial color="#d6eef5" transmission={0.95} thickness={0.7} roughness={0.1} ior={1.33} transparent />
      </mesh>
    </group>
  )
}

function Fork({ position }: { position: [number, number, number] }) {
  const steel = <meshStandardMaterial color="#d2d7dd" roughness={0.22} metalness={0.95} />
  return (
    <group position={position} rotation={[0, 0.28, 0]}>
      <RoundedBox args={[0.075, 0.022, 0.6]} radius={0.01} smoothness={3} castShadow receiveShadow position={[0, 0.02, 0.08]}>
        {steel}
      </RoundedBox>
      {[-0.03, -0.01, 0.01, 0.03].map((x) => (
        <mesh key={x} castShadow position={[x, 0.02, -0.3]}>
          <boxGeometry args={[0.012, 0.014, 0.18]} />
          {steel}
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.02, -0.2]}>
        <boxGeometry args={[0.09, 0.016, 0.06]} />
        {steel}
      </mesh>
    </group>
  )
}

function Napkin({ position }: { position: [number, number, number] }) {
  return (
    <RoundedBox args={[0.78, 0.035, 0.56]} radius={0.012} smoothness={3} castShadow receiveShadow position={position} rotation={[0, 0.28, 0]}>
      <meshStandardMaterial color="#f3eee5" roughness={0.95} />
    </RoundedBox>
  )
}

function QrStand({ position }: { position: [number, number, number] }) {
  const tex = useMemo(() => makeQrTexture(), [])
  return (
    <group position={position} rotation={[0, -0.35, 0]}>
      <mesh castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        <meshPhysicalMaterial color="#e9e4dc" roughness={0.3} clearcoat={0.6} transmission={0.4} thickness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.36, -0.03]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.5, 0.64, 0.015]} />
        <meshStandardMaterial map={tex} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** Dish scales in when placed, the way AR viewers pop an object onto a surface. */
function PlacedDish({ placed }: { placed: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const s = useRef(0)
  useFrame((_, dt) => {
    if (!ref.current) return
    const target = placed ? 0.82 : 0
    const k = placed ? 7 : 12
    s.current += (target - s.current) * Math.min(1, dt * k)
    const v = Math.max(0.0001, s.current)
    ref.current.scale.setScalar(v)
    ref.current.visible = v > 0.01
  })
  return (
    <group ref={ref} rotation={[0, 0.5, 0]}>
      <Dish kind="curry" />
      <ContactShadows position={[0, 0.004, 0]} opacity={0.6} scale={4.5} blur={1.8} far={1.4} color="#2a1608" />
    </group>
  )
}

export function ArScene({ placed }: { placed: boolean }) {
  const reduced = useReducedMotion()

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.45, 4.3], fov: 62 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog('#1a110b', 5, 15)
      }}
    >
      <Suspense fallback={null}>
        <InteriorEnvironment />
        <ambientLight intensity={0.3} color="#ffe0c0" />
        <directionalLight
          position={[1.6, 4.8, 1.8]}
          intensity={2.4}
          color="#ffdcb4"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0003}
          shadow-normalBias={0.02}
        />
        <pointLight position={[-2.6, 2.3, 1.4]} intensity={5} color="#ffb77a" distance={10} />

        <HandheldCamera active={!reduced} />
        <Table />
        <PlacedDish placed={placed} />
        <Glass position={[1.2, 0, 0.75]} />
        <Napkin position={[-1.4, 0.0, 0.5]} />
        <Fork position={[-1.35, 0.035, 0.47]} />
        <QrStand position={[1.2, 0, -1.3]} />
      </Suspense>
    </Canvas>
  )
}
