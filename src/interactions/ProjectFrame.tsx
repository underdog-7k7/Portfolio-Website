import { Text, useTexture } from '@react-three/drei'
import { Interactable } from './Interactable'

export interface ProjectData {
  id: string
  title: string
  subtitle: string
  category: string
  date: string
  description: string
  tech: string[]
  /** absent for proprietary client/employer work */
  github?: string
  extraLinks?: { label: string; url: string }[]
  image: string
  /** deployed URL — shows a LIVE badge + demo button on ANIMESH·TV */
  live?: string
  /** client/employer work that can't be open-sourced */
  proprietary?: boolean
}

interface Props {
  project: ProjectData
  /** wall-mount position (centre of the artwork) */
  position: [number, number, number]
  rotationY?: number
}

/**
 * A picture frame on the gallery wall. The artwork is the project's real
 * screenshot; walking up to it (or tapping it) opens the project panel.
 */
export function ProjectFrame({ project, position, rotationY = 0 }: Props) {
  const texture = useTexture(import.meta.env.BASE_URL + project.image)
  return (
    <Interactable
      id={`project-${project.id}`}
      position={[position[0], 0, position[2]]}
      radius={2.6}
      label={project.title}
      overlay={{ kind: 'project', projectId: project.id }}
      markerY={0}
      room="gallery"
    >
      <group position={[0, position[1], 0]} rotation-y={rotationY}>
        {/* frame */}
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[2.35, 1.65, 0.07]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.5} />
        </mesh>
        {/* artwork */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[2.15, 1.45]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        {/* little picture light above the frame */}
        <mesh position={[0, 0.95, 0.08]} rotation-x={0.6}>
          <cylinderGeometry args={[0.03, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#c8a248" metalness={0.6} />
        </mesh>
        {/* museum label */}
        <Text
          position={[0, -1.02, 0.02]}
          fontSize={0.13}
          color="#f5ecd9"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
        >
          {project.title} — {project.subtitle}
        </Text>
        <Text position={[0, -1.22, 0.02]} fontSize={0.085} color="#bfae90" anchorX="center" anchorY="middle">
          {project.category}
        </Text>
      </group>
    </Interactable>
  )
}
