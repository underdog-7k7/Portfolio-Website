import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { codeScreenTexture, wallArtTexture } from '../textures'

/**
 * Procedural low-poly furniture. Every prop is built from primitives so the
 * house works with zero model downloads. Swap any of these for a GLB via
 * <GltfProp url="models/xxx.glb" /> without touching the rest of the scene.
 */

type XYZ = [number, number, number]

export function Sofa({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.4, 0.45, 1.0]} />
        <meshStandardMaterial color="#b3592f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0.42]}>
        <boxGeometry args={[2.4, 0.75, 0.22]} />
        <meshStandardMaterial color="#a34f28" roughness={0.9} />
      </mesh>
      {[-1.28, 1.28].map((x) => (
        <mesh key={x} position={[x, 0.48, 0]}>
          <boxGeometry args={[0.22, 0.65, 1.0]} />
          <meshStandardMaterial color="#a34f28" roughness={0.9} />
        </mesh>
      ))}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.62, 0.18]}>
          <boxGeometry args={[0.85, 0.28, 0.6]} />
          <meshStandardMaterial color="#c96a3d" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export function CoffeeTable({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.25, 0.06, 0.6]} />
        <meshStandardMaterial color="#4a3524" roughness={0.6} />
      </mesh>
      {([[-0.55, -0.22], [0.55, -0.22], [-0.55, 0.22], [0.55, 0.22]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <boxGeometry args={[0.07, 0.4, 0.07]} />
          <meshStandardMaterial color="#3a2a1c" />
        </mesh>
      ))}
      <mesh position={[0.3, 0.48, 0]} rotation-y={0.4}>
        <boxGeometry args={[0.28, 0.04, 0.2]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
    </group>
  )
}

export function Bookshelf({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  const bookColors = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#16a085', '#d35400']
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 2.2, 2.1]} />
        <meshStandardMaterial color="#5a4130" roughness={0.8} />
      </mesh>
      {[0.45, 1.05, 1.65].map((y) => (
        <group key={y}>
          {bookColors.map((c, i) => (
            <mesh key={i} position={[0.18, y, -0.85 + i * 0.28]}>
              <boxGeometry args={[0.16, 0.34 + (i % 3) * 0.04, 0.09]} />
              <meshStandardMaterial color={c} roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export function Workstation({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[2.3, 0.06, 0.85]} />
        <meshStandardMaterial color="#4a3524" roughness={0.6} />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]}>
          <boxGeometry args={[0.08, 0.72, 0.8]} />
          <meshStandardMaterial color="#3a2a1c" />
        </mesh>
      ))}
      {/* big screen with code on it */}
      <mesh position={[0, 1.25, -0.18]}>
        <boxGeometry args={[1.5, 0.85, 0.06]} />
        <meshStandardMaterial color="#1a2230" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.25, -0.145]}>
        <planeGeometry args={[1.4, 0.76]} />
        <meshBasicMaterial map={useMemo(() => codeScreenTexture(), [])} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.78, -0.1]}>
        <boxGeometry args={[0.5, 0.05, 0.25]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

export function Cabinet({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.7, 1.1, 0.55]} />
        <meshStandardMaterial color="#7a6248" roughness={0.8} />
      </mesh>
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.29]}>
          <boxGeometry args={[0.72, 0.9, 0.03]} />
          <meshStandardMaterial color="#8b7355" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.22, 0]}>
        <boxGeometry args={[0.5, 0.14, 0.3]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.7} />
      </mesh>
      <mesh position={[0.5, 1.18, 0]} rotation-z={0.15}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  )
}

export function FloorLamp({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.05, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.7, 8]} />
        <meshStandardMaterial color="#555" metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <coneGeometry args={[0.25, 0.3, 16, 1, true]} />
        <meshStandardMaterial color="#e8b04b" emissive="#ffb454" emissiveIntensity={0.8} side={2} />
      </mesh>
      <pointLight position={[0, 1.65, 0]} color="#ffcf8a" intensity={6} distance={7} />
    </group>
  )
}

