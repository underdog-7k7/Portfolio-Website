import type { PanelComponent } from './OverlayRoot'
import journey from '../data/journey.json'

const TYPE_STYLES: Record<string, { dot: string; chip: string; label: string }> = {
  education: { dot: 'bg-sky-400', chip: 'bg-sky-400/15 text-sky-300', label: 'Education' },
  internship: { dot: 'bg-amberish', chip: 'bg-amberish/15 text-amberish', label: 'Internship' },
  work: { dot: 'bg-emerald-400', chip: 'bg-emerald-400/15 text-emerald-300', label: 'Full-time' },
  future: { dot: 'bg-purple-400', chip: 'bg-purple-400/15 text-purple-300', label: 'Next' },
}

/** the full story behind the metro map on the gallery wall */
export function JourneyPanel({ Panel }: { Panel: PanelComponent }) {
  return (
    <Panel title="🚇 The Journey So Far">
      <ol className="relative ml-2 space-y-5 border-l-2 border-amberish/30 pl-5">
        {journey.stops.map((s) => {
          const st = TYPE_STYLES[s.type] ?? TYPE_STYLES.work
          return (
            <li key={s.year + s.title} className="relative">
              <span className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-ink ${st.dot}`} />
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-sm font-bold text-cream">{s.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.chip}`}>{st.label}</span>
              </div>
              <p className="text-xs font-semibold text-amberish/90">
                {s.org} · {s.year}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-cream/70">{s.detail}</p>
            </li>
          )
        })}
      </ol>

      <h3 className="mb-2 mt-6 font-display text-sm font-bold text-amberish">🏅 Certifications & Achievements</h3>
      <ul className="space-y-1.5">
        {journey.certifications.map((c) => (
          <li key={c.name} className="flex items-baseline justify-between gap-2 rounded-lg bg-cream/5 px-3 py-1.5">
            <span className="text-xs text-cream/85">{c.name}</span>
            <span className="shrink-0 text-[10px] tabular-nums text-cream/45">{c.year}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
