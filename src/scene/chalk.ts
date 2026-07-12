/**
 * Chalk handwriting toolkit for canvas textures. Every stroke gets per-glyph
 * wobble, a dry "double-pass" edge and grain erosion so text reads exactly
 * like real chalk on slate — yet stays crisp and legible from player range.
 * Shared by the journey chalkboard and the kitchen café sign.
 */

export const CHALK_FONT = '"Segoe Print", "Chalkboard SE", "Bradley Hand", "Comic Sans MS", cursive'

/** deterministic rng so the boards look identical every visit */
let seed = 9
export function seedChalk(s: number) {
  seed = s
}
function rnd() {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}

export interface ChalkOpts {
  color?: string
  align?: 'left' | 'center' | 'right'
  alpha?: number
  /** squeeze horizontally (never overflow a column) */
  maxWidth?: number
}

/** handwritten chalk text; returns the drawn width so callers can underline */
export function chalkText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  opts: ChalkOpts = {},
): number {
  const { color = '#eceae2', align = 'left', alpha = 1 } = opts
  ctx.save()
  ctx.font = `${size}px ${CHALK_FONT}`
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  let total = ctx.measureText(text).width
  let squeeze = 1
  if (opts.maxWidth && total > opts.maxWidth) {
    squeeze = opts.maxWidth / total
    total = opts.maxWidth
  }
  const startX = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x
  ctx.translate(startX, y)
  ctx.scale(squeeze, 1)
  const jitter = size * 0.05
  let adv = 0
  for (const ch of text) {
    const w = ctx.measureText(ch).width
    ctx.save()
    ctx.translate(adv + w / 2, (rnd() - 0.5) * jitter * 2)
    ctx.rotate((rnd() - 0.5) * 0.06)
    ctx.fillStyle = color
    ctx.globalAlpha = alpha * (0.84 + rnd() * 0.16)
    ctx.fillText(ch, -w / 2, 0)
    // dry ghost pass — the slightly offset repeat gives strokes a chalky edge
    ctx.globalAlpha = alpha * 0.28
    ctx.fillText(ch, -w / 2 + 0.9, -0.7)
    ctx.restore()
    adv += w
  }
  ctx.restore()
  return total
}

/** hand-drawn wobbly chalk line */
export function chalkLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts: { color?: string; width?: number; alpha?: number } = {},
) {
  ctx.save()
  ctx.strokeStyle = opts.color ?? '#eceae2'
  ctx.lineWidth = opts.width ?? 3
  ctx.lineCap = 'round'
  ctx.globalAlpha = opts.alpha ?? 0.75
  const n = 8
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  for (let i = 1; i <= n; i++) {
    const t = i / n
    ctx.lineTo(x1 + (x2 - x1) * t + (rnd() - 0.5) * 3, y1 + (y2 - y1) * t + (rnd() - 0.5) * 3)
  }
  ctx.stroke()
  ctx.restore()
}

/** hand-drawn chalk rectangle (four wobbly strokes) */
export function chalkRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { color?: string; width?: number; alpha?: number } = {},
) {
  chalkLine(ctx, x, y, x + w, y, opts)
  chalkLine(ctx, x + w, y, x + w, y + h, opts)
  chalkLine(ctx, x + w, y + h, x, y + h, opts)
  chalkLine(ctx, x, y + h, x, y, opts)
}

/** chalk check mark */
export function chalkCheck(ctx: CanvasRenderingContext2D, x: number, y: number, s = 12, color = '#bfe8bd') {
  chalkLine(ctx, x, y, x + s * 0.45, y + s * 0.5, { color, width: 3.5, alpha: 0.9 })
  chalkLine(ctx, x + s * 0.45, y + s * 0.5, x + s * 1.2, y - s * 0.6, { color, width: 3.5, alpha: 0.9 })
}

/**
 * Erode a *transparent* chalk layer with speckle holes so strokes look dusty.
 * Only ever call this on an offscreen layer, never the opaque board itself.
 */
export function chalkErode(ctx: CanvasRenderingContext2D, w: number, h: number, count = 2800) {
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = 0.05 + rnd() * 0.13
    const s = 0.6 + rnd() * 1.7
    ctx.fillRect(rnd() * w, rnd() * h, s, s)
  }
  ctx.restore()
}

/** faded eraser swipes + dust haze for the board background */
export function chalkSmudges(ctx: CanvasRenderingContext2D, w: number, h: number, count = 7) {
  ctx.save()
  for (let i = 0; i < count; i++) {
    ctx.save()
    ctx.translate(rnd() * w, rnd() * h)
    ctx.rotate((rnd() - 0.5) * 0.9)
    const rw = 120 + rnd() * 260
    const rh = 22 + rnd() * 40
    const g = ctx.createRadialGradient(0, 0, 4, 0, 0, rw / 2)
    g.addColorStop(0, `rgba(235,235,225,${0.035 + rnd() * 0.03})`)
    g.addColorStop(1, 'rgba(235,235,225,0)')
    ctx.fillStyle = g
    ctx.scale(1, rh / rw)
    ctx.beginPath()
    ctx.arc(0, 0, rw / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}
