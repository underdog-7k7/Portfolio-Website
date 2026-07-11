import { useEffect, useRef } from 'react'
import { useAnimations, useGLTF, Billboard, Text } from '@react-three/drei'
import { LoopOnce } from 'three'
import type { Group } from 'three'
import { useAppStore } from '../../store/useAppStore'

const URL = import.meta.env.BASE_URL + 'models/robot.glb'

/**
 * The AI-twin greeter: three.js' CC0 "RobotExpressive" character (by Tomás
 * Laulhé) with its built-in animation clips. Idles by default and waves when
 * a visitor walks up. Stand-in until the custom Animesh avatar is modelled —
 * fits the "AI representative" story nicely meanwhile.
 */
export function RobotAvatar({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const rig = useRef<Group>(null)
  const { scene, animations } = useGLTF(URL)
  const { actions, mixer } = useAnimations(animations, rig)

  useEffect(() => {
    actions.Idle?.reset().fadeIn(0.2).play()
  }, [actions])

  // wave whenever a visitor enters my interaction radius
  useEffect(
    () =>
      useAppStore.subscribe((s, prev) => {
        const entered = s.near?.id === 'avatar-agent' && prev.near?.id !== 'avatar-agent'
        if (!entered) return
        const wave = actions.Wave
        const idle = actions.Idle
        if (!wave || !idle) return
        wave.reset()
        wave.setLoop(LoopOnce, 1)
        wave.clampWhenFinished = false
        idle.fadeOut(0.25)
        wave.fadeIn(0.25).play()
        const onDone = (e: { action: unknown }) => {
          if (e.action !== wave) return
          mixer.removeEventListener('finished', onDone as never)
          wave.fadeOut(0.3)
          idle.reset().fadeIn(0.3).play()
        }
        mixer.addEventListener('finished', onDone as never)
      }),
    [actions, mixer],
  )

  return (
    <group position={position}>
      <group ref={rig} rotation-y={rotationY} scale={0.36}>
        <primitive object={scene} />
      </group>
      <Billboard position={[0, 2.15, 0]}>
        <Text fontSize={0.13} color="#ffd9a8" outlineWidth={0.006} outlineColor="#3a2a1c" anchorX="center">
          Beep! I'm Animesh's AI twin
        </Text>
      </Billboard>
    </group>
  )
}

useGLTF.preload(URL)
