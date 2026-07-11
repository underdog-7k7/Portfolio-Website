import { useMemo } from 'react'
import { AdditiveBlending } from 'three'
import { Stars, Environment, Lightformer, ContactShadows, Sparkles, Billboard } from '@react-three/drei'
import { useAppStore } from '../store/useAppStore'
import { House } from './House'
import { Hallway } from './rooms/Hallway'
import { LivingRoom } from './rooms/LivingRoom'
import { Gallery } from './rooms/Gallery'
import { Kitchen } from './rooms/Kitchen'
import { Balcony } from './rooms/Balcony'
import { Workshop } from './rooms/Workshop'
import { DesktopControls } from '../controls/DesktopControls'
import { MobileControls } from '../controls/MobileControls'
import { CameraRig } from './CameraRig'
import { glowTexture } from './textures'

/**
 * The whole world: a cozy night scene. Lighting stays cheap on purpose —
 * static point lights, a tiny procedural environment map for material sheen,
 * and contact shadows baked exactly once (frames={1}). No shadow maps.
 */
export function Experience() {
  const started = useAppStore((s) => s.started)
  const isTouch = useAppStore((s) => s.isTouch)
  const glow = useMemo(() => glowTexture(), [])

  return (
    <>
      <color attach="background" args={['#0b1026']} />
      <Stars radius={70} depth={25} count={1800} factor={3.2} saturation={0} fade speed={0.5} />

      {/* moon + halo */}
      <Billboard position={[-48, 24, -20]}>
        <mesh>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial map={glow} color="#aebdf0" transparent opacity={0.5} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      </Billboard>
      <mesh position={[-48, 24, -20]}>
        <sphereGeometry args={[3.6, 24, 24]} />
        <meshBasicMaterial color="#f4f1e0" />
      </mesh>

      <ambientLight intensity={0.32} color="#cdd5e8" />
      <hemisphereLight args={['#39476b', '#4a3826', 0.45]} />

      {/* tiny procedural env-map: gives materials reflections & sheen, no HDR download */}
      <Environment resolution={64} frames={1} environmentIntensity={0.4}>
        <Lightformer intensity={1.6} color="#ffd9a8" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer intensity={0.7} color="#8fb4ff" position={[-6, 1.5, -6]} scale={[10, 3, 1]} />
        <Lightformer intensity={0.5} color="#ff9a5e" position={[6, 1.5, 6]} scale={[10, 3, 1]} />
      </Environment>

      {/* soft AO under furniture & along wall bases — rendered once, then free */}
      <ContactShadows position={[0, 0.02, 0]} scale={46} far={1.9} blur={2.4} opacity={0.42} resolution={512} frames={1} color="#1a120a" />

      <House />
      <Hallway />
      <LivingRoom />
      <Gallery />
      <Kitchen />
      <Balcony />
      <Workshop />

      {/* fireflies drifting over the balcony */}
      <Sparkles count={26} scale={[4, 2.2, 4.6]} position={[-13.2, 1.3, 4.5]} size={2.6} speed={0.32} color="#ffd98a" opacity={0.8} />

      <CameraRig />
      {started && (isTouch ? <MobileControls /> : <DesktopControls />)}
    </>
  )
}
