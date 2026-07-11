import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import journey from '../../data/journey.json'

const TYPE_COLORS: Record<string, string> = {
  education: '#3fa7ff',
  internship: '#ffb454',
  work: '#58e08a',
  future: '#c792ea',
}

/** metro-map texture drawn from journey.json — edit the JSON, the wall updates */
function makeJourneyMap(): CanvasTexture {
  const W = 1280
  const H = 800
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  ctx.fillStyle = '#101826'
  ctx.fillRect(0, 0, W, H)
  // subtle dot grid
  ctx.fillStyle = 'rgba(255,255,255,0.045)'
  for (let x = 30; x < W; x += 46) for (let y = 30; y < H; y += 46) ctx.fillRect(x, y, 2.5, 2.5)

  // title
  ctx.fillStyle = '#ffb454'
  ctx.font = 'bold 52px "Segoe UI", sans-serif'
  ctx.fillText(journey.title.toUpperCase(), 64, 96)
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '24px "Segoe UI", sans-serif'
  ctx.fillText('internships → full-time · the line keeps going', 66, 136)

  const stops = journey.stops
  const n = stops.length
  const x0 = 100
  const x1 = W - 110
  const yTop = 340
  const yBot = 560
  const pts = stops.map((_, i) => ({
    x: x0 + (i * (x1 - x0)) / (n - 1),
    y: i % 2 === 0 ? yTop : yBot,
  }))

  // metro line
  ctx.strokeStyle = '#ffb454'
  ctx.lineWidth = 11
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  // terminus arrow
  const last = pts[n - 1]
  ctx.lineTo(last.x + 42, last.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(last.x + 42, last.y - 16)
  ctx.lineTo(last.x + 66, last.y)
  ctx.lineTo(last.x + 42, last.y + 16)
  ctx.stroke()

  // stations + labels
  stops.forEach((s, i) => {
    const { x, y } = pts[i]
    ctx.fillStyle = '#f5f2ea'
    ctx.beginPath()
    ctx.arc(x, y, 19, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = TYPE_COLORS[s.type] ?? '#fff'
    ctx.beginPath()
    ctx.arc(x, y, 11, 0, Math.PI * 2)
    ctx.fill()

    const above = y === yTop
    const dir = above ? -1 : 1
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffd9a8'
    ctx.font = 'bold 30px "Segoe UI", sans-serif'
    ctx.fillText(s.year, x, y + dir * (above ? 48 : 64))
    ctx.fillStyle = '#f0ede4'
    ctx.font = 'bold 21px "Segoe UI", sans-serif'
    ctx.fillText(s.title, x, y + dir * (above ? 84 : 96), 200)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '19px "Segoe UI", sans-serif'
    ctx.fillText(s.org, x, y + dir * (above ? 112 : 124), 200)
    ctx.textAlign = 'left'
  })

  // legend
  const legend: Array<[string, string]> = [
    ['education', 'Education'],
    ['internship', 'Internship'],
    ['work', 'Full-time'],
    ['future', 'Next'],
  ]
  let lx = 66
  legend.forEach(([type, label]) => {
    ctx.fillStyle = TYPE_COLORS[type]
    ctx.beginPath()
    ctx.arc(lx, H - 62, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.font = '22px "Segoe UI", sans-serif'
    ctx.fillText(label, lx + 20, H - 54)
    lx += 40 + ctx.measureText(label).width + 44
  })
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = 'italic 20px "Segoe UI", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('walk closer for the full story →', W - 66, H - 54)
  ctx.textAlign = 'left'

  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** big framed "metro map" of my career on the gallery wall */
export function JourneyBoard({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const map = useMemo(() => makeJourneyMap(), [])
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[3.8, 2.42, 0.08]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[3.6, 2.25]} />
        <meshStandardMaterial map={map} roughness={0.6} />
      </mesh>
      {/* picture lights */}
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 1.32, 0.1]} rotation-x={0.6}>
          <cylinderGeometry args={[0.03, 0.05, 0.32, 8]} />
          <meshStandardMaterial color="#c8a248" metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}
