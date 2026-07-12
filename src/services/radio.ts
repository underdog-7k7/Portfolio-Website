import { getJSON } from './http'
import config from '../data/config.json'

/**
 * Live internet radio via the community Radio-Browser API (free, no key).
 * We only ever ask for https streams that passed their last health check,
 * ordered by community votes. Results are cached per tag for the session.
 */

export interface Station {
  uuid: string
  name: string
  url: string
  tag: string
}

interface RBStation {
  stationuuid: string
  name: string
  url_resolved: string
  lastcheckok: number
}

export const RADIO_PRESETS = [
  { tag: 'lofi', label: 'Lo-fi beats', emoji: '🌙' },
  { tag: 'jazz', label: 'Late-night jazz', emoji: '🎷' },
  { tag: 'synthwave', label: 'Synthwave', emoji: '🌆' },
  { tag: 'chillout', label: 'Chillout', emoji: '🛋️' },
] as const

const cache = new Map<string, Station[] | null>()

export async function getStations(tag: string): Promise<Station[] | null> {
  if (cache.has(tag)) return cache.get(tag) ?? null
  const url = `${config.apis.radio}?tag=${encodeURIComponent(tag)}&is_https=true&lastcheckok=1&hidebroken=true&order=votes&reverse=true&limit=5`
  const data = await getJSON<RBStation[]>(url)
  const stations =
    data?.filter((s) => s.url_resolved?.startsWith('https://')).map((s) => ({
      uuid: s.stationuuid,
      name: s.name.trim(),
      url: s.url_resolved,
      tag,
    })) ?? null
  const result = stations && stations.length > 0 ? stations : null
  cache.set(tag, result)
  return result
}
