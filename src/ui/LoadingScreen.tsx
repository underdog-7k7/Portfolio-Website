import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useAppStore } from '../store/useAppStore'
import { ClassicLanding } from '../classic/ClassicLanding'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  const started = useAppStore((s) => s.started)
  const loadingRequested = useAppStore((s) => s.loadingRequested)
  const requestLoading = useAppStore((s) => s.requestLoading)
  const start = useAppStore((s) => s.start)
  const [forceReady, setForceReady] = useState(false)

  // safety net: tiny scenes can finish loading before useProgress ever ticks —
  // only starts counting once the user actually asked to enter the house
  useEffect(() => {
    if (!loadingRequested) return
    const t = setTimeout(() => setForceReady(true), 4000)
    return () => clearTimeout(t)
  }, [loadingRequested])

  const ready = forceReady || (!active && progress >= 100)

  useEffect(() => {
    if (loadingRequested && ready && !started) start()
  }, [loadingRequested, ready, started, start])

  if (started) return null

  return <ClassicLanding ready={ready} progress={progress} loadingRequested={loadingRequested} onEnter={requestLoading} />
}
