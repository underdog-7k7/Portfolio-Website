import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import type { MeshBasicMaterial } from 'three'
import projectsData from '../../data/projects.json'

/**
 * Big wall-mounted "ANIMESH·TV". Even before you interact, the screen slowly
 * channel-surfs through project screenshots (textures are already cached for
 * the frames, so this costs nothing extra). Interacting zooms in and opens
 * the fullscreen carousel.
 */
export function TV({ position }: { position: [number, number, number] }) {
  const projects = projectsData.projects
  const textures = useTexture(projects.map((p) => import.meta.env.BASE_URL + p.image))
  const mat = useRef<MeshBasicMaterial>(null)
  const shown = useRef(0)

  useFrame(({ clock }) => {
    const i = Math.floor(clock.elapsedTime / 3.5) % textures.length
    if (i !== shown.current && mat.current) {
      shown.current = i
      mat.current.map = textures[i]
      mat.current.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* ambient backlight glow */}
      <mesh position={[0, 1.75, -0.02]}>
        <planeGeometry args={[3.9, 2.5]} />
        <meshBasicMaterial color="#ffb454" transparent opacity={0.1} />
      </mesh>
      {/* panel */}
      <mesh position={[0, 1.75, 0.05]}>
        <boxGeometry args={[3.5, 2.1, 0.09]} />
        <meshStandardMaterial color="#14181d" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* screen — channel-surfs through the projects */}
      <mesh position={[0, 1.75, 0.1]}>
        <planeGeometry args={[3.3, 1.9]} />
        <meshBasicMaterial ref={mat} map={textures[0]} toneMapped={false} />
      </mesh>
      {/* power LED */}
      <mesh position={[1.55, 0.78, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#e74c3c" emissive="#ff3b2e" emissiveIntensity={2} />
      </mesh>
      <Text position={[0, 0.58, 0.11]} fontSize={0.12} color="#8d9aa8" anchorX="center">
        ANIMESH·TV — CH 07 · PROJECTS
      </Text>

      {/* media console below */}
      <group position={[0, 0, 0.28]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[3.0, 0.44, 0.45]} />
          <meshStandardMaterial color="#4a3524" roughness={0.6} />
        </mesh>
        {[-1.35, 1.35].map((x) => (
          <mesh key={x} position={[x, 0.04, 0]}>
            <boxGeometry args={[0.08, 0.1, 0.4]} />
            <meshStandardMaterial color="#3a2a1c" />
          </mesh>
        ))}
        {/* game console + controller for character */}
        <mesh position={[-0.9, 0.55, 0.05]}>
          <boxGeometry args={[0.45, 0.09, 0.28]} />
          <meshStandardMaterial color="#22303e" roughness={0.4} />
        </mesh>
        <mesh position={[0.85, 0.54, 0.08]} rotation-y={0.5}>
          <boxGeometry args={[0.18, 0.05, 0.12]} />
          <meshStandardMaterial color="#e8e8e6" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}
