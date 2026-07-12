import { useEffect, useState } from 'react'
import type { PanelComponent } from './OverlayRoot'
import { getRepos, timeAgo, type Repo } from '../services/github'
import profile from '../data/profile.json'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Kotlin: '#A97BFF',
  Java: '#b07219',
  'Jupyter Notebook': '#DA5B0B',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
}

/** the workstation monitor: my latest public GitHub activity, live */
export function GitHubPanel({ Panel }: { Panel: PanelComponent }) {
  const [repos, setRepos] = useState<Repo[] | null | undefined>(undefined)
  const ghUrl = profile.socials.find((s) => s.label === 'GitHub')?.url ?? 'https://github.com'

  useEffect(() => {
    let live = true
    void getRepos().then((r) => live && setRepos(r))
    return () => {
      live = false
    }
  }, [])

  return (
    <Panel title="⚡ Fresh Off the Keyboard">
      <p className="mb-3 text-sm text-cream/70">Straight from the GitHub API, whatever I pushed most recently, no curation.</p>
      {repos === undefined && <p className="animate-pulse text-sm text-cream/50">git fetch origin…</p>}
      {repos === null && (
        <div className="rounded-xl bg-cream/5 p-4 text-sm text-cream/70">
          GitHub is rate-limiting the feed right now see everything directly on{' '}
          <a href={ghUrl} target="_blank" rel="noreferrer" className="text-amberish underline">
            my profile ↗
          </a>
        </div>
      )}
      {repos && (
        <ul className="space-y-2">
          {repos.map((r) => (
            <li key={r.name}>
              <a href={r.url} target="_blank" rel="noreferrer" className="block rounded-xl bg-cream/5 px-3 py-2.5 transition hover:bg-cream/10">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-display text-sm font-bold text-amberish">{r.name}</span>
                  <span className="shrink-0 text-[10px] tabular-nums text-cream/45">pushed {timeAgo(r.pushedAt)}</span>
                </div>
                {r.description && <p className="mt-0.5 line-clamp-2 text-xs text-cream/65">{r.description}</p>}
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-cream/50">
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LANG_COLORS[r.language] ?? '#8b949e' }} />
                      {r.language}
                    </span>
                  )}
                  {r.stars > 0 && <span>★ {r.stars}</span>}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
      <a
        href={ghUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block rounded-full bg-amberish px-4 py-2 text-center font-display text-xs font-bold text-ink transition hover:brightness-110"
      >
        full profile on GitHub ↗
      </a>
    </Panel>
  )
}
