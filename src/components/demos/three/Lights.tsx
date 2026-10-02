import { Environment, Lightformer } from '@react-three/drei'

/**
 * Image-based lighting built from light panels rather than an HDRI file, so
 * nothing is fetched. This is what gives ceramic, glass and sauce their
 * reflections — without an environment they read as matte plastic.
 */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      {/* Overhead softbox */}
      <Lightformer form="rect" intensity={5} position={[0, 5, 1]} scale={[7, 5, 1]} target={[0, 0, 0]} color="#fff6ec" />
      {/* Cool fill, camera left */}
      <Lightformer form="rect" intensity={1.6} position={[-6, 2.5, 3]} scale={[4, 3, 1]} target={[0, 0, 0]} color="#dbe8ff" />
      {/* Warm kick, camera right / behind */}
      <Lightformer form="rect" intensity={2.4} position={[5, 2, -3]} scale={[3, 2.5, 1]} target={[0, 0, 0]} color="#ffe1bf" />
      {/* Horizon strip for the plate rim highlight */}
      <Lightformer form="ring" intensity={1.2} position={[0, 1.2, -7]} scale={4} target={[0, 0.5, 0]} color="#ffffff" />
    </Environment>
  )
}

/** Restaurant interior: warm pendant above, a cooler window to one side. */
export function InteriorEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="circle" intensity={6} position={[0.8, 4.5, 0.5]} scale={2.2} target={[0, 0, 0]} color="#ffd8a8" />
      <Lightformer form="rect" intensity={1.4} position={[-7, 2.5, 1]} scale={[5, 4, 1]} target={[0, 0.3, 0]} color="#cfe0ff" />
      <Lightformer form="rect" intensity={0.8} position={[5, 1.5, -5]} scale={[4, 2, 1]} target={[0, 0.3, 0]} color="#ffb88a" />
    </Environment>
  )
}
