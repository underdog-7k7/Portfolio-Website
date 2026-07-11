import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useAppStore } from '../store/useAppStore'
import profile from '../data/profile.json'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  const started = useAppStore((s) => s.started)
  const start = useAppStore((s) => s.start)
  const isTouch = useAppStore((s) => s.isTouch)
  const [forceReady, setForceReady] = useState(false)

  // safety net: tiny scenes can finish loading before useProgress ever ticks
  useEffect(() => {
    const t = setTimeout(() => setForceReady(true), 4000)
    return () => clearTimeout(t)
  }, [])

  if (started) return null
  const ready = forceReady || (!active && progress >= 100)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink text-cream">
      <div className="text-5xl">🏠</div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
      <p className="max-w-md px-6 text-center text-sm text-cream/70">
        My portfolio is a house. Walk in, poke around, open the fridge.
      </p>

      {!ready ? (
        <div className="flex w-64 flex-col items-center gap-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/15">
            <div className="h-full rounded-full bg-amberish transition-all duration-300" style={{ width: `${Math.max(progress, 6)}%` }} />
          </div>
          <span className="text-xs tabular-nums text-cream/60">Loading the furniture… {Math.round(progress)}%</span>
        </div>
      ) : (
        <button
          onClick={start}
          className="animate-rise rounded-full bg-amberish px-8 py-3 font-display text-lg font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
        >
          Step Inside
        </button>
      )}

      <p className="px-6 text-center text-xs text-cream/50">
        {isTouch ? 'Tap the glowing circles to move · swipe to look around' : 'WASD to walk · mouse to look · E to interact · Esc frees the cursor'}
      </p>
    </div>
  )
}
