import { useState, type FormEvent } from 'react'
import type { PanelComponent } from './OverlayRoot'
import profile from '../data/profile.json'
import config from '../data/config.json'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** contact form styled as a note pinned to the kitchen corkboard — posts to Getform (static-host friendly) */
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
    <Panel title="📮 Drop Me a Message">
      <p className="mb-3 text-sm text-cream/70">
        Pin a note on my board, a question, a collab, or just a hello. It lands straight in my inbox.
      </p>
      <div className="relative rounded-2xl bg-cream p-4 pt-5 text-ink shadow-[4px_6px_0_rgba(0,0,0,0.25)]" style={{ transform: 'rotate(-0.6deg)' }}>
        {/* push pin */}
        <span className="absolute left-1/2 top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-red-600 shadow-[0_2px_3px_rgba(0,0,0,0.4)]" />
        <form onSubmit={submit} className="space-y-3">
          <div>
            <span className={label}>Your name</span>
            <input name="name" required placeholder="Jane Developer" className={field} />
          </div>
          <div>
            <span className={label}>Your email</span>
            <input name="email" type="email" required placeholder="jane@dev.io" className={field} />
          </div>
          <div>
            <span className={label}>The note</span>
            <textarea name="message" required rows={3} placeholder="Hey Animesh, let's talk about…" className={field} />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-lg bg-ink py-2.5 font-display text-sm font-bold text-cream transition hover:bg-ink/85 disabled:opacity-50"
          >
            {status === 'sending' ? 'Pinning…' : status === 'sent' ? 'Pinned! I’ll get back to you 📮' : 'Pin it to the board 📌'}
          </button>
          {status === 'error' && (
            <p className="text-xs text-red-700">
              The pin broke. Email me directly instead:{' '}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
          )}
        </form>
      </div>

      {/* <div className="mt-4 flex flex-wrap items-center gap-2">
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
      </div> */}
      <p className="mt-3 text-center text-[11px] text-cream/45">{profile.location}</p>
    </Panel>
  )
}
