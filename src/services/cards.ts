import { getJSON } from './http'
import config from '../data/config.json'

/**
 * Real shuffled playing cards via the Deck of Cards API (free, no key).
 * One request draws 9 unique cards: 5 for the "memorize one" spread and 4
 * completely different ones for the reveal — the classic vanishing trick.
 */

export interface Card {
  code: string
  image: string
  value: string
  suit: string
}

interface DeckDraw {
  success: boolean
  cards: Array<{ code: string; image: string; value: string; suit: string }>
}

export async function drawTrick(): Promise<{ spread: Card[]; reveal: Card[] } | null> {
  const d = await getJSON<DeckDraw>(config.apis.deck)
  if (!d?.success || d.cards.length < 9) return null
  const cards = d.cards.map((c) => ({ code: c.code, image: c.image, value: c.value, suit: c.suit }))
  return { spread: cards.slice(0, 5), reveal: cards.slice(5, 9) }
}