export function ConsoleTable({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.45, 0.05, 1.3]} />
        <meshStandardMaterial color="#4a3524" />
      </mesh>
      {[-0.55, 0.55].map((z) => (
        <mesh key={z} position={[0, 0.39, z]}>
          <boxGeometry args={[0.4, 0.78, 0.06]} />
          <meshStandardMaterial color="#3a2a1c" />
        </mesh>
      ))}
      {/* potted plant */}
      <mesh position={[0, 0.9, 0.3]}>
        <cylinderGeometry args={[0.1, 0.08, 0.18, 10]} />
        <meshStandardMaterial color="#b35a3a" />
      </mesh>
      <mesh position={[0, 1.1, 0.3]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color="#3d7a3d" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

export function GalleryDesk({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[2.1, 0.06, 0.9]} />
        <meshStandardMaterial color="#5a4130" />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]}>
          <boxGeometry args={[0.08, 0.72, 0.85]} />
          <meshStandardMaterial color="#3a2a1c" />
        </mesh>
      ))}
      {/* mug + notebook so the desk isn't bare (the laptop is its own prop) */}
      <mesh position={[0.7, 0.79, 0.15]}>
        <cylinderGeometry args={[0.045, 0.04, 0.09, 12]} />
        <meshStandardMaterial color="#c0392b" roughness={0.5} />
      </mesh>
      <mesh position={[-0.65, 0.765, 0.1]} rotation-y={-0.3}>
        <boxGeometry args={[0.3, 0.02, 0.22]} />
        <meshStandardMaterial color="#e8dcc5" roughness={1} />
      </mesh>
    </group>
  )
}

/** open laptop — clicking it zooms the camera in and boots the "desktop" */
export function Laptop({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  const screen = useMemo(() => codeScreenTexture(), [])
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.015, 0.05]}>
        <boxGeometry args={[0.58, 0.03, 0.4]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* keyboard hint */}
      <mesh position={[0, 0.032, 0.08]}>
        <planeGeometry args={[0.5, 0.24]} />
        <meshStandardMaterial color="#22303e" roughness={0.6} />
      </mesh>
      <group position={[0, 0.17, -0.12]} rotation-x={-0.32}>
        <mesh>
          <boxGeometry args={[0.58, 0.38, 0.02]} />
          <meshStandardMaterial color="#1a2230" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.53, 0.33]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

export function KitchenCounter({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[7, 0.92, 1.05]} />
        <meshStandardMaterial color="#8f9aa3" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[7.1, 0.06, 1.12]} />
        <meshStandardMaterial color="#d9d4c7" roughness={0.35} />
      </mesh>
      {/* sink */}
      <mesh position={[-2, 0.99, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.55]} />
        <meshStandardMaterial color="#aab4bb" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-2, 1.25, -0.3]} rotation-x={0.6}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
        <meshStandardMaterial color="#c0c8ce" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* stove burners */}
      {[0.9, 1.6].map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.99, z]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
        )),
      )}
      {/* pan with something cooking */}
      <mesh position={[0.9, 1.04, -0.22]}>
        <cylinderGeometry args={[0.16, 0.14, 0.07, 16, 1, true]} />
        <meshStandardMaterial color="#333" side={2} />
      </mesh>
    </group>
  )
}

export function Fridge({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.0, 2.0, 0.9]} />
        <meshStandardMaterial color="#e8e8e6" roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.3, 0.46]}>
        <boxGeometry args={[0.9, 0.02, 0.02]} />
        <meshStandardMaterial color="#999" />
      </mesh>
      <mesh position={[-0.38, 1.0, 0.47]}>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
        <meshStandardMaterial color="#b8b8b6" metalness={0.5} />
      </mesh>
      {/* "resume" magnet note */}
      <mesh position={[0.12, 1.55, 0.46]} rotation-z={-0.08}>
        <boxGeometry args={[0.34, 0.42, 0.01]} />
        <meshStandardMaterial color="#fff8dc" roughness={1} />
      </mesh>
      <mesh position={[0.12, 1.74, 0.47]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  )
}

