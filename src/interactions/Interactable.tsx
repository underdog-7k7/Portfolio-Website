import { useRef, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useAppStore, type Overlay } from '../store/useAppStore'
import { player } from '../controls/playerState'
import { Spinner } from '../scene/props/props'

interface Props {
  id: string
  position: [number, number, number]
  /** trigger distance on the XZ plane */
  radius?: number
  /** prompt shown in the HUD ("Press E — …" / "Tap — …") */
  label: string
  overlay: Overlay
  /**
   * proximity mode auto-opens the overlay when the player walks into range
   * (skills shelves, project frames, contact counter). click mode only opens
   * on tap / E press (telescope, fridge).
   */
  proximity?: boolean
  /** height of the floating attention marker; 0 hides it */
  markerY?: number
  /** custom activation (e.g. camera focus) — replaces opening the overlay directly */
  onActivate?: () => void
  /** only trigger while the player is in this room — stops radii leaking through walls */
  room?: string
  children?: ReactNode
}

/**
 * Invisible spherical trigger + clickable prop. Both control schemes get the
 * same behaviour: walk close → HUD prompt (and auto-open in proximity mode),
 * click/tap the object → open, walk away → close.
 */
export function Interactable({ id, position, radius = 2.3, label, overlay, proximity = true, markerY = 2.05, onActivate, room, children }: Props) {
  const inside = useRef(false)
  // markers get out of the shot while the camera is zoomed into something
  const focusActive = useAppStore((s) => s.focus !== null)
  const activate = () => {
    if (onActivate) onActivate()
    else useAppStore.getState().openOverlay(overlay, id)
  }

  useFrame(() => {
    const dx = player.position.x - position[0]
    const dz = player.position.z - position[2]
    const inRoom = !room || useAppStore.getState().room === room
    const isIn = inRoom && dx * dx + dz * dz < radius * radius
    if (isIn === inside.current) return
    inside.current = isIn
    const s = useAppStore.getState()
    if (isIn) {
      s.setNear({ id, label, open: activate })
      if (proximity) s.openOverlay(overlay, id)
    } else {
      if (s.near?.id === id) s.setNear(null)
      if (s.overlaySource === id) s.closeOverlay()
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    // ignore "clicks" that were actually camera drags (mobile look-around)
    if (e.delta > 6) return
    activate()
  }

  return (
    <group position={position} onClick={onClick}>
      {children}
      {markerY > 0 && !focusActive && (
        <Spinner speed={1.4}>
          <mesh position={[0, markerY, 0]}>
            <octahedronGeometry args={[0.13]} />
            <meshStandardMaterial color="#ffb454" emissive="#ff9a2e" emissiveIntensity={1.6} />
          </mesh>
        </Spinner>
      )}
    </group>
  )
}
