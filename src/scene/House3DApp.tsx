import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Preload, type KeyboardControlsEntry } from '@react-three/drei'
import { Experience } from './Experience'
import { EYE } from './houseLayout'
import type { ControlName } from '../controls/DesktopControls'

export function House3DApp() {
  const keyMap = useMemo<KeyboardControlsEntry<ControlName>[]>(
    () => [
      { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
      { name: 'back', keys: ['KeyS', 'ArrowDown'] },
      { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
      { name: 'right', keys: ['KeyD', 'ArrowRight'] },
      { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
    ],
    [],
  )

  return (
    <KeyboardControls map={keyMap}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 70, near: 0.1, far: 120, position: [0, EYE, 7.5] }}
      >
        <Suspense fallback={null}>
          <Experience />
          <Preload all />
        </Suspense>
      </Canvas>
      {/* cozy vignette — pure CSS, costs nothing on the GPU */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 52%, rgba(5,8,20,0.42) 100%)' }}
      />
    </KeyboardControls>
  )
}