export function Island({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[2.3, 0.96, 1.1]} />
        <meshStandardMaterial color="#6d5a45" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.99, 0]}>
        <boxGeometry args={[2.45, 0.07, 1.25]} />
        <meshStandardMaterial color="#e6e0d2" roughness={0.3} />
      </mesh>
      {/* cutting board + recipe card */}
      <mesh position={[-0.6, 1.045, 0.1]}>
        <boxGeometry args={[0.5, 0.03, 0.35]} />
        <meshStandardMaterial color="#c9a26f" />
      </mesh>
      <mesh position={[0.45, 1.04, -0.1]} rotation-y={0.3}>
        <boxGeometry args={[0.4, 0.01, 0.28]} />
        <meshStandardMaterial color="#fffaf0" />
      </mesh>
      {/* stools */}
      {[-0.7, 0.7].map((x) => (
        <group key={x} position={[x, 0, 1]}>
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.06, 12]} />
            <meshStandardMaterial color="#b3592f" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.6, 8]} />
            <meshStandardMaterial color="#3a2a1c" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function DiningSet({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.06, 24]} />
        <meshStandardMaterial color="#5a4130" />
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.08, 0.3, 0.72, 12]} />
        <meshStandardMaterial color="#3a2a1c" />
      </mesh>
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => (
        <group key={a} position={[Math.sin(a) * 1.45, 0, Math.cos(a) * 1.45]} rotation-y={a + Math.PI}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
            <meshStandardMaterial color="#7a6248" />
          </mesh>
          <mesh position={[0, 0.75, -0.19]}>
            <boxGeometry args={[0.42, 0.6, 0.05]} />
            <meshStandardMaterial color="#7a6248" />
          </mesh>
          {/* proper chair legs */}
          {([[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]] as const).map(([lx, lz], i) => (
            <mesh key={i} position={[lx, 0.21, lz]}>
              <boxGeometry args={[0.05, 0.42, 0.05]} />
              <meshStandardMaterial color="#5a4633" />
            </mesh>
          ))}
          {/* seat cushion */}
          <mesh position={[0, 0.49, 0]}>
            <boxGeometry args={[0.36, 0.05, 0.36]} />
            <meshStandardMaterial color="#b3592f" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Telescope({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      {[0, 2.1, -2.1].map((a) => (
        <mesh key={a} position={[Math.sin(a) * 0.2, 0.45, Math.cos(a) * 0.2]} rotation={[0.3 * Math.cos(a), 0, -0.3 * Math.sin(a)]}>
          <cylinderGeometry args={[0.02, 0.03, 0.95, 8]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.5} />
        </mesh>
      ))}
      <group position={[0, 1.0, 0]} rotation={[-0.55, 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.12, 1.1, 16]} />
          <meshStandardMaterial color="#c8a248" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 16]} />
          <meshStandardMaterial color="#8a6d2f" metalness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

export function LoungeChair({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.32, 0.25]} rotation-x={0.15}>
        <boxGeometry args={[0.75, 0.12, 1.1]} />
        <meshStandardMaterial color="#3a7ca5" roughness={1} />
      </mesh>
      <mesh position={[0, 0.62, -0.45]} rotation-x={-0.7}>
        <boxGeometry args={[0.75, 0.12, 0.8]} />
        <meshStandardMaterial color="#3a7ca5" roughness={1} />
      </mesh>
      {([[-0.32, 0.7], [0.32, 0.7], [-0.32, -0.2], [0.32, -0.2]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.14, z]}>
          <boxGeometry args={[0.06, 0.28, 0.06]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
      ))}
    </group>
  )
}

