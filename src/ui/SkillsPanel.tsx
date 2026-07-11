import type { PanelComponent } from './OverlayRoot'
import skills from '../data/skills.json'

export function SkillsPanel({ categoryId, Panel }: { categoryId: string; Panel: PanelComponent }) {
  const cat = skills.categories.find((c) => c.id === categoryId)
  if (!cat) return null
  return (
    <Panel title={cat.title}>
      <p className="mb-4 text-sm italic text-cream/60">{cat.blurb}</p>
      <ul className="space-y-3">
        {cat.items.map((item) => (
          <li key={item.name}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm font-semibold">{item.name}</span>
              <span className="text-xs tabular-nums text-cream/50">{item.level}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
              <div className="h-full rounded-full bg-gradient-to-r from-amberish to-orange-400" style={{ width: `${item.level}%` }} />
            </div>
            <p className="mt-0.5 text-xs text-cream/50">{item.note}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
