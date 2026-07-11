import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { player } from './playerState'
import { moveWithCollision } from './collision'
import { colliders, EYE } from '../scene/houseLayout'
import { TYPING_KINDS, useAppStore } from '../store/useAppStore'
import { syncRoom } from './syncRoom'

export type ControlName = 'forward' | 'back' | 'left' | 'right' | 'run'

const WALK_SPEED = 3.8
const RUN_SPEED = 6.2

/**
 * First-person desktop controls: pointer lock to look, WASD to walk,
 * shift to run, E to interact with whatever the HUD is prompting about.
 */
export function DesktopControls() {
  const camera = useThree((s) => s.camera)
  const [, getKeys] = useKeyboardControls<ControlName>()
  const tmp = useMemo(() => ({ fwd: new Vector3(), right: new Vector3(), up: new Vector3(0, 1, 0) }), [])
  const bob = useRef({ phase: 0, amp: 0 })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      useAppStore.getState().near?.open()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const s = useAppStore.getState()
    // stand down while the camera rig owns the camera (laptop zoom etc.)
    if (s.focus || s.cameraBusy) return
    const { forward, back, left, right, run } = getKeys()
    // freeze movement while a form overlay is open — the user is typing
    const typing = s.overlay != null && TYPING_KINDS.includes(s.overlay.kind)

    const f = Number(forward) - Number(back)
    const r = Number(right) - Number(left)
    const moving = !typing && (f !== 0 || r !== 0)
    if (moving) {
      camera.getWorldDirection(tmp.fwd)
      tmp.fwd.y = 0
      tmp.fwd.normalize()
      tmp.right.crossVectors(tmp.fwd, tmp.up)
      const speed = (run ? RUN_SPEED : WALK_SPEED) * dt
      const mx = (tmp.fwd.x * f + tmp.right.x * r) * speed
      const mz = (tmp.fwd.z * f + tmp.right.z * r) * speed
      moveWithCollision(player.position, mx, mz, colliders)
    }
    // gentle head-bob while walking, eased out when standing still
    bob.current.phase += dt * (run ? 11 : 8) * (moving ? 1 : 0)
    bob.current.amp += ((moving ? 1 : 0) - bob.current.amp) * Math.min(dt * 6, 1)
    const bobY = Math.sin(bob.current.phase) * 0.035 * bob.current.amp
    camera.position.set(player.position.x, EYE + bobY, player.position.z)
    syncRoom()
  })

  const focused = useAppStore((s) => s.focus !== null || s.cameraBusy)
  return <PointerLockControls makeDefault enabled={!focused} />
}
