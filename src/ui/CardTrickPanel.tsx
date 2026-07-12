import { useEffect, useState } from 'react'
import type { PanelComponent } from './OverlayRoot'
import { drawTrick, type Card } from '../services/cards'

type Phase = 'loading' | 'memorize' | 'shuffling' | 'reveal' | 'explained' | 'error'

/**
 * Coffee-table card trick with real shuffled cards from the Deck of Cards
 * API. The classic: memorize one of five, we "shuffle", and YOUR card is
 * gone — because all five changed and your eyes only tracked one.
 */
export function CardTrickPanel({ Panel }: { Panel: PanelComponent }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [spread, setSpread] = useState<Card[]>([])
  const [reveal, setReveal] = useState<Card[]>([])

  const deal = async () => {
    setPhase('loading')
    const t = await drawTrick()
    if (!t) {
      setPhase('error')
      return
    }
    setSpread(t.spread)
    setReveal(t.reveal)
    setPhase('memorize')
  }

  useEffect(() => {
    void deal()
  }, [])

  const shuffle = () => {
    setPhase('shuffling')
    setTimeout(() => setPhase('reveal'), 1400)
  }

  const cardImg = (c: Card, i: number, faceDown = false) => (
    <img
      key={c.code}
      src={faceDown ? 'https://deckofcardsapi.com/static/img/back.png' : c.image}
      alt={faceDown ? 'card back' : `${c.value} of ${c.suit}`}
      className={`w-14 rounded shadow-lg transition-transform ${faceDown ? 'animate-pulse' : ''}`}
      style={{ transform: `rotate(${(i - 2) * 4}deg) translateY(${Math.abs(i - 2) * 3}px)` }}
      draggable={false}
    />
  )

  return (
    <Panel title="🃏 A Little Card Trick">
      {phase === 'loading' && <p className="animate-pulse text-sm text-cream/50">Shuffling a fresh deck…</p>}
      {phase === 'error' && (
        <div className="rounded-xl bg-cream/5 p-4 text-sm text-cream/70">
          The deck fell off the table (card API unreachable).{' '}
          <button onClick={() => void deal()} className="text-amberish underline">
            Pick it up and retry
          </button>
        </div>
      )}

      {phase === 'memorize' && (
        <>
          <p className="mb-3 text-sm text-cream/80">
            My twin taught me this one. <span className="font-semibold text-amberish">Pick ONE card and memorize it.</span> Don't tell me which.
          </p>
          <div className="flex justify-center gap-1 py-2">{spread.map((c, i) => cardImg(c, i))}</div>
          <button
            onClick={shuffle}
            className="mt-4 w-full rounded-full bg-amberish py-2 font-display text-sm font-bold text-ink transition hover:brightness-110"
          >
            Got it, shuffle! 🪄
          </button>
        </>
      )}

      {phase === 'shuffling' && (
        <>
          <p className="mb-3 text-center text-sm text-cream/70">Watching your card very carefully…</p>
          <div className="flex justify-center gap-1 py-2">{spread.map((c, i) => cardImg(c, i, true))}</div>
        </>
      )}

      {(phase === 'reveal' || phase === 'explained') && (
        <>
          <p className="mb-3 text-sm text-cream/80">
            And… <span className="font-semibold text-amberish">your card is GONE.</span> 🪄
          </p>
          <div className="flex justify-center gap-1.5 py-2">{reveal.map((c, i) => cardImg(c, i))}</div>
          {phase === 'reveal' ? (
            <button
              onClick={() => setPhase('explained')}
              className="mt-4 w-full rounded-full bg-cream/10 py-2 text-xs text-cream/85 transition hover:bg-cream/20"
            >
              wait… HOW?!
            </button>
          ) : (
            <p className="mt-4 rounded-xl bg-cream/5 p-3 text-xs leading-relaxed text-cream/65">
              All five cards changed — your eyes only tracked the one you memorized. 😉 Attention is expensive; ask any transformer.
            </p>
          )}
          <button
            onClick={() => void deal()}
            className="mt-3 w-full rounded-full bg-amberish py-2 font-display text-sm font-bold text-ink transition hover:brightness-110"
          >
            deal again 🃏
          </button>
        </>
      )}
    </Panel>
  )
}
