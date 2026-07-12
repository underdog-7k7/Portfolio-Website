import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import journey from '../../data/journey.json'
import { chalkText, chalkLine, chalkRect, chalkCheck, chalkErode, chalkSmudges, seedChalk, CHALK_FONT } from '../chalk'

const WHITE = '#eceae2'
const YELLOW = '#f2e3a4'
const FADED = 'rgba(236,234,226,0.68)'

/** word-wrap for chalk lines, honouring the handwriting font metrics */
function wrapChalk(ctx: CanvasRenderingContext2D, text: string, size: number, maxWidth: number): string[] {
  ctx.font = `${size}px ${CHALK_FONT}`
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word
    if (ctx.measureText(probe).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = probe
  }
  if (line) lines.push(line)
  return lines
}

/**
 * Classroom chalkboard drawn from journey.json — milestones on the left,
 * certifications on the right, today's date chalked in the corner. All
 * "handwriting" comes from the chalk toolkit (per-glyph wobble + dry-edge
 * ghost pass + grain erosion) so it reads like real chalk yet stays legible.
 */
function makeChalkboard(): CanvasTexture {
  const W = 1280
  const H = 800
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  // slate with a soft top-light and vignette
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#242c29')
  bg.addColorStop(1, '#181f1d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  const vin = ctx.createRadialGradient(W / 2, H / 2, H / 3, W / 2, H / 2, W * 0.72)
  vin.addColorStop(0, 'rgba(0,0,0,0)')
  vin.addColorStop(1, 'rgba(0,0,0,0.32)')
  ctx.fillStyle = vin
  ctx.fillRect(0, 0, W, H)
  seedChalk(17)
  chalkSmudges(ctx, W, H, 9)
  // dust haze settling above the tray
  const dust = ctx.createLinearGradient(0, H - 70, 0, H)
  dust.addColorStop(0, 'rgba(235,235,225,0)')
  dust.addColorStop(1, 'rgba(235,235,225,0.06)')
  ctx.fillStyle = dust
  ctx.fillRect(0, H - 70, W, 70)

  // ---- chalk writing happens on a transparent layer so the grain erosion
  //      only eats the strokes, never the slate ----
  const layer = document.createElement('canvas')
  layer.width = W
  layer.height = H
  const lc = layer.getContext('2d')!
  seedChalk(7)

  // title + wavy underline
  const titleW = chalkText(lc, journey.title, 64, 96, 62, { color: WHITE })
  chalkLine(lc, 64, 120, 64 + titleW, 126, { width: 4, alpha: 0.7 })
  chalkLine(lc, 64, 130, 64 + titleW * 0.55, 134, { width: 3, alpha: 0.4 })

  // classroom date, top-right corner
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
  chalkText(lc, 'today:', W - 64, 62, 26, { align: 'right', color: YELLOW, alpha: 0.85 })
  const dateW = chalkText(lc, today, W - 64, 104, 34, { align: 'right', color: WHITE })
  chalkLine(lc, W - 64 - dateW, 122, W - 64, 126, { width: 3, alpha: 0.5 })

  // ---- left column: the milestones ----
  const stops = journey.stops
  let y = 196
  for (const s of stops) {
    chalkText(lc, s.year, 64, y, 30, { color: YELLOW, maxWidth: 128 })
    chalkText(lc, s.title, 206, y, 33, { color: WHITE, maxWidth: 424 })
    chalkText(lc, s.org, 206, y + 33, 24, { color: FADED, maxWidth: 400 })
    // little chalk tick connecting year to entry
    chalkLine(lc, 178, y - 8, 194, y - 8, { alpha: 0.35, width: 2.5 })
    y += 77
  }

  // vertical divider between columns
  chalkLine(lc, 672, 184, 676, 700, { alpha: 0.28, width: 3 })

  // ---- right column: certifications & achievements ----
  const cx = 712
  const headW = chalkText(lc, 'Certifications', cx, 208, 42, { color: YELLOW })
  chalkLine(lc, cx, 230, cx + headW, 236, { width: 4, alpha: 0.65 })
  // chalk star doodle beside the header
  const sx = cx + headW + 42
  for (const [a, b, cD, d] of [
    [sx - 14, 196, sx + 14, 212],
    [sx + 14, 196, sx - 14, 212],
    [sx, 190, sx, 218],
    [sx - 17, 204, sx + 17, 204],
  ] as const) {
    chalkLine(lc, a, b, cD, d, { color: YELLOW, alpha: 0.7, width: 2.5 })
  }

  let cy = 292
  for (const cert of journey.certifications) {
    chalkCheck(lc, cx + 4, cy - 12, 13)
    const lines = wrapChalk(lc, cert.name, 27, 420)
    lines.forEach((ln, i) => {
      chalkText(lc, ln, cx + 44, cy + i * 33, 27, { color: WHITE })
    })
    chalkText(lc, `'${cert.year.slice(-2)}`, W - 70, cy, 26, { align: 'right', color: YELLOW, alpha: 0.9 })
    cy += lines.length * 33 + 42
  }

  // bottom band: hint on the left, DO-NOT-ERASE box on the right
  chalkLine(lc, 64, 716, W - 64, 720, { alpha: 0.22, width: 3 })
  chalkText(lc, 'step closer for the full story →', 64, 762, 27, { color: FADED })
  lc.save()
  lc.translate(1080, 748)
  lc.rotate(-0.035)
  chalkRect(lc, -132, -34, 264, 56, { color: YELLOW, alpha: 0.8, width: 3.5 })
  chalkText(lc, 'DO NOT ERASE !', 0, 6, 28, { align: 'center', color: YELLOW })
  lc.restore()

  chalkErode(lc, W, H, 3200)
  ctx.drawImage(layer, 0, 0)

  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** wood-framed classroom chalkboard with chalk tray, sticks and an eraser */
export function JourneyBoard({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const board = useMemo(() => makeChalkboard(), [])
  return (
    <group position={position} rotation-y={rotationY}>
      {/* frame */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[3.85, 2.46, 0.08]} />
        <meshStandardMaterial color="#4a3524" roughness={0.65} />
      </mesh>
      {/* slate */}
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[3.6, 2.25]} />
        <meshStandardMaterial map={board} roughness={0.9} />
      </mesh>
      {/* chalk tray */}
      <mesh position={[0, -1.27, 0.07]}>
        <boxGeometry args={[1.8, 0.05, 0.14]} />
        <meshStandardMaterial color="#5a4130" roughness={0.7} />
      </mesh>
      <mesh position={[0, -1.24, 0.135]}>
        <boxGeometry args={[1.8, 0.035, 0.02]} />
        <meshStandardMaterial color="#4a3524" roughness={0.7} />
      </mesh>
      {/* chalk sticks */}
      <mesh position={[-0.35, -1.235, 0.08]} rotation-z={Math.PI / 2} rotation-x={0.15}>
        <cylinderGeometry args={[0.013, 0.013, 0.1, 8]} />
        <meshStandardMaterial color="#eceae2" roughness={1} />
      </mesh>
      <mesh position={[-0.14, -1.235, 0.1]} rotation-z={Math.PI / 2} rotation-y={0.4}>
        <cylinderGeometry args={[0.013, 0.013, 0.08, 8]} />
        <meshStandardMaterial color="#f2e3a4" roughness={1} />
      </mesh>
      {/* eraser: wood back + felt */}
      <group position={[0.42, -1.225, 0.08]} rotation-y={-0.2}>
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.17, 0.035, 0.07]} />
          <meshStandardMaterial color="#8a6d4a" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.012, 0]}>
          <boxGeometry args={[0.17, 0.022, 0.07]} />
          <meshStandardMaterial color="#3b4045" roughness={1} />
        </mesh>
      </group>
    </group>
  )
}
