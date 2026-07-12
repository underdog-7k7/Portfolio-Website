import { getJSON } from './http'
import config from '../data/config.json'

/**
 * Latest public repos via the GitHub REST API (no auth — 60 req/h per IP,
 * so the result is cached for the whole session).
 */

export interface Repo {
  name: string
  description: string | null
  language: string | null
  stars: number
  pushedAt: string
  url: string
}

interface GHRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  pushed_at: string
  html_url: string
  fork: boolean
}

export function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`
  return `${Math.floor(s / (86400 * 30))}mo ago`
}

let promise: Promise<Repo[] | null> | null = null

export function getRepos(): Promise<Repo[] | null> {
  promise ??= getJSON<GHRepo[]>(config.apis.github).then(
    (d) =>
      d
        ?.filter((r) => !r.fork)
        .map((r) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          pushedAt: r.pushed_at,
          url: r.html_url,
        })) ?? null,
  )
  return promise
}
