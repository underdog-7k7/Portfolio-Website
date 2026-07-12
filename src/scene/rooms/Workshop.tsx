import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { Interactable } from '../../interactions/Interactable'
import { WallArt } from '../props/props'
import { NeonSign } from '../props/Signage'
import current from '../../data/current.json'

/** whiteboard texture generated straight from current.json — edit the JSON, the board updates */
function makeWhiteboard(): CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 640
  c.height = 400
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#f7f7f2'
  ctx.fillRect(0, 0, 640, 400)
  ctx.fillStyle = '#c0392b'
  ctx.font = 'bold 38px "Segoe Print", "Comic Sans MS", cursive'
  ctx.fillText('NOW BUILDING', 40, 62)
  ctx.strokeStyle = '#c0392b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(40, 74)
  ctx.lineTo(330, 78)
  ctx.stroke()
  ctx.font = '26px "Segoe Print", "Comic Sans MS", cursive'
  current.items.forEach((item, i) => {
    const y = 130 + i * 78
    // checkbox
    ctx.strokeStyle = '#2c3e50'
    ctx.lineWidth = 2.5
    ctx.strokeRect(42, y - 22, 26, 26)
    if (item.progress >= 90) {
      ctx.strokeStyle = '#27ae60'
      ctx.beginPath()
      ctx.moveTo(46, y - 10)
      ctx.lineTo(54, y - 2)
      ctx.lineTo(66, y - 20)
      ctx.stroke()
    }
    ctx.fillStyle = '#2c3e50'
    ctx.fillText(item.title, 84, y)
    // progress bar
    ctx.strokeStyle = '#7f8c8d'
    ctx.lineWidth = 1.5
    ctx.strokeRect(84, y + 12, 220, 12)
    ctx.fillStyle = item.progress >= 90 ? '#27ae60' : '#2980b9'
    ctx.fillRect(86, y + 14, 216 * (item.progress / 100), 8)
    ctx.fillStyle = '#7f8c8d'
    ctx.font = '18px "Segoe Print", "Comic Sans MS", cursive'
    ctx.fillText(`${item.progress}%`, 315, y + 24)
    ctx.font = '26px "Segoe Print", "Comic Sans MS", cursive'
  })
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

function Workbench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* sturdy top + legs */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[0.9, 0.07, 2.4]} />
        <meshStandardMaterial color="#8a6d4a" roughness={0.7} />
      </mesh>
      {([[-0.35, -1.05], [0.35, -1.05], [-0.35, 1.05], [0.35, 1.05]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.43, z]}>
          <boxGeometry args={[0.09, 0.86, 0.09]} />
          <meshStandardMaterial color="#4a3a28" />
        </mesh>
      ))}
      {/* lower shelf with parts bins */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.8, 0.04, 2.2]} />
        <meshStandardMaterial color="#5a4633" />
      </mesh>
      {[-0.7, -0.25, 0.2].map((z, i) => (
        <mesh key={i} position={[0, 0.42, z]}>
          <boxGeometry args={[0.5, 0.16, 0.35]} />
          <meshStandardMaterial color={['#c0392b', '#2980b9', '#7a8a5a'][i]} roughness={0.7} />
        </mesh>
      ))}
      {/* breadboard + ESP32 dev board */}
      <mesh position={[0.05, 0.94, -0.55]} rotation-y={0.3}>
        <boxGeometry args={[0.28, 0.03, 0.42]} />
        <meshStandardMaterial color="#e8e8e6" roughness={0.6} />
      </mesh>
      <mesh position={[0.02, 0.94, 0.05]} rotation-y={-0.2}>
        <boxGeometry args={[0.14, 0.02, 0.26]} />
        <meshStandardMaterial color="#1e3a2a" roughness={0.5} />
      </mesh>
      {/* jumper wires blob */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.1 - i * 0.06, 0.945, 0.38 + i * 0.04]} rotation-y={i}>
          <torusGeometry args={[0.05, 0.008, 6, 12, Math.PI * 1.4]} />
          <meshStandardMaterial color={['#e74c3c', '#f1c40f', '#3498db'][i]} />
        </mesh>
      ))}
      {/* soldering iron on a stand */}
      <group position={[-0.15, 0.92, 0.75]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.045, 0.055, 0.12, 10]} />
          <meshStandardMaterial color="#7f8c8d" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0.1, 0.12, 0]} rotation-z={-0.9}>
          <cylinderGeometry args={[0.012, 0.025, 0.3, 8]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
      </group>
      {/* desk lamp */}
      <group position={[0.12, 0.92, -1.0]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.04, 12]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0.06, 0.2, 0]} rotation-z={-0.5}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
        <mesh position={[0.2, 0.36, 0]} rotation-z={1.1}>
          <coneGeometry args={[0.08, 0.14, 12, 1, true]} />
          <meshStandardMaterial color="#e8b04b" emissive="#ffcf8a" emissiveIntensity={1.2} side={2} />
        </mesh>
        <pointLight position={[0.24, 0.3, 0]} color="#ffe6c0" intensity={2.5} distance={3} />
      </group>
    </group>
  )
}

