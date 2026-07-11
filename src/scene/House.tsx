import { useMemo } from 'react'
import { AdditiveBlending } from 'three'
import { walls, railings, WALL_H, WALL_T, DOOR_H } from './houseLayout'
import {
  woodFloorTexture,
  plasterTexture,
  tileTexture,
  deckTexture,
  roundRugTexture,
  runnerRugTexture,
  glowTexture,
} from './textures'

const TRIM_DARK = '#5b4632'
const BASEBOARD = '#b7a37f'
const CROWN = '#ded2ba'

/** trim posts + header around a doorway opening */
function DoorFrame({ center, width, alongZ }: { center: [number, number]; width: number; alongZ: boolean }) {
  const post: [number, number, number] = alongZ ? [WALL_T + 0.08, DOOR_H + 0.04, 0.12] : [0.12, DOOR_H + 0.04, WALL_T + 0.08]
  const header: [number, number, number] = alongZ
    ? [WALL_T + 0.08, 0.14, width + 0.24]
    : [width + 0.24, 0.14, WALL_T + 0.08]
  const off = width / 2 + 0.06
  return (
    <group position={[center[0], 0, center[1]]}>
      <mesh position={alongZ ? [0, (DOOR_H + 0.04) / 2, -off] : [-off, (DOOR_H + 0.04) / 2, 0]}>
        <boxGeometry args={post} />
        <meshStandardMaterial color={TRIM_DARK} roughness={0.6} />
      </mesh>
      <mesh position={alongZ ? [0, (DOOR_H + 0.04) / 2, off] : [off, (DOOR_H + 0.04) / 2, 0]}>
        <boxGeometry args={post} />
        <meshStandardMaterial color={TRIM_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0, DOOR_H + 0.06, 0]}>
        <boxGeometry args={header} />
        <meshStandardMaterial color={TRIM_DARK} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** fake night window: dark glass, mullions, moon-glow halo — no wall holes needed */
function HouseWindow({
  position,
  rotationY,
  w = 1.5,
  h = 1.3,
}: {
  position: [number, number, number]
  rotationY: number
  w?: number
  h?: number
}) {
  const glow = useMemo(() => glowTexture(), [])
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[w + 0.14, h + 0.14, 0.06]} />
        <meshStandardMaterial color={TRIM_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#0e1b38" emissive="#2a4170" emissiveIntensity={0.55} roughness={0.15} metalness={0.4} />
      </mesh>
      {/* mullions */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[0.045, h, 0.015]} />
        <meshStandardMaterial color={TRIM_DARK} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[w, 0.045, 0.015]} />
        <meshStandardMaterial color={TRIM_DARK} />
      </mesh>
      {/* sill */}
      <mesh position={[0, -h / 2 - 0.09, 0.03]}>
        <boxGeometry args={[w + 0.24, 0.07, 0.16]} />
        <meshStandardMaterial color={TRIM_DARK} roughness={0.6} />
      </mesh>
      {/* moonlight halo bleeding into the room */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[w * 1.9, h * 1.9]} />
        <meshBasicMaterial map={glow} color="#8fb0ff" transparent opacity={0.32} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Curtains({ position, rotationY, span }: { position: [number, number, number]; rotationY: number; span: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 1.02, 0.08]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.022, 0.022, span + 0.9, 8]} />
        <meshStandardMaterial color="#8a6d2f" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (span / 2 + 0.24), -0.1, 0.08]}>
          <boxGeometry args={[0.34, 2.15, 0.14]} />
          <meshStandardMaterial color="#6d3327" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Procedural house shell: textured floors and walls, trim, doorway frames,
 * night windows. Still 100% primitives — zero asset downloads.
 */
