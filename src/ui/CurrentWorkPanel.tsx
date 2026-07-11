import type { PanelComponent } from './OverlayRoot'
import current from '../data/current.json'

const STATUS_COLORS: Record<string, string> = {
  'In progress': 'bg-blue-500/20 text-blue-300',
  Ongoing: 'bg-purple-500/20 text-purple-300',
  Shipping: 'bg-emerald-500/20 text-emerald-300',
}

/** the workshop bench panel — whatever I'm actively building right now */
export function CurrentWorkPanel({ Panel }: { Panel: PanelComponent }) {
  return (
    <Panel title="🔧 Now Building">
      <p className="mb-4 text-sm italic text-cream/60">{current.headline}</p>
      <ul className="space-y-4">
        {current.items.map((item) => (
          <li key={item.title} className="rounded-xl bg-cream/5 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-display text-sm font-bold text-cream">{item.title}</span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[item.status] ?? 'bg-cream/10 text-cream/70'}`}>
                {item.status}
              </span>
            </div>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${item.progress}%` }} />
            </div>
            <p className="text-xs leading-relaxed text-cream/70">{item.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span key={t} className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] text-cream/70">
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-[11px] text-cream/45">{current.note}</p>
    </Panel>
  )
}
