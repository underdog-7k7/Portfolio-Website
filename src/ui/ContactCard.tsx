import { useState, type FormEvent } from 'react'
import type { PanelComponent } from './OverlayRoot'
import profile from '../data/profile.json'
import config from '../data/config.json'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** contact form styled as a recipe card — posts to Getform (static-host friendly) */
export function ContactCard({ Panel }: { Panel: PanelComponent }) {
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
    'w-full rounded-lg border border-ink/20 bg-white/70 px-3 py-2 text-sm text-ink placeholder-ink/35 outline-none focus:border-amberish'

  return (
    <Panel title="Let's Cook Something Together">
      <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-cream p-4 text-ink">
        <p className="mb-1 font-display text-sm font-bold">📇 Recipe: A Great Collaboration</p>
        <p className="mb-3 text-xs text-ink/60">Prep time: 1 min · Serves: the both of us</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <span className={label}>I'll need your name</span>
            <input name="name" required placeholder="Jane Developer" className={field} />
          </div>
          <div>
            <span className={label}>Your email</span>
            <input name="email" type="email" required placeholder="jane@dev.io" className={field} />
          </div>
          <div>
            <span className={label}>Instructions — your message</span>
            <textarea name="message" required rows={3} placeholder="Mix ideas thoroughly, ship at 200°C…" className={field} />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-lg bg-ink py-2.5 font-display text-sm font-bold text-cream transition hover:bg-ink/85 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent! I’ll get back to you 🍽️' : 'Send it to the kitchen 🍳'}
          </button>
          {status === 'error' && (
            <p className="text-xs text-red-700">
              Hmm, the oven timer failed. Email me directly instead:{' '}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
          )}
        </form>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={import.meta.env.BASE_URL + profile.resume}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-amberish px-4 py-1.5 text-xs font-semibold text-ink"
        >
          📄 Resume
        </a>
        {profile.socials.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="rounded-full border border-cream/25 px-3 py-1.5 text-xs text-cream/85 hover:bg-cream/10">
            {s.label} ↗
          </a>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-cream/45">{profile.location}</p>
    </Panel>
  )
}
