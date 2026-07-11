import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import { Vector3, type Mesh } from 'three'
import { player } from './playerState'
import { EYE } from '../scene/houseLayout'
import { syncRoom } from './syncRoom'
import { useAppStore } from '../store/useAppStore'
import config from '../data/config.json'

interface Waypoint {
  id: string
  label: string
  position: number[]
  neighbors: string[]
}

const waypoints = config.waypoints as Waypoint[]
const byId = new Map(waypoints.map((w) => [w.id, w]))
/** waypoints that get a big labelled portal disc (the rest are path nodes) */
const MAJOR = new Set(['hall-center', 'living', 'gallery', 'kitchen', 'balcony', 'workshop'])

const MOVE_SPEED = 3.4
const LOOK_SENSITIVITY = 0.005
const PITCH_LIMIT = 1.15

function nearestWaypointId(x: number, z: number): string {
  let best = waypoints[0].id
  let bestD = Infinity
  for (const w of waypoints) {
    const d = (w.position[0] - x) ** 2 + (w.position[2] - z) ** 2
    if (d < bestD) {
      bestD = d
      best = w.id
    }
  }
  return best
}

/** BFS through the waypoint graph — segments between neighbours never cross walls */
function findPath(fromId: string, toId: string): Waypoint[] {
  if (fromId === toId) return []
  const prev = new Map<string, string>()
  const queue = [fromId]
  const seen = new Set([fromId])
  while (queue.length) {
    const cur = queue.shift()!
    for (const n of byId.get(cur)?.neighbors ?? []) {
      if (seen.has(n)) continue
      seen.add(n)
      prev.set(n, cur)
      if (n === toId) {
        const path: Waypoint[] = []
        let at: string | undefined = toId
        while (at && at !== fromId) {
          path.unshift(byId.get(at)!)
          at = prev.get(at)
        }
        return path
      }
      queue.push(n)
    }
  }
  return []
}

function PortalDisc({ waypoint, onGo }: { waypoint: Waypoint; onGo: (id: string) => void }) {
  const ring = useRef<Mesh>(null)
  const major = MAJOR.has(waypoint.id)
  useFrame(({ clock }) => {
    if (!ring.current) return
    const s = 1 + Math.sin(clock.elapsedTime * 2.5 + waypoint.position[0]) * 0.1
    ring.current.scale.setScalar(s)
  })
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (e.delta > 6) return
    onGo(waypoint.id)
  }
  return (
    <group position={[waypoint.position[0], 0, waypoint.position[2]]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} onClick={onClick}>
        <ringGeometry args={major ? [0.28, 0.42, 32] : [0.14, 0.22, 24]} />
        <meshBasicMaterial color="#5ad0c0" transparent opacity={0.85} />
      </mesh>
      {/* generous invisible tap target */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} onClick={onClick}>
        <circleGeometry args={[major ? 0.8 : 0.45, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {major && (
        <Billboard position={[0, 0.75, 0]}>
          <Text fontSize={0.2} color="#d9fff8" outlineWidth={0.008} outlineColor="#0b3a33" anchorX="center">
            {waypoint.label}
          </Text>
        </Billboard>
      )}
    </group>
  )
}

/**
 * Touch controls: drag anywhere to look around 360°, tap a glowing portal
 * disc to glide to that room through the doorway graph.
 */
export function MobileControls() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const look = useRef({ yaw: 0, pitch: 0 })
  const path = useRef<Vector3[]>([])
  const bob = useRef(0)
  const tmp = useMemo(() => new Vector3(), [])

  useEffect(() => {
    camera.rotation.order = 'YXZ'
    const el = gl.domElement
    let dragging = false
    let lastX = 0
    let lastY = 0
    const down = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      look.current.yaw -= (e.clientX - lastX) * LOOK_SENSITIVITY
      look.current.pitch -= (e.clientY - lastY) * LOOK_SENSITIVITY
      look.current.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, look.current.pitch))
      lastX = e.clientX
      lastY = e.clientY
    }
    const up = () => (dragging = false)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [camera, gl])

  const goTo = (targetId: string) => {
    const fromId = nearestWaypointId(player.position.x, player.position.z)
    const nodes = findPath(fromId, targetId)
    const points = nodes.map((w) => new Vector3(w.position[0], 0, w.position[2]))
    // if we're off-graph (mid-walk), route through the nearest node first
    const from = byId.get(fromId)!
    const dToNode = Math.hypot(from.position[0] - player.position.x, from.position[2] - player.position.z)
    if (dToNode > 0.5) points.unshift(new Vector3(from.position[0], 0, from.position[2]))
    path.current = points
  }

  useFrame((_, rawDt) => {
    const s = useAppStore.getState()
    // camera rig owns the camera during focus (laptop zoom etc.)
    if (s.focus || s.cameraBusy) return
    const dt = Math.min(rawDt, 0.05)
    const target = path.current[0]
    if (target) {
      tmp.subVectors(target, player.position)
      tmp.y = 0
      const dist = tmp.length()
      if (dist < 0.25) {
        path.current.shift()
      } else {
        tmp.normalize().multiplyScalar(Math.min(MOVE_SPEED * dt, dist))
        player.position.add(tmp)
      }
    }
    // soft glide-bob while travelling between waypoints
    bob.current += dt * 7 * (target ? 1 : 0)
    const bobY = target ? Math.sin(bob.current) * 0.025 : 0
    camera.position.set(player.position.x, EYE + bobY, player.position.z)
    camera.rotation.set(look.current.pitch, look.current.yaw, 0)
    syncRoom()
  })

  return (
    <group>
      {waypoints.map((w) => (
        <PortalDisc key={w.id} waypoint={w} onGo={goTo} />
      ))}
    </group>
  )
}
