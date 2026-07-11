import { player } from './playerState'
import { roomAt } from '../scene/houseLayout'
import { useAppStore } from '../store/useAppStore'

/** push the player's current room into the store (only on change) */
export function syncRoom(): void {
  const r = roomAt(player.position.x, player.position.z)
  const s = useAppStore.getState()
  if (s.room !== r) s.setRoom(r)
}
