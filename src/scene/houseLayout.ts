import type { ColBox } from '../controls/collision'

/**
 * Single source of truth for the house geometry.
 * Coordinate system: y-up, 1 unit = 1 metre.
 *
 *   z-9 ─────────────────────────── north (kitchen)
 *        │            KITCHEN            │
 *   z 0  ├───────┬─── door ───┬──────────┤
 *        │ LIVING│            │ GALLERY  │
 *   BALC ═ door  │  HALLWAY   │          │
 *        │       │            │          │
 *   z 9  ─────────── spawn ────────────── south (front door)
 *       x-15.5  x-11  x-2.5  x2.5      x11
 */
export const WALL_H = 3.2
export const WALL_T = 0.25
export const DOOR_H = 2.2
export const EYE = 1.55

export interface WallSeg {
  pos: [number, number, number]
  size: [number, number, number]
  /** lintels above doorways don't block the player */
  collider: boolean
}

const H2 = WALL_H / 2
const LINTEL_Y = (DOOR_H + WALL_H) / 2
const LINTEL_H = WALL_H - DOOR_H

export const walls: WallSeg[] = [
  // ── outer shell ──
  { pos: [0, H2, 9], size: [22 + WALL_T, WALL_H, WALL_T], collider: true }, // south (front)
  { pos: [0, H2, -9], size: [22 + WALL_T, WALL_H, WALL_T], collider: true }, // north
  { pos: [11, H2, 0], size: [WALL_T, WALL_H, 18], collider: true }, // east
  // west wall, split around the balcony doorway (z 3.5 → 5.5)
  { pos: [-11, H2, -2.75], size: [WALL_T, WALL_H, 12.5], collider: true },
  { pos: [-11, H2, 7.25], size: [WALL_T, WALL_H, 3.5], collider: true },
  { pos: [-11, LINTEL_Y, 4.5], size: [WALL_T, LINTEL_H, 2], collider: false },
  // ── hallway west wall (living-room doorway z 3.5 → 6) ──
  { pos: [-2.5, H2, 1.75], size: [WALL_T, WALL_H, 3.5], collider: true },
  { pos: [-2.5, H2, 7.5], size: [WALL_T, WALL_H, 3], collider: true },
  { pos: [-2.5, LINTEL_Y, 4.75], size: [WALL_T, LINTEL_H, 2.5], collider: false },
  // ── hallway east wall (gallery doorway z 3.5 → 6) ──
  { pos: [2.5, H2, 1.75], size: [WALL_T, WALL_H, 3.5], collider: true },
  { pos: [2.5, H2, 7.5], size: [WALL_T, WALL_H, 3], collider: true },
  { pos: [2.5, LINTEL_Y, 4.75], size: [WALL_T, LINTEL_H, 2.5], collider: false },
  // ── north interior wall z=0 (kitchen doorway x -1.4 → 1.4) ──
  { pos: [-6.2, H2, 0], size: [9.6, WALL_H, WALL_T], collider: true },
  { pos: [6.2, H2, 0], size: [9.6, WALL_H, WALL_T], collider: true },
  { pos: [0, LINTEL_Y, 0], size: [2.8, LINTEL_H, WALL_T], collider: false },
  // ── workshop (NW corner of the kitchen wing, doorway z -7.4 → -5.2) ──
  { pos: [-6, H2, -8.2], size: [WALL_T, WALL_H, 1.6], collider: true },
  { pos: [-6, H2, -4.85], size: [WALL_T, WALL_H, 0.7], collider: true },
  { pos: [-6, LINTEL_Y, -6.3], size: [WALL_T, LINTEL_H, 2.2], collider: false },
  { pos: [-8.5, H2, -4.5], size: [5, WALL_H, WALL_T], collider: true },
]

/** balcony railing (low walls, still block the player) */
export const railings: WallSeg[] = [
  { pos: [-15.5, 0.52, 4.5], size: [0.12, 1.05, 5.12], collider: true },
  { pos: [-13.25, 0.52, 2], size: [4.62, 1.05, 0.12], collider: true },
  { pos: [-13.25, 0.52, 7], size: [4.62, 1.05, 0.12], collider: true },
]

/** furniture footprints — kept in sync with the props placed in room components */
const furniture: Array<[cx: number, cz: number, w: number, d: number]> = [
  [-7.5, 6.0, 2.6, 1.1], // sofa
  [-7.5, 4.4, 1.3, 0.65], // coffee table
  [-10.6, 1.8, 0.55, 2.2], // bookshelf
  [-7.0, 0.65, 2.4, 0.9], // workstation desk
  [-5.0, 8.45, 1.8, 0.6], // tools cabinet
  [-10.4, 8.3, 0.4, 0.4], // floor lamp
  [2.1, 7.0, 0.5, 1.4], // hallway console
  [6.5, 7.6, 2.2, 1.0], // gallery desk
  [-2.5, -8.45, 7.0, 1.1], // kitchen counter
  [2.2, -8.35, 1.1, 1.0], // fridge
  [6.5, 0.5, 3.0, 0.5], // gallery TV media console
  [-10.35, -6.8, 0.9, 2.4], // workshop bench
  [-9.4, -6.3, 0.4, 0.4], // workshop stool
  [-6.8, -8.4, 0.95, 0.9], // workshop boxes
  [-1.2, -5.2, 2.4, 1.2], // kitchen island
  [6.5, -4.5, 2.2, 2.2], // dining table
  [-14.3, 3.2, 0.5, 0.5], // telescope
  [-13.0, 5.8, 0.8, 1.7], // lounge chair
  [-15.05, 6.4, 0.5, 0.5], // planter
  [-15.05, 2.6, 0.5, 0.5], // planter
  [6.5, 3.6, 1.4, 0.5], // gallery bench
  [-2.1, 7.8, 0.4, 0.4], // hallway coat rack
  [-12.1, 5.2, 0.5, 0.5], // balcony side table
  [1.5, 5.2, 0.5, 0.5], // hallway avatar
  [-4.6, 0.6, 0.95, 0.6], // living-room jukebox
  [-10.6, -3.2, 0.55, 1.8], // kitchen pantry
  [10.6, -4.5, 0.55, 1.8], // kitchen sideboard
]

function segToBox(s: WallSeg): ColBox {
  return {
    minX: s.pos[0] - s.size[0] / 2,
    maxX: s.pos[0] + s.size[0] / 2,
    minZ: s.pos[2] - s.size[2] / 2,
    maxZ: s.pos[2] + s.size[2] / 2,
  }
}

export const colliders: ColBox[] = [
  ...walls.filter((w) => w.collider).map(segToBox),
  ...railings.map(segToBox),
  ...furniture.map(([cx, cz, w, d]) => ({
    minX: cx - w / 2,
    maxX: cx + w / 2,
    minZ: cz - d / 2,
    maxZ: cz + d / 2,
  })),
]

export type RoomId = 'hall' | 'living' | 'gallery' | 'kitchen' | 'balcony' | 'workshop'

export const ROOM_LABELS: Record<RoomId, string> = {
  hall: 'Entrance Hall',
  living: 'Living Room · Skills',
  gallery: 'Gallery · Projects',
  kitchen: 'Kitchen · Contact',
  balcony: 'Balcony · Chill Zone',
  workshop: 'Workshop · Now Building',
}

export function roomAt(x: number, z: number): RoomId {
  if (x < -11) return 'balcony'
  if (z < -4.5 && x < -6) return 'workshop'
  if (z < 0) return 'kitchen'
  if (x <= -2.5) return 'living'
  if (x >= 2.5) return 'gallery'
  return 'hall'
}
