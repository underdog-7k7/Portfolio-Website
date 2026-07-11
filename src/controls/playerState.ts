import { Vector3 } from 'three'

/**
 * Mutable player state shared by both control schemes and the interaction
 * system. Kept outside React state on purpose: it changes every frame and
 * must never trigger re-renders.
 */
export const player = {
  position: new Vector3(0, 0, 7.5), // y ignored — feet on the floor
}

export const SPAWN: [number, number, number] = [0, 0, 7.5]

// debug handle for automated smoke tests (headless browser reads this)
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).__player = player
}
