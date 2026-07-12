import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getAdvice } from '../services/advice'

type Phase = 'cracking' | 'open' | 'error'

/** the kitchen cookie jar: crack a fortune cookie, get an Advice Slip */
export function FortuneToast() {
  const close = useAppStore((s) => s.closeOverlay)
  const [phase, setPhase] = useState<Phase>('cracking')
  const [advice, setAdvice] = useState<string | null>(null)

  const crack = useCallback(async () => {
    setPhase('cracking')
    setAdvice(null)
    const [slip] = await Promise.all([getAdvice(), new Promise((r) => setTimeout(r, 700))])
    if (slip) {
      setAdvice(slip)
      setPhase('open')
    } else setPhase('error')
  }, [])

  useEffect(() => {
    void crack()
  }, [crack])

  return (
    <div className="pointer-events-auto fixed inset-x-4 bottom-8 z-40 mx-auto max-w-md animate-rise rounded-2xl bg-ink/95 p-5 text-cream shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-start justify-between">
        <span className="font-display text-sm font-bold text-amberish">🥠 Fortune cookie</span>
        <button onClick={close} aria-label="Close" className="rounded-full bg-cream/10 px-2 text-sm text-cream/80 hover:bg-cream/20">
          ✕
        </button>
      </div>
      {phase === 'cracking' && (
        <p className="animate-pulse py-2 text-center text-2xl">
          🥠 <span className="text-sm text-cream/60">crack…</span>
        </p>
      )}
      {phase === 'error' && <p className="text-sm text-cream/70">This cookie is all cookie, no fortune (the advice jar is unreachable). Try another.</p>}
      {phase === 'open' && advice && (
        <div className="rounded-lg bg-[#fdf6e3] px-4 py-3 shadow-inner" style={{ transform: 'rotate(-0.4deg)' }}>
          <p className="text-center font-mono text-sm italic text-ink">“{advice}”</p>
        </div>
      )}
      <button onClick={() => void crack()} className="mt-3 rounded-full bg-cream/10 px-4 py-1.5 text-xs text-cream/85 hover:bg-cream/20">
        another cookie 🥠
      </button>
    </div>
  )
}
