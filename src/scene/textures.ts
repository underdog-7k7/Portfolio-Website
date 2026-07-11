import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

/**
 * Procedural canvas textures — all the surface detail of image textures with
 * zero downloads. Each texture is generated once and cached for the session.
 */

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void

const cache = new Map<string, CanvasTexture>()

function make(name: string, w: number, h: number, draw: Draw): CanvasTexture {
  const hit = cache.get(name)
  if (hit) return hit
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  draw(ctx, w, h)
  const t = new CanvasTexture(canvas)
  t.wrapS = t.wrapT = RepeatWrapping
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  cache.set(name, t)
  return t
}

/** deterministic pseudo-random so textures look identical every visit */
function rng(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647
}

export function woodFloorTexture(): CanvasTexture {
  return make('woodFloor', 512, 512, (ctx, w, h) => {
    const rand = rng(7)
    const rows = 8
    const rh = h / rows
    for (let r = 0; r < rows; r++) {
      let x = -rand() * 120
      while (x < w) {
        const len = 120 + rand() * 140
        const shade = 0.82 + rand() * 0.3
        ctx.fillStyle = `rgb(${Math.round(138 * shade)}, ${Math.round(90 * shade)}, ${Math.round(59 * shade)})`
        ctx.fillRect(x, r * rh, len, rh)
        // plank end seam
        ctx.fillStyle = 'rgba(40,22,10,0.55)'
        ctx.fillRect(x + len - 1.5, r * rh, 1.5, rh)
        // wood grain streaks
        ctx.strokeStyle = 'rgba(70,40,20,0.18)'
        ctx.lineWidth = 1
        for (let g = 0; g < 4; g++) {
          const gy = r * rh + rand() * rh
          ctx.beginPath()
          ctx.moveTo(x + 4, gy)
          ctx.bezierCurveTo(x + len * 0.3, gy + rand() * 4 - 2, x + len * 0.6, gy + rand() * 4 - 2, x + len - 4, gy)
          ctx.stroke()
        }
        x += len
      }
      // row gap line
      ctx.fillStyle = 'rgba(40,22,10,0.5)'
      ctx.fillRect(0, r * rh - 1, w, 1.5)
    }
  })
}

export function plasterTexture(): CanvasTexture {
  return make('plaster', 256, 256, (ctx, w, h) => {
    const rand = rng(21)
    ctx.fillStyle = '#e5d9c3'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 2600; i++) {
      const a = 0.02 + rand() * 0.045
      ctx.fillStyle = rand() > 0.5 ? `rgba(120,100,70,${a})` : `rgba(255,250,235,${a})`
      ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2)
    }
  })
}

export function tileTexture(): CanvasTexture {
  return make('tile', 256, 256, (ctx, w, h) => {
    const rand = rng(5)
    const n = 4
    const s = w / n
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const shade = 0.96 + rand() * 0.07
        ctx.fillStyle = `rgb(${Math.round(207 * shade)}, ${Math.round(201 * shade)}, ${Math.round(186 * shade)})`
        ctx.fillRect(i * s, j * s, s, s)
      }
    }
    ctx.strokeStyle = 'rgba(140,132,115,0.8)'
    ctx.lineWidth = 2
    for (let i = 0; i <= n; i++) {
      ctx.beginPath()
      ctx.moveTo(i * s, 0)
      ctx.lineTo(i * s, h)
      ctx.moveTo(0, i * s)
      ctx.lineTo(w, i * s)
      ctx.stroke()
    }
  })
}

export function deckTexture(): CanvasTexture {
  return make('deck', 256, 256, (ctx, w, h) => {
    const rand = rng(13)
    const planks = 6
    const pw = w / planks
    for (let p = 0; p < planks; p++) {
      const shade = 0.8 + rand() * 0.28
      ctx.fillStyle = `rgb(${Math.round(110 * shade)}, ${Math.round(79 * shade)}, ${Math.round(53 * shade)})`
      ctx.fillRect(p * pw, 0, pw, h)
      ctx.fillStyle = 'rgba(30,18,8,0.6)'
      ctx.fillRect(p * pw, 0, 2, h)
      ctx.strokeStyle = 'rgba(60,38,20,0.25)'
      for (let g = 0; g < 5; g++) {
        const gx = p * pw + 3 + rand() * (pw - 6)
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.lineTo(gx + rand() * 6 - 3, h)
        ctx.stroke()
      }
    }
  })
}

