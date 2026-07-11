import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Preload, type KeyboardControlsEntry } from '@react-three/drei'
import { Experience } from './scene/Experience'
import { LoadingScreen } from './ui/LoadingScreen'
import { HUD } from './ui/HUD'
import { OverlayRoot } from './ui/OverlayRoot'
import { useAppStore } from './store/useAppStore'
import { EYE } from './scene/houseLayout'
import type { ControlName } from './controls/DesktopControls'

export default function App() {
  const setTouch = useAppStore((s) => s.setTouch)

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)
  }, [setTouch])

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
      <div className="fixed inset-0 bg-ink">
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
        <LoadingScreen />
        <HUD />
        <OverlayRoot />
      </div>
    </KeyboardControls>
  )
}
