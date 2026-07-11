import type { Vector3 } from 'three'

export interface ColBox {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

const PLAYER_RADIUS = 0.35

function blocked(x: number, z: number, boxes: ColBox[], r: number): boolean {
  for (const b of boxes) {
    if (x > b.minX - r && x < b.maxX + r && z > b.minZ - r && z < b.maxZ + r) return true
  }
  return false
}

/**
 * Axis-separated move-and-slide: the player is a circle on the XZ plane,
 * every obstacle an axis-aligned box. Trying X and Z independently lets the
 * player glide along walls instead of sticking to them.
 */
export function moveWithCollision(pos: Vector3, dx: number, dz: number, boxes: ColBox[]): void {
  const nx = pos.x + dx
  if (!blocked(nx, pos.z, boxes, PLAYER_RADIUS)) pos.x = nx
  const nz = pos.z + dz
  if (!blocked(pos.x, nz, boxes, PLAYER_RADIUS)) pos.z = nz
}