export function roundRugTexture(): CanvasTexture {
  return make('roundRug', 256, 256, (ctx, w, h) => {
    const cx = w / 2
    const colors = ['#40554e', '#4d665c', '#384941', '#455f55']
    ctx.fillStyle = '#2f3f38'
    ctx.fillRect(0, 0, w, h)
    for (let r = 0; r < 8; r++) {
      ctx.beginPath()
      ctx.arc(cx, cx, (w / 2) * (1 - r * 0.12), 0, Math.PI * 2)
      ctx.fillStyle = colors[r % colors.length]
      ctx.fill()
    }
    void h
  })
}

export function runnerRugTexture(): CanvasTexture {
  return make('runnerRug', 256, 512, (ctx, w, h) => {
    ctx.fillStyle = '#7a3b2e'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#c9a26f'
    ctx.lineWidth = 6
    ctx.strokeRect(14, 14, w - 28, h - 28)
    ctx.lineWidth = 2.5
    ctx.strokeRect(30, 30, w - 60, h - 60)
    // diamond motifs down the middle
    ctx.fillStyle = 'rgba(201,162,111,0.85)'
    for (let y = 70; y < h - 40; y += 90) {
      ctx.beginPath()
      ctx.moveTo(w / 2, y - 24)
      ctx.lineTo(w / 2 + 24, y)
      ctx.lineTo(w / 2, y + 24)
      ctx.lineTo(w / 2 - 24, y)
      ctx.closePath()
      ctx.fill()
    }
  })
}

/** fake IDE screenful of code for monitors */
export function codeScreenTexture(): CanvasTexture {
  return make('codeScreen', 256, 160, (ctx, w, h) => {
    const rand = rng(42)
    ctx.fillStyle = '#0d1420'
    ctx.fillRect(0, 0, w, h)
    const colors = ['#58e08a', '#3fa7ff', '#c792ea', '#ffcb6b', '#7d8799']
    let y = 10
    while (y < h - 6) {
      let x = 8 + Math.floor(rand() * 3) * 14
      const segs = 1 + Math.floor(rand() * 4)
      for (let s = 0; s < segs && x < w - 20; s++) {
        const len = 14 + rand() * 52
        ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
        ctx.globalAlpha = 0.85
        ctx.fillRect(x, y, len, 4)
        x += len + 8
      }
      y += 9
    }
    ctx.globalAlpha = 1
  })
}

/** soft radial glow (moon halo, window moonbeam) */
export function glowTexture(): CanvasTexture {
  return make('glow', 128, 128, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 2, w / 2, w / 2, w / 2)
    g.addColorStop(0, 'rgba(255,255,255,0.9)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.35)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, w)
  })
}

/** mid-century abstract wall art */
export function wallArtTexture(): CanvasTexture {
  return make('wallArt', 256, 192, (ctx, w, h) => {
    ctx.fillStyle = '#f0e6d2'
    ctx.fillRect(0, 0, w, h)
    const blocks: Array<[number, number, number, number, string]> = [
      [18, 20, 90, 110, '#c85a3a'],
      [96, 62, 120, 60, '#3a6f6a'],
      [140, 26, 70, 90, '#e0a83c'],
      [40, 120, 150, 46, '#31435c'],
    ]
    for (const [x, y, bw, bh, c] of blocks) {
      ctx.fillStyle = c
      ctx.globalAlpha = 0.92
      ctx.fillRect(x, y, bw, bh)
    }
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#2a2118'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(150, 96, 34, 0, Math.PI * 2)
    ctx.stroke()
  })
}
