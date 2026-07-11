import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { PanelComponent } from './OverlayRoot'
import { respond, type ChatTurn } from '../agent/respond'

/**
 * Chat with mini-Animesh. Currently backed by the canned stub in
 * src/agent/respond.ts — swap that file's implementation to plug in the real
 * AI agent; this UI won't need to change.
 */
export function AgentPanel({ Panel }: { Panel: PanelComponent }) {
  const [messages, setMessages] = useState<ChatTurn[]>([
    { role: 'bot', text: "Hey, welcome to my house! I'm Animesh(kind of) — an AI Persona of the real one." },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || thinking) return
    const history = [...messages, { role: 'user' as const, text }]
    setMessages(history)
    setInput('')
    setThinking(true)
    const reply = await respond(text, history)
    setMessages((m) => [...m, { role: 'bot', text: reply }])
    setThinking(false)
  }

  return (
    <Panel title="My AI Persona">
      <p className="mb-3 rounded-lg bg-amberish/10 px-3 py-1.5 text-[11px] text-amberish/90">
        AI agent integration coming soon — for now I run on good intentions and canned answers.
      </p>
      <div ref={scroller} className="mb-3 flex max-h-56 min-h-[10rem] flex-col gap-2 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              m.role === 'bot' ? 'self-start rounded-bl-sm bg-cream/10 text-cream/90' : 'self-end rounded-br-sm bg-amberish text-ink'
            }`}
          >
            {m.text}
          </div>
        ))}
        {thinking && (
          <div className="max-w-[85%] animate-pulse self-start rounded-2xl rounded-bl-sm bg-cream/10 px-3 py-2 text-sm text-cream/50">
            thinking…
          </div>
        )}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say hi…"
          className="min-w-0 flex-1 rounded-full border border-cream/20 bg-cream/5 px-4 py-2 text-sm text-cream placeholder-cream/35 outline-none focus:border-amberish"
        />
        <button
          type="submit"
          disabled={thinking || !input.trim()}
          className="rounded-full bg-amberish px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </Panel>
  )
}
