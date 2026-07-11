import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Matrix4, Quaternion, Vector3 } from 'three'
import { useAppStore } from '../store/useAppStore'
import { player } from '../controls/playerState'
import { EYE } from './houseLayout'

const UP = new Vector3(0, 1, 0)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/**
 * Smoothly flies the camera into a focus target (laptop screen, …) and back.
 * While a focus is active or the rig is animating, both control schemes stand
 * down (they check `focus`/`cameraBusy` in the store).
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const focus = useAppStore((s) => s.focus)
  const anim = useRef({ phase: 'idle' as 'in' | 'out' | 'idle', t: 0 })
  // must track "were we focused" separately from the animation phase: the
  // fly-in finishes (phase idle) long before the user leaves the focus, and
  // the fly-out must still run at that point or controls stay locked forever
  const wasFocused = useRef(false)
  const pose = useMemo(
    () => ({
      fromPos: new Vector3(),
      fromQuat: new Quaternion(),
      toPos: new Vector3(),
      toQuat: new Quaternion(),
      m: new Matrix4(),
      look: new Vector3(),
    }),
    [],
  )

  // debug handle for automated smoke tests (headless browser aims the view)
  useEffect(() => {
    ;(window as unknown as Record<string, unknown>).__camera = camera
  }, [camera])

  useEffect(() => {
    const a = anim.current
    if (focus) {
      wasFocused.current = true
      pose.fromPos.copy(camera.position)
      pose.fromQuat.copy(camera.quaternion)
      pose.toPos.set(...focus.pos)
      pose.look.set(...focus.look)
      pose.m.lookAt(pose.toPos, pose.look, UP)
      pose.toQuat.setFromRotationMatrix(pose.m)
      a.phase = 'in'
      a.t = 0
    } else if (wasFocused.current) {
      wasFocused.current = false
      // fly back to wherever the player is standing, restoring the pre-focus view
      pose.toPos.set(player.position.x, EYE, player.position.z)
      pose.toQuat.copy(pose.fromQuat)
      pose.fromPos.copy(camera.position)
      pose.fromQuat.copy(camera.quaternion)
      a.phase = 'out'
      a.t = 0
      useAppStore.getState().setCameraBusy(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  useFrame((_, dt) => {
    const a = anim.current
    if (a.phase === 'idle') return
    const dur = a.phase === 'in' ? 1.0 : 0.7
    a.t = Math.min(a.t + dt / dur, 1)
    const e = easeInOut(a.t)
    camera.position.lerpVectors(pose.fromPos, pose.toPos, e)
    camera.quaternion.slerpQuaternions(pose.fromQuat, pose.toQuat, e)
    if (a.t < 1) return
    const s = useAppStore.getState()
    if (a.phase === 'in') {
      a.phase = 'idle'
      const f = s.focus
      if (f?.overlay && s.overlay?.kind !== f.overlay.kind) s.openOverlay(f.overlay, 'focus')
    } else {
      a.phase = 'idle'
      s.setCameraBusy(false)
    }
  })

  return null
}
