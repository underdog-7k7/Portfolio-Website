import { useState, type FormEvent } from 'react'
import type { PanelComponent } from './OverlayRoot'
import profile from '../data/profile.json'
import config from '../data/config.json'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** the kitchen island: visitors pitch a project / collaboration "recipe" */
export function IdeaPanel({ Panel }: { Panel: PanelComponent }) {
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch(config.formEndpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`form endpoint returned ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const label = 'mb-1 block font-display text-[11px] font-bold uppercase tracking-wider text-ink/60'
  const field =
    'w-full rounded-lg border border-ink/20 bg-white/80 px-3 py-2 text-sm text-ink placeholder-ink/35 outline-none focus:border-amberish'

  return (
    <Panel title="🍳 Let's Cook Something Together">
      <p className="mb-3 text-sm text-cream/70">
        Got an app idea, a collab, a hackathon, a "what if…"? Leave the recipe on the island on this cook board.And I'll take a look once Im back home.
      </p>
      <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-[#fff8b8] p-4 text-ink shadow-[4px_6px_0_rgba(0,0,0,0.25)]" style={{ transform: 'rotate(-0.6deg)' }}>
        <form onSubmit={submit} className="space-y-3">
          {/* tag so idea-board notes are distinguishable from contact messages in Getform */}
          <input type="hidden" name="formType" value="idea-board" />
          <div>
            <span className={label}>What do you have in mind?</span>
            <input name="idea_title" required placeholder="Smart plant waterer, but for cats" className={field} />
          </div>
          <div>
            <span className={label}>A bit more about it</span>
            <textarea name="idea_details" required rows={4} placeholder="Here's what I'm thinking…" className={field} />
          </div>
          <div>
            <span className={label}>Your email (so I can reply)</span>
            <input name="email" type="email" required placeholder="hey_you@somewhere.dev" className={field} />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-lg bg-ink py-2.5 font-display text-sm font-bold text-cream transition hover:bg-ink/85 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending to the kitchen…' : status === 'sent' ? 'Order up! Let’s talk soon 🍽️' : 'Send it to the kitchen 🍳'}
          </button>
          {status === 'error' && (
            <p className="text-xs text-red-700">
              The oven timer failed — email me instead:{' '}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
          )}
        </form>
      </div>
    </Panel>
  )
}