export function Planter({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.45]} />
        <meshStandardMaterial color="#8d6748" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#2f6b3a" roughness={1} flatShading />
      </mesh>
      <mesh position={[0.12, 0.85, 0.05]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#3d8a4a" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

/** warm fairy lights strung along the balcony railing */
export function StringLights({ from, to, count = 9 }: { from: XYZ; to: XYZ; count?: number }) {
  const bulbs = []
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const sag = Math.sin(t * Math.PI) * 0.18
    bulbs.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t - sag, from[2] + (to[2] - from[2]) * t] as XYZ)
  }
  return (
    <group>
      {bulbs.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#ffdf9e" emissive="#ffc36b" emissiveIntensity={2.2} />
        </mesh>
      ))}
    </group>
  )
}

/** hanging ceiling lamp that carries the actual room light */
export function CeilingLamp({
  position,
  color = '#ffcf8a',
  intensity = 20,
  distance = 12,
}: {
  position: XYZ
  color?: string
  intensity?: number
  distance?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh>
        <coneGeometry args={[0.28, 0.26, 20, 1, true]} />
        <meshStandardMaterial color="#2f2f2f" side={2} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#fff3d6" emissive={color} emissiveIntensity={2.5} />
      </mesh>
      <pointLight position={[0, -0.2, 0]} color={color} intensity={intensity} distance={distance} decay={1.6} />
    </group>
  )
}

/** framed abstract print for blank walls */
export function WallArt({ position, rotationY = 0, w = 1.3, h = 1.0 }: { position: XYZ; rotationY?: number; w?: number; h?: number }) {
  const art = useMemo(() => wallArtTexture(), [])
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.05]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={art} roughness={0.8} />
      </mesh>
    </group>
  )
}

export function GalleryBench({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.35, 0.09, 0.45]} />
        <meshStandardMaterial color="#4a3524" roughness={0.55} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.19, 0]}>
          <boxGeometry args={[0.08, 0.38, 0.4]} />
          <meshStandardMaterial color="#3a2a1c" />
        </mesh>
      ))}
    </group>
  )
}

export function CoatRack({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.05, 12]} />
        <meshStandardMaterial color="#3a2a1c" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
        <meshStandardMaterial color="#5a4130" roughness={0.6} />
      </mesh>
      {[0, 1.6, 3.2, 4.8].map((a) => (
        <mesh key={a} position={[Math.sin(a) * 0.14, 1.68, Math.cos(a) * 0.14]} rotation={[0.5 * Math.cos(a), 0, -0.5 * Math.sin(a)]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
          <meshStandardMaterial color="#5a4130" />
        </mesh>
      ))}
      {/* a jacket hanging on it */}
      <mesh position={[0.16, 1.28, 0.05]} rotation-y={0.4}>
        <boxGeometry args={[0.34, 0.62, 0.12]} />
        <meshStandardMaterial color="#31435c" roughness={1} />
      </mesh>
    </group>
  )
}

/** small hanging pendant (visual only — carries no light source) */
export function PendantLamp({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.0, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh>
        <coneGeometry args={[0.14, 0.16, 16, 1, true]} />
        <meshStandardMaterial color="#c85a3a" side={2} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#fff3d6" emissive="#ffcf8a" emissiveIntensity={2.2} />
      </mesh>
    </group>
  )
}

/** balcony side table with a steaming mug */
export function SideTable({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} />
        <meshStandardMaterial color="#5a4130" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.44, 8]} />
        <meshStandardMaterial color="#3a2a1c" />
      </mesh>
      <mesh position={[0.06, 0.52, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.09, 12]} />
        <meshStandardMaterial color="#d9d4c7" roughness={0.4} />
      </mesh>
    </group>
  )
}

