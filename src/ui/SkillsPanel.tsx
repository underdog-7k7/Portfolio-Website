import type { PanelComponent } from './OverlayRoot'
import skills from '../data/skills.json'

/**
 * Mastery tiers instead of fake percentages — a tool is either something I
 * ship with today, have shipped with, or once shipped with. The `level`
 * field in skills.json still drives the tier (and the constellation node
 * brightness), it just never renders as a bar.
 */
function tier(level: number): { label: string; cls: string; dot: string } {
  if (level >= 90) return { label: 'daily driver', cls: 'bg-amberish/15 text-amberish', dot: 'bg-amberish' }
  if (level >= 80) return { label: 'production-proven', cls: 'bg-emerald-400/15 text-emerald-300', dot: 'bg-emerald-400' }
  if (level >= 70) return { label: 'comfortable', cls: 'bg-sky-400/15 text-sky-300', dot: 'bg-sky-400' }
  return { label: 'past life', cls: 'bg-purple-400/15 text-purple-300', dot: 'bg-purple-400' }
}

export function SkillsPanel({ categoryId, Panel }: { categoryId: string; Panel: PanelComponent }) {
  const cat = skills.categories.find((c) => c.id === categoryId)
  if (!cat) return null
  const others = skills.categories.filter((c) => c.id !== categoryId)
  return (
    <Panel title={cat.title}>
      <p className="mb-4 text-sm italic text-cream/60">{cat.blurb}</p>
      <ul className="space-y-2">
        {cat.items.map((item) => {
          const t = tier(item.level)
          return (
            <li key={item.name} className="rounded-xl bg-cream/5 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                  {item.name}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${t.cls}`}>{t.label}</span>
              </div>
              <p className="mt-0.5 pl-3.5 text-xs text-cream/55">{item.note}</p>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-center text-[10px] leading-relaxed text-cream/40">
         Bigger stars in the hologram just mean I reach for them more often
      </p>
      {others.length > 0 && (
        <div className="mt-3 border-t border-cream/10 pt-3 text-center text-[11px] text-cream/50">
          also in the constellation: {others.map((o) => o.title).join(' · ')}
        </div>
      )}
    </Panel>
  )
}
