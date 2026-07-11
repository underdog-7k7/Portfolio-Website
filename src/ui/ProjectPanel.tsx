import type { PanelComponent } from './OverlayRoot'
import projectsData from '../data/projects.json'

export function ProjectPanel({ projectId, Panel }: { projectId: string; Panel: PanelComponent }) {
  const p = projectsData.projects.find((x) => x.id === projectId)
  if (!p) return null
  return (
    <Panel title={p.title}>
      <img src={import.meta.env.BASE_URL + p.image} alt={p.title} className="mb-3 max-h-44 w-full rounded-xl object-cover" />
      <p className="font-display text-sm font-semibold text-cream/90">{p.subtitle}</p>
      <p className="mb-2 text-xs text-cream/50">
        {p.category} · {p.date}
      </p>
      <p className="mb-3 text-sm leading-relaxed text-cream/80">{p.description}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span key={t} className="rounded-full bg-cream/10 px-2.5 py-0.5 text-[11px] text-cream/80">
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {p.github && (
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-amberish px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            View on GitHub ↗
          </a>
        )}
        {'extraLinks' in p &&
          p.extraLinks?.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cream/25 px-3 py-2 text-xs text-cream/85 transition hover:bg-cream/10"
            >
              {l.label} ↗
            </a>
          ))}
      </div>
    </Panel>
  )
}