/** retro jukebox — lights pulse while music plays (state in musicPlayer.ts) */
export function Jukebox({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  const lights = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!lights.current) return
    // lazy import avoided: read playing state straight off the store
    const playing = jukeboxPlaying()
    const t = clock.elapsedTime
    lights.current.children.forEach((c, i) => {
      const m = (c as unknown as { material: { emissiveIntensity: number } }).material
      m.emissiveIntensity = playing ? 1.2 + Math.sin(t * 6 + i * 1.3) * 1.0 : 0.35
    })
  })
  return (
    <group position={position} rotation-y={rotationY}>
      {/* body */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.85, 1.1, 0.5]} />
        <meshStandardMaterial color="#7a2e1f" roughness={0.45} />
      </mesh>
      {/* arched top */}
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.425, 0.425, 0.5, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#7a2e1f" roughness={0.45} />
      </mesh>
      {/* glass display arch */}
      <mesh position={[0, 1.12, 0.253]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.33, 20, 0, Math.PI]} />
        <meshStandardMaterial color="#ffdf9e" emissive="#ffb454" emissiveIntensity={0.8} roughness={0.3} />
      </mesh>
      {/* speaker grille */}
      <mesh position={[0, 0.5, 0.253]}>
        <planeGeometry args={[0.6, 0.45]} />
        <meshStandardMaterial color="#2a1a12" roughness={1} />
      </mesh>
      {[-0.2, 0, 0.2].map((y) => (
        <mesh key={y} position={[0, 0.5 + y * 0.8, 0.257]}>
          <planeGeometry args={[0.56, 0.03]} />
          <meshStandardMaterial color="#c8a248" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* pulsing lights */}
      <group ref={lights}>
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.92, 0.26]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial
              color={['#e74c3c', '#f39c12', '#2ecc71', '#3498db'][i]}
              emissive={['#e74c3c', '#f39c12', '#2ecc71', '#3498db'][i]}
              emissiveIntensity={0.35}
            />
          </mesh>
        ))}
      </group>
      {/* feet */}
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.03, 0.15]}>
          <boxGeometry args={[0.08, 0.06, 0.4]} />
          <meshStandardMaterial color="#3a1a10" />
        </mesh>
      ))}
    </group>
  )
}

// resolved lazily so props.tsx doesn't hard-depend on the audio module at import time
let _playingGetter: (() => boolean) | null = null
function jukeboxPlaying(): boolean {
  if (!_playingGetter) {
    void import('../../audio/musicPlayer').then((m) => {
      _playingGetter = () => m.useMusicStore.getState().playing
    })
    return false
  }
  return _playingGetter()
}

