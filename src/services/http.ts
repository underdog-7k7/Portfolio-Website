/**
 * Shared fetch helper for all live-API features. Every feature in the house
 * must degrade silently — this returns `null` on ANY failure (network, HTTP
 * status, JSON parse, timeout) and never throws.
 */
export async function getJSON<T>(url: string, init?: RequestInit, timeoutMs = 8000): Promise<T | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
