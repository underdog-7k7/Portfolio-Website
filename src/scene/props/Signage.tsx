import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

/**
 * In-world tag kit — deliberately small. After the de-clutter pass only four
 * pieces remain: the AI twin's speech bubble, the workshop neon, the
 * corkboard's carved wood tag and the mobile portal pills. Room intros and
 * wayfinding live in the screen-space RoomCard (src/ui/RoomCard.tsx) instead.
 */

const DISPLAY = '"Space Grotesk", "Segoe UI", sans-serif'
const CREAM = '#f2ead8'
const AMBER = '#ffc87e'

type XYZ = [number, number, number]

const cache = new Map<string, CanvasTexture>()

/** cached canvas texture; repaints once webfonts finish loading */
function signTexture(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): CanvasTexture {
  const hit = cache.get(key)
  if (hit) return hit
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const paint = () => {
    ctx.clearRect(0, 0, w, h)
    draw(ctx, w, h)
  }
  paint()
  const t = new CanvasTexture(canvas)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  cache.set(key, t)
  document.fonts?.ready.then(() => {
    paint()
    t.needsUpdate = true
  })
  return t
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/* ------------------------------------------------------------------ */
/* Speech bubble (AI twin hover tag)                                   */
/* ------------------------------------------------------------------ */

/** chat-style speech bubble with online dot + tail — billboard-friendly */
export function SpeechBubble({ title, line }: { title: string; line: string }) {
  const tex = useMemo(
    () =>
      signTexture(`bubble:${title}:${line}`, 720, 220, (ctx, w) => {
        const bw = w - 24
        const bh = 152
        // bubble
        ctx.save()
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur = 16
        ctx.shadowOffsetY = 5
        const g = ctx.createLinearGradient(0, 0, 0, bh)
        g.addColorStop(0, 'rgba(34,26,18,0.95)')
        g.addColorStop(1, 'rgba(16,12,9,0.95)')
        ctx.fillStyle = g
        rr(ctx, 12, 10, bw, bh, 34)
        ctx.fill()
        // tail
        ctx.beginPath()
        ctx.moveTo(w / 2 - 26, bh + 6)
        ctx.lineTo(w / 2 + 8, bh + 6)
        ctx.lineTo(w / 2 - 4, bh + 46)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        ctx.strokeStyle = 'rgba(255,180,84,0.45)'
        ctx.lineWidth = 2.5
        rr(ctx, 12, 10, bw, bh, 34)
        ctx.stroke()

        // online dot + eyebrow
        ctx.fillStyle = '#6fe08a'
        ctx.beginPath()
        ctx.arc(58, 58, 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(111,224,138,0.25)'
        ctx.beginPath()
        ctx.arc(58, 58, 16, 0, Math.PI * 2)
        ctx.fill()
        ctx.textBaseline = 'middle'
        ctx.font = `600 26px ${DISPLAY}`
        ctx.fillStyle = AMBER
        let x = 84
        for (const ch of title.toUpperCase()) {
          ctx.fillText(ch, x, 58)
          x += ctx.measureText(ch).width + 5
        }
        // message line
        ctx.font = `600 40px ${DISPLAY}`
        ctx.fillStyle = CREAM
        ctx.fillText(line, 56, 116)
      }),
    [title, line],
  )
  return (
    <mesh>
      <planeGeometry args={[1.62, 0.5]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Neon sign (workshop)                                                */
/* ------------------------------------------------------------------ */

/**
 * Neon-tube lettering mounted on a dark acrylic plate. The plate is drawn
 * into the canvas (rounded corners for free) and the material uses normal
 * blending — additive over light plaster is what made the old version
 * unreadable.
 */
export function NeonSign({
  position,
  rotationY = 0,
  text,
  sub,
  color = '#7df9ff',
}: {
  position: XYZ
  rotationY?: number
  text: string
  sub?: string
  color?: string
}) {
  const tex = useMemo(
    () =>
      signTexture(`neon:${text}:${sub ?? ''}:${color}`, 880, 300, (ctx, w, h) => {
        // dark acrylic mounting plate
        ctx.save()
        ctx.shadowColor = 'rgba(0,0,0,0.55)'
        ctx.shadowBlur = 14
        ctx.shadowOffsetY = 5
        const g = ctx.createLinearGradient(0, 0, 0, h)
        g.addColorStop(0, 'rgba(22,26,30,0.97)')
        g.addColorStop(1, 'rgba(10,13,16,0.97)')
        ctx.fillStyle = g
        rr(ctx, 8, 8, w - 16, h - 16, 26)
        ctx.fill()
        ctx.restore()
        ctx.strokeStyle = 'rgba(255,255,255,0.07)'
        ctx.lineWidth = 2
        rr(ctx, 8, 8, w - 16, h - 16, 26)
        ctx.stroke()
        // ambient glow pooling on the plate
        const pool = ctx.createRadialGradient(w / 2, 128, 10, w / 2, 128, w * 0.4)
        pool.addColorStop(0, `${color}2e`)
        pool.addColorStop(1, `${color}00`)
        ctx.fillStyle = pool
        ctx.fillRect(0, 0, w, h)

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // halo passes (restrained — the plate provides the contrast now)
        ctx.font = `700 122px ${DISPLAY}`
        ctx.shadowColor = color
        for (const blur of [28, 12]) {
          ctx.shadowBlur = blur
          ctx.fillStyle = color
          ctx.fillText(text, w / 2, 122)
        }
        // bright tube core
        ctx.shadowBlur = 4
        ctx.fillStyle = '#f4feff'
        ctx.fillText(text, w / 2, 122)
        if (sub) {
          const label = `· ${sub.toUpperCase()} ·`
          ctx.font = `600 32px ${DISPLAY}`
          ctx.shadowBlur = 10
          ctx.fillStyle = color
          ctx.fillText(label, w / 2, 232)
          ctx.shadowBlur = 0
          ctx.fillStyle = 'rgba(244,254,255,0.92)'
          ctx.fillText(label, w / 2, 232)
        }
      }),
    [text, sub, color],
  )
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh>
        <planeGeometry args={[2.1, 0.72]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Small wooden tag (corkboard header)                                 */
/* ------------------------------------------------------------------ */

/** carved wooden mini-sign, e.g. nailed above the kitchen corkboard */
export function WoodTag({ position, rotationY = 0, text }: { position: XYZ; rotationY?: number; text: string }) {
  const tex = useMemo(
    () =>
      signTexture(`wood:${text}`, 640, 150, (ctx, w, h) => {
        ctx.save()
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.shadowBlur = 12
        ctx.shadowOffsetY = 5
        const g = ctx.createLinearGradient(0, 0, 0, h)
        g.addColorStop(0, '#6b4f33')
        g.addColorStop(1, '#503a24')
        ctx.fillStyle = g
        rr(ctx, 10, 8, w - 20, h - 20, 18)
        ctx.fill()
        ctx.restore()
        // wood grain streaks
        ctx.strokeStyle = 'rgba(40,24,10,0.35)'
        ctx.lineWidth = 1.5
        for (let i = 0; i < 6; i++) {
          const y = 22 + i * 18
          ctx.beginPath()
          ctx.moveTo(24, y)
          ctx.bezierCurveTo(w * 0.3, y + 6, w * 0.7, y - 6, w - 24, y + 3)
          ctx.stroke()
        }
        ctx.strokeStyle = 'rgba(255,214,150,0.25)'
        ctx.lineWidth = 2
        rr(ctx, 18, 16, w - 36, h - 36, 12)
        ctx.stroke()
        // carved lettering: dark inset + light face
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `700 52px ${DISPLAY}`
        ctx.fillStyle = 'rgba(20,10,4,0.85)'
        ctx.fillText(text, w / 2 + 2, h / 2 + 4, w - 90)
        ctx.fillStyle = '#f5e9cf'
        ctx.fillText(text, w / 2, h / 2 + 1, w - 90)
        // nails
        for (const x of [34, w - 34]) {
          ctx.fillStyle = '#2c2c2c'
          ctx.beginPath()
          ctx.arc(x, h / 2, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = 'rgba(255,255,255,0.35)'
          ctx.beginPath()
          ctx.arc(x - 1.5, h / 2 - 1.5, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }),
    [text],
  )
  return (
    <mesh position={position} rotation-y={rotationY}>
      <planeGeometry args={[1.3, 0.3]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile portal pill                                                  */
/* ------------------------------------------------------------------ */

/** teal pill label floating over major waypoints (mobile navigation) */
export function PillTag({ text }: { text: string }) {
  const { tex, aspect } = useMemo(() => {
    const measure = document.createElement('canvas').getContext('2d')!
    measure.font = `600 46px ${DISPLAY}`
    const tw = measure.measureText(text).width
    const w = Math.ceil(tw + 150)
    const h = 104
    const t = signTexture(`pill:${text}`, w, h, (ctx) => {
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetY = 4
      ctx.fillStyle = 'rgba(7,26,23,0.88)'
      rr(ctx, 8, 8, w - 16, h - 16, (h - 16) / 2)
      ctx.fill()
      ctx.restore()
      ctx.strokeStyle = 'rgba(90,208,192,0.65)'
      ctx.lineWidth = 2.5
      rr(ctx, 8, 8, w - 16, h - 16, (h - 16) / 2)
      ctx.stroke()
      ctx.fillStyle = '#5ad0c0'
      ctx.beginPath()
      ctx.arc(52, h / 2, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.font = `600 46px ${DISPLAY}`
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#d9fff8'
      ctx.fillText(text, 84, h / 2 + 1)
    })
    return { tex: t, aspect: w / h }
  }, [text])
  const h = 0.34
  return (
    <mesh>
      <planeGeometry args={[h * aspect, h]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

/** shared canvas-label texture maker for other props (holo constellation etc.) */
export { signTexture, rr }