function Pegboard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.05, 1.1, 2.2]} />
        <meshStandardMaterial color="#c9a26f" roughness={0.9} />
      </mesh>
      {/* hanging tools: hammer, wrench, screwdrivers */}
      <group position={[0.05, 0.15, -0.7]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#8a6d4a" />
        </mesh>
        <mesh position={[0, 0.35, 0]} rotation-x={Math.PI / 2}>
          <boxGeometry args={[0.07, 0.09, 0.22]} />
          <meshStandardMaterial color="#57606f" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      <mesh position={[0.05, 0.2, -0.15]} rotation-x={0.15}>
        <boxGeometry args={[0.03, 0.5, 0.09]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.7} roughness={0.3} />
      </mesh>
      {[0.3, 0.55].map((z, i) => (
        <group key={z} position={[0.05, 0.18, z]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
            <meshStandardMaterial color={i ? '#c0392b' : '#f1c40f'} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.008, 0.004, 0.12, 6]} />
            <meshStandardMaterial color="#95a5a6" metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * The workshop: a small lab room in the NW corner of the kitchen wing that
 * shows what I'm actively building — whiteboard on the wall, cluttered bench,
 * pegboard of tools. Walking to the bench opens the "Now Building" panel.
 */
export function Workshop() {
  const board = useMemo(() => makeWhiteboard(), [])
  return (
    <group>
      {/* cool task lighting — different mood from the warm house */}
      <pointLight position={[-8.5, 2.75, -6.8]} color="#cfdcf5" intensity={6.5} distance={7} decay={1.9} />

      {/* concrete floor inlay */}
      <mesh position={[-8.55, 0.014, -6.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.75, 4.3]} />
        <meshStandardMaterial color="#9aa0a6" roughness={1} />
      </mesh>

      <Pegboard position={[-10.85, 1.75, -6.8]} />
      {/* poster + schematic pinned on the back wall */}
      <WallArt position={[-8.9, 1.95, -8.82]} rotationY={0} w={0.9} h={0.7} />
      <mesh position={[-7.6, 1.85, -8.84]} rotation-z={0.04}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshStandardMaterial color="#dce6f0" roughness={1} />
      </mesh>
      <mesh position={[-7.6, 1.85, -8.835]}>
        <planeGeometry args={[0.56, 0.02]} />
        <meshStandardMaterial color="#2980b9" />
      </mesh>

      {/* whiteboard on the south wall, facing into the room */}
      <group position={[-8.3, 1.72, -4.7]} rotation-y={Math.PI}>
        <mesh position={[0, 0, -0.015]}>
          <boxGeometry args={[2.3, 1.5, 0.06]} />
          <meshStandardMaterial color="#d0d3d8" metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[2.1, 1.32]} />
          <meshStandardMaterial map={board} roughness={0.35} />
        </mesh>
        {/* marker tray + markers */}
        <mesh position={[0, -0.8, 0.06]}>
          <boxGeometry args={[1.2, 0.05, 0.12]} />
          <meshStandardMaterial color="#aeb4bb" />
        </mesh>
        {[-0.2, 0.05].map((x, i) => (
          <mesh key={x} position={[x, -0.76, 0.06]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
            <meshStandardMaterial color={i ? '#2980b9' : '#c0392b'} />
          </mesh>
        ))}
      </group>

      {/* neon room sign above the whiteboard */}
      <NeonSign position={[-8.3, 2.72, -4.72]} rotationY={Math.PI} text="THE LAB" sub="work in progress" />

      {/* stool + cardboard boxes */}
      <group position={[-9.4, 0, -6.3]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.05, 12]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0, 0.27, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 0.54, 8]} />
          <meshStandardMaterial color="#57606f" metalness={0.5} />
        </mesh>
      </group>
      <group position={[-7.7, 0, -8.45]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.85, 0.56, 0.8]} />
          <meshStandardMaterial color="#b08a5a" roughness={1} />
        </mesh>
        <mesh position={[0.1, 0.82, 0.05]} rotation-y={0.4}>
          <boxGeometry args={[0.55, 0.5, 0.55]} />
          <meshStandardMaterial color="#c19a6b" roughness={1} />
        </mesh>
      </group>

      {/* the bench is the interactable — auto-opens the Now Building panel */}
      <Interactable
        id="workbench"
        position={[-10.2, 0, -6.8]}
        radius={2.1}
        label="See what I'm building"
        overlay={{ kind: 'current' }}
        markerY={2.3}
        room="workshop"
      >
        <Workbench position={[-0.15, 0, 0]} />
      </Interactable>
    </group>
  )
}