export function House() {
  const tex = useMemo(() => {
    const wood = woodFloorTexture()
    wood.repeat.set(9, 7.5)
    const plaster = plasterTexture()
    plaster.repeat.set(2.5, 1.2)
    const tile = tileTexture()
    tile.repeat.set(10.8, 4.3)
    const deck = deckTexture()
    deck.repeat.set(2.2, 2.5)
    return { wood, plaster, tile, deck, runner: runnerRugTexture(), round: roundRugTexture() }
  }, [])

  return (
    <group>
      {/* interior wood floor */}
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[22.5, 0.16, 18.5]} />
        <meshStandardMaterial map={tex.wood} color="#d8c2ae" roughness={0.7} />
      </mesh>
      {/* kitchen tile inlay */}
      <mesh position={[0, 0.005, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[21.6, 8.6]} />
        <meshStandardMaterial map={tex.tile} roughness={0.5} />
      </mesh>
      {/* hallway runner rug */}
      <mesh position={[0, 0.012, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 7]} />
        <meshStandardMaterial map={tex.runner} roughness={1} />
      </mesh>
      {/* living-room rug */}
      <mesh position={[-7.5, 0.012, 5.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 40]} />
        <meshStandardMaterial map={tex.round} roughness={1} />
      </mesh>
      {/* gallery rug */}
      <mesh position={[6.5, 0.012, 3.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#4b3a52" roughness={1} />
      </mesh>
      {/* balcony deck */}
      <mesh position={[-13.25, -0.08, 4.5]}>
        <boxGeometry args={[4.5, 0.16, 5]} />
        <meshStandardMaterial map={tex.deck} roughness={0.85} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, WALL_H + 0.05, 0]}>
        <boxGeometry args={[22.5, 0.1, 18.5]} />
        <meshStandardMaterial color="#d8cdb8" roughness={1} />
      </mesh>

      {/* walls + doorway lintels, with baseboard & crown trim */}
      {walls.map((w, i) => (
        <group key={i}>
          <mesh position={w.pos}>
            <boxGeometry args={w.size} />
            <meshStandardMaterial map={tex.plaster} roughness={0.95} />
          </mesh>
          {w.collider && (
            <>
              <mesh position={[w.pos[0], 0.09, w.pos[2]]}>
                <boxGeometry args={[w.size[0] + 0.05, 0.18, w.size[2] + 0.05]} />
                <meshStandardMaterial color={BASEBOARD} roughness={0.8} />
              </mesh>
              <mesh position={[w.pos[0], WALL_H - 0.07, w.pos[2]]}>
                <boxGeometry args={[w.size[0] + 0.04, 0.14, w.size[2] + 0.04]} />
                <meshStandardMaterial color={CROWN} roughness={0.9} />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* doorway trim */}
      <DoorFrame center={[-11, 4.5]} width={2} alongZ />
      <DoorFrame center={[-2.5, 4.75]} width={2.5} alongZ />
      <DoorFrame center={[2.5, 4.75]} width={2.5} alongZ />
      <DoorFrame center={[0, 0]} width={2.8} alongZ={false} />
      <DoorFrame center={[-6, -6.3]} width={2.2} alongZ />

      {/* night windows */}
      <HouseWindow position={[-10.86, 1.75, 6.9]} rotationY={Math.PI / 2} />
      <Curtains position={[-10.8, 1.75, 6.9]} rotationY={Math.PI / 2} span={1.5} />
      <HouseWindow position={[-4.8, 1.9, -8.86]} rotationY={0} w={1.7} h={1.2} />
      <HouseWindow position={[10.86, 1.75, 7.8]} rotationY={-Math.PI / 2} w={1.3} h={1.3} />
      {[-1.1, 1.1].map((x) => (
        <HouseWindow key={x} position={[x, 1.5, 8.86]} rotationY={Math.PI} w={0.5} h={1.9} />
      ))}

      {/* balcony railings with post caps */}
      {railings.map((w, i) => (
        <group key={i}>
          <mesh position={w.pos}>
            <boxGeometry args={w.size} />
            <meshStandardMaterial color="#c9b896" roughness={0.8} />
          </mesh>
          <mesh position={[w.pos[0], 1.1, w.pos[2]]}>
            <boxGeometry args={[w.size[0] > 1 ? w.size[0] + 0.08 : 0.2, 0.06, w.size[2] > 1 ? w.size[2] + 0.08 : 0.2]} />
            <meshStandardMaterial color="#a89272" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* front-door decor on the south wall behind the spawn point */}
      <group position={[0, 0, 8.84]}>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[1.4, 2.2, 0.1]} />
          <meshStandardMaterial color="#5b3a24" roughness={0.65} />
        </mesh>
        {/* door panels */}
        {[0.55, 1.55].map((y) => (
          <mesh key={y} position={[0, y, 0.055]}>
            <boxGeometry args={[1.1, 0.8, 0.02]} />
            <meshStandardMaterial color="#4e3120" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0.5, 1.1, -0.08]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    </group>
  )
}