/** tall pantry shelf stacked with supplies */
export function Pantry({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  const jarColors = ['#c0392b', '#f39c12', '#27ae60', '#d9d4c7', '#8e44ad']
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.5, 2.1, 1.7]} />
        <meshStandardMaterial color="#5a4130" roughness={0.8} />
      </mesh>
      {[0.45, 1.0, 1.55].map((y, row) => (
        <group key={y}>
          {jarColors.map((c, i) => (
            <mesh key={i} position={[0.18, y, -0.6 + i * 0.3 + (row % 2) * 0.08]}>
              <cylinderGeometry args={[0.07, 0.07, 0.2 + (i % 2) * 0.08, 10]} />
              <meshStandardMaterial color={c} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** low sideboard with a plant for the dining corner */
export function Sideboard({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.8, 1.7]} />
        <meshStandardMaterial color="#6d5a45" roughness={0.7} />
      </mesh>
      {[-0.4, 0.4].map((z) => (
        <mesh key={z} position={[0.26, 0.4, z]}>
          <boxGeometry args={[0.02, 0.6, 0.7]} />
          <meshStandardMaterial color="#7a6248" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.92, -0.5]}>
        <cylinderGeometry args={[0.12, 0.09, 0.22, 10]} />
        <meshStandardMaterial color="#b35a3a" />
      </mesh>
      <mesh position={[0, 1.16, -0.5]}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#3d7a3d" roughness={1} flatShading />
      </mesh>
      {/* stacked books */}
      <mesh position={[0, 0.86, 0.35]}>
        <boxGeometry args={[0.3, 0.12, 0.4]} />
        <meshStandardMaterial color="#2980b9" roughness={1} />
      </mesh>
    </group>
  )
}

/** wall-hung upper cabinet */
export function UpperCabinet({ position, rotationY = 0, w = 2.2 }: { position: XYZ; rotationY?: number; w?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh>
        <boxGeometry args={[w, 0.8, 0.45]} />
        <meshStandardMaterial color="#8f9aa3" roughness={0.6} />
      </mesh>
      {[-w / 4, w / 4].map((x) => (
        <group key={x}>
          <mesh position={[x, 0, 0.23]}>
            <boxGeometry args={[w / 2 - 0.06, 0.68, 0.02]} />
            <meshStandardMaterial color="#a5afb8" roughness={0.5} />
          </mesh>
          <mesh position={[x + (x < 0 ? 0.12 : -0.12), -0.22, 0.25]}>
            <boxGeometry args={[0.03, 0.14, 0.03]} />
            <meshStandardMaterial color="#5a6570" metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** floating shelf with jars */
export function ShelfJars({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#5a4130" roughness={0.6} />
      </mesh>
      {[-0.4, -0.05, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.14 + i * 0.01, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.22 + i * 0.03, 10]} />
          <meshStandardMaterial color={['#e8b04b', '#c0392b', '#7a8a5a'][i]} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/** simple analog wall clock (face looks along +z) */
export function WallClock({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  const minute = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (minute.current) minute.current.rotation.z = -clock.elapsedTime * 0.05
  })
  return (
    <group position={position} rotation-y={rotationY}>
      {/* rim: cylinder axis rotated to point along z */}
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 24]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.028]}>
        <circleGeometry args={[0.24, 24]} />
        <meshStandardMaterial color="#f5ecd9" roughness={0.8} />
      </mesh>
      {/* minute hand */}
      <group ref={minute} position={[0, 0, 0.035]}>
        <mesh position={[0, 0.08, 0]}>
          <planeGeometry args={[0.02, 0.17]} />
          <meshBasicMaterial color="#1a1210" />
        </mesh>
      </group>
      {/* hour hand, parked at ~4 o'clock */}
      <group position={[0, 0, 0.033]} rotation-z={-2.1}>
        <mesh position={[0, 0.055, 0]}>
          <planeGeometry args={[0.025, 0.11]} />
          <meshBasicMaterial color="#7a3b2e" />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.04]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
    </group>
  )
}

/** fruit bowl for the island counter */
export function FruitBowl({ position }: { position: XYZ }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.16, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshStandardMaterial color="#3a6f6a" roughness={0.4} side={2} />
      </mesh>
      {([[0.05, '#e74c3c'], [-0.06, '#f39c12'], [0, '#7cb342']] as const).map(([x, c], i) => (
        <mesh key={i} position={[x, 0.1, i * 0.05 - 0.04]}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial color={c} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

/** corkboard where visitors pin their collaboration ideas */
export function IdeaBoard({ position, rotationY = 0 }: { position: XYZ; rotationY?: number }) {
  const notes: Array<[number, number, number, string]> = [
    [-0.6, 0.25, -0.06, '#fff8b8'],
    [-0.15, -0.15, 0.1, '#c8e6c9'],
    [0.35, 0.22, 0.04, '#ffd9d9'],
    [0.62, -0.2, -0.08, '#d0e8ff'],
  ]
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[2.0, 1.15, 0.05]} />
        <meshStandardMaterial color="#5a4130" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[1.86, 1.0]} />
        <meshStandardMaterial color="#b08a5a" roughness={1} />
      </mesh>
      {notes.map(([x, y, rot, c], i) => (
        <group key={i} position={[x, y, 0.02]} rotation-z={rot}>
          <mesh>
            <planeGeometry args={[0.34, 0.34]} />
            <meshStandardMaterial color={c} roughness={1} />
          </mesh>
          <mesh position={[0, 0.15, 0.01]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** subtle idle rotation — used for attention markers */
export function Spinner({ children, speed = 1 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * speed
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.06
  })
  return <group ref={ref}>{children}</group>
}
