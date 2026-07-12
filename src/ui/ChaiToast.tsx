import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import config from '../data/config.json'

interface Joke {
  type: 'single' | 'twopart'
  joke?: string
  setup?: string
  delivery?: string
}

/** chai on the balcony = a safe-for-work programming joke with every sip (JokeAPI) */
export function ChaiToast() {
  const close = useAppStore((s) => s.closeOverlay)
  const [joke, setJoke] = useState<Joke | null>(null)
  const [error, setError] = useState(false)

  const fetchJoke = useCallback(async () => {
    setJoke(null)
    setError(false)
    try {
      const res = await fetch(config.jokeApi)
      if (!res.ok) throw new Error(`joke API returned ${res.status}`)
      setJoke(await res.json())
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    void fetchJoke()
  }, [fetchJoke])

  return (
    <div className="pointer-events-auto fixed inset-x-4 bottom-8 z-40 mx-auto max-w-md animate-rise rounded-2xl bg-ink/95 p-5 text-cream shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-start justify-between">
        <span className="font-display text-sm font-bold text-amberish">☕ Chai break — one joke per sip</span>
        <button onClick={close} aria-label="Close" className="rounded-full bg-cream/10 px-2 text-sm text-cream/80 hover:bg-cream/20">
          ✕
        </button>
      </div>
      {error ? (
        <p className="text-sm text-cream/70">The chai's gone cold , the joke kettle is unreachable. Try again in a bit.</p>
      ) : !joke ? (
        <p className="animate-pulse text-sm text-cream/60">Brewing…</p>
      ) : joke.type === 'twopart' ? (
        <>
          <p className="text-sm text-cream/90">{joke.setup}</p>
          <p className="mt-2 text-sm font-semibold text-amberish">{joke.delivery}</p>
        </>
      ) : (
        <p className="text-sm text-cream/90">{joke.joke}</p>
      )}
      <button onClick={() => void fetchJoke()} className="mt-3 rounded-full bg-cream/10 px-4 py-1.5 text-xs text-cream/85 hover:bg-cream/20">
        another sip ☕
      </button>
    </div>
  )
}
