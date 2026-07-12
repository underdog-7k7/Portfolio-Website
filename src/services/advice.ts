import { getJSON } from './http'
import config from '../data/config.json'

/** Fortune-cookie slips via the Advice Slip API (free, no key). */

interface Slip {
  slip: { id: number; advice: string }
}

/** their edge cache holds results for ~2s — bust it so every cookie differs */
export async function getAdvice(): Promise<string | null> {
  const d = await getJSON<Slip>(`${config.apis.advice}?t=${Date.now()}`, { cache: 'no-store' })
  return d?.slip?.advice ?? null
}
