import { useState } from 'react'
import type { PanelComponent } from './OverlayRoot'
import { getTrivia, type TriviaQ } from '../services/trivia'

type Phase = 'attract' | 'loading' | 'playing' | 'done' | 'error'

const RANKS = ['NPC 💀', 'Script Kiddie 📜', 'Junior Dev 🐣', 'Mid-level Dev 💼', 'Senior Dev 🧙', '10x Engineer 🚀']

/**
 * The workshop arcade cabinet: five computer-science questions from the
 * Open Trivia DB, one at a time, with a snarky rank at the end.
 */
export function ArcadePanel({ Panel }: { Panel: PanelComponent }) {
  const [phase, setPhase] = useState<Phase>('attract')
  const [questions, setQuestions] = useState<TriviaQ[]>([])
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const start = async () => {
    setPhase('loading')
    const qs = await getTrivia()
    if (!qs) {
      setPhase('error')
      return
    }
    setQuestions(qs)
    setQi(0)
    setPicked(null)
    setScore(0)
    setPhase('playing')
  }

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === questions[qi].correct) setScore((s) => s + 1)
  }

  const next = () => {
    if (qi + 1 >= questions.length) setPhase('done')
    else {
      setQi(qi + 1)
      setPicked(null)
    }
  }

  const q = questions[qi]
  const crt =
    'rounded-xl border border-emerald-400/25 bg-[#04120a] p-4 font-mono text-emerald-300 shadow-[inset_0_0_30px_rgba(16,185,129,0.12)] [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0px,rgba(0,0,0,0.25)_1px,transparent_1px,transparent_3px)]'

  return (
    <Panel title="🕹 DEV TRIVIA">
      <div className={crt}>
        {phase === 'attract' && (
          <div className="py-6 text-center">
            <p className="text-lg font-bold tracking-widest">DEV·TRIVIA</p>
            <p className="mt-1 text-[11px] text-emerald-300/60">5 questions · Ez-pz · no lifelines</p>
            <button
              onClick={() => void start()}
              className="mt-5 animate-pulse rounded border border-emerald-400/50 px-5 py-2 text-sm font-bold tracking-widest hover:bg-emerald-400/10"
            >
              ▶ PRESS START
            </button>
          </div>
        )}
        {phase === 'loading' && <p className="animate-pulse py-10 text-center text-sm">LOADING CARTRIDGE…</p>}
        {phase === 'error' && (
          <div className="py-8 text-center">
            <p className="text-sm">CARTRIDGE READ ERROR</p>
            <p className="mt-1 text-[11px] text-emerald-300/60">the trivia server didn't answer — blow on it and retry</p>
            <button onClick={() => void start()} className="mt-4 rounded border border-emerald-400/50 px-4 py-1.5 text-xs hover:bg-emerald-400/10">
              ↻ RETRY
            </button>
          </div>
        )}
        {phase === 'playing' && q && (
          <>
            <div className="mb-2 flex items-center justify-between text-[11px] text-emerald-300/60">
              <span>
                Q{qi + 1}/{questions.length} · {q.difficulty}
              </span>
              <span>SCORE {score}</span>
            </div>
            <p className="mb-3 text-sm leading-relaxed">{q.question}</p>
            <div className="space-y-1.5">
              {q.answers.map((a, i) => {
                let style = 'border-emerald-400/25 hover:bg-emerald-400/10'
                if (picked !== null) {
                  if (i === q.correct) style = 'border-emerald-300 bg-emerald-400/20'
                  else if (i === picked) style = 'border-red-400/70 bg-red-500/15 text-red-300'
                  else style = 'border-emerald-400/10 opacity-50'
                }
                return (
                  <button key={i} onClick={() => pick(i)} className={`block w-full rounded border px-3 py-1.5 text-left text-xs transition ${style}`}>
                    {String.fromCharCode(65 + i)}. {a}
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <button onClick={next} className="mt-3 w-full rounded border border-emerald-400/50 py-1.5 text-xs font-bold tracking-widest hover:bg-emerald-400/10">
                {qi + 1 >= questions.length ? '▶ FINISH' : '▶ NEXT'}
              </button>
            )}
          </>
        )}
        {phase === 'done' && (
          <div className="py-6 text-center">
            <p className="text-[11px] tracking-widest text-emerald-300/60">FINAL SCORE</p>
            <p className="mt-1 text-3xl font-bold">
              {score}/{questions.length}
            </p>
            <p className="mt-2 text-sm">
              RANK: <span className="font-bold">{RANKS[score]}</span>
            </p>
            <button onClick={() => void start()} className="mt-5 rounded border border-emerald-400/50 px-5 py-2 text-xs font-bold tracking-widest hover:bg-emerald-400/10">
              ↻ PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-[10px] text-cream/40">questions live from the Open Trivia DB</p>
    </Panel>
  )
}
