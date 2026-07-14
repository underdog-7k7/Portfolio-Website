import { Suspense, lazy, useEffect } from 'react'
import { LoadingScreen } from './ui/LoadingScreen'
import { HUD } from './ui/HUD'
import { OverlayRoot } from './ui/OverlayRoot'
import { useAppStore } from './store/useAppStore'

const House3DApp = lazy(() => import('./scene/House3DApp').then((m) => ({ default: m.House3DApp })))

export default function App() {
  const setTouch = useAppStore((s) => s.setTouch)
  const loadingRequested = useAppStore((s) => s.loadingRequested)

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)
  }, [setTouch])

  return (
    <div className="fixed inset-0 bg-ink">
      {loadingRequested && (
        <Suspense fallback={null}>
          <House3DApp />
        </Suspense>
      )}
      <LoadingScreen />
      <HUD />
      <OverlayRoot />
    </div>
  )
}
