import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, MathUtils } from 'three'
import type { Group, LineSegments, Material } from 'three'
import { Billboard, Sparkles } from '@react-three/drei'
import { signTexture } from './Signage'
import { useAppStore } from '../../store/useAppStore'
import { player } from '../../controls/playerState'
import skills from '../../data/skills.json'

/**
 * The skills display: a holographic constellation projected from a pedestal.
 * Category hubs + skill nodes are billboarded canvas labels connected by an
 * additive line web; clicking any node opens that category's SkillsPanel.
 * Perf: ~1 label quad per skill + ONE lineSegments buffer + one cone.
 */

const CAT_COLORS = ['#7df9ff', '#b49aff', '#7fe0a0', '#ffb454']

interface Node {
  name: string
  level: number
  pos: [number, number, number]
}
interface CatLayout {
  id: string
  title: string
  color: string
  hub: [number, number, number]
  items: Node[]
}

function buildLayout(): CatLayout[] {
  const cats = skills.categories
  return cats.map((cat, ci) => {
    const a = (ci / cats.length) * Math.PI * 2 + 0.5
    const hub: [number, number, number] = [Math.cos(a) * 0.5, 2.15, Math.sin(a) * 0.5]
    const items = cat.items.map((it, ii) => {
      const t = cat.items.length === 1 ? 0.5 : ii / (cat.items.length - 1)
      const ang = a - 0.95 + t * 1.9
      const r = 1.5 + (ii % 2) * 0.16
      const y = 1.22 + (((ii * 53 + ci * 29) % 97) / 97) * 3.0
      return { name: it.name, level: it.level, pos: [Math.cos(ang) * r, y, Math.sin(ang) * r] as [number, number, number] }
    })
    return { id: cat.id, title: cat.title, color: CAT_COLORS[ci % CAT_COLORS.length], hub, items }
  })
}

/** holo label: glowing text chip on a transparent canvas */
function holoLabel(text: string, color: string, big = false) {
  const px = big ? 52 : 40
  const measure = document.createElement('canvas').getContext('2d')!
  measure.font = `${big ? 700 : 600} ${px}px "Space Grotesk", "Segoe UI", sans-serif`
  const w = Math.ceil(measure.measureText(text).width + 70)
  const h = big ? 96 : 78
  return {
    tex: signTexture(`holo:${big}:${color}:${text}`, w, h, (ctx) => {
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.font = `${big ? 700 : 600} ${px}px "Space Grotesk", "Segoe UI", sans-serif`
      ctx.shadowColor = color
      ctx.shadowBlur = 16
      ctx.fillStyle = color
      ctx.fillText(text, w / 2, h / 2 + 1)
      ctx.shadowBlur = 3
      ctx.fillStyle = 'rgba(240,253,255,0.95)'
      ctx.fillText(text, w / 2, h / 2 + 1)
    }),
    aspect: w / h,
  }
}

function HoloNode({
  text,
  color,
  position,
  big = false,
  level = 80,
  onPick,
}: {
  text: string
  color: string
  position: [number, number, number]
  big?: boolean
  /** brightness/size encode mastery — the constellation's answer to progress bars */
  level?: number
  onPick: () => void
}) {
  const { tex, aspect } = useMemo(() => holoLabel(text, color, big), [text, color, big])
  const h = big ? 0.16 : 0.082 + (level / 100) * 0.065
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (e.delta > 6) return
    onPick()
  }
  return (
    <Billboard position={position}>
      <mesh onClick={onClick}>
        <planeGeometry args={[h * aspect, h]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={big ? 1 : 0.55 + (level / 100) * 0.45}
          toneMapped={false}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </Billboard>
  )
}

export function HoloProjector({ position }: { position: [number, number, number] }) {
  const layout = useMemo(() => buildLayout(), [])
  const holo = useRef<Group>(null)
  const web = useRef<LineSegments>(null)

  // one buffer for the whole line web: lens→hub + hub→each skill
  const lines = useMemo(() => {
    const pts: number[] = []
    for (const cat of layout) {
      pts.push(0, 1.02, 0, ...cat.hub)
      for (const it of cat.items) pts.push(...cat.hub, ...it.pos)
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(pts, 3))
    return g
  }, [layout])

  useFrame(({ clock }, dt) => {
    const g = holo.current
    if (!g) return
    g.rotation.y += dt * 0.14
    g.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.03
    // ease the hologram up when someone walks over
    const dx = player.position.x - position[0]
    const dz = player.position.z - position[2]
    const near = dx * dx + dz * dz < 16
    const s = MathUtils.lerp(g.scale.x, near ? 1 : 0.68, Math.min(dt * 3, 1))
    g.scale.setScalar(s)
    const mat = web.current?.material as (Material & { opacity: number }) | undefined
    if (mat) mat.opacity = 0.28 + Math.sin(clock.elapsedTime * 1.7) * 0.1
  })

  const openCat = (id: string) => useAppStore.getState().openOverlay({ kind: 'skills', categoryId: id }, 'skill-holo')

  return (
    <group position={position}>
      {/* pedestal */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.26, 0.32, 0.84, 20]} />
        <meshStandardMaterial color="#232a33" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.855, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.05, 20]} />
        <meshStandardMaterial color="#2f3844" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* lens */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.04, 16]} />
        <meshStandardMaterial color="#bfefff" emissive="#7df9ff" emissiveIntensity={2} />
      </mesh>
      {/* projection cone */}
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[1.25, 0.1, 2.6, 24, 1, true]} />
        <meshBasicMaterial color="#7df9ff" transparent opacity={0.05} blending={AdditiveBlending} side={2} depthWrite={false} />
      </mesh>
      {/* drifting holo dust */}
      <Sparkles count={16} scale={[2, 2.4, 2]} position={[0, 2.1, 0]} size={1.8} speed={0.25} color="#9feaf5" opacity={0.55} />

      {/* the constellation itself */}
      <group ref={holo}>
        <lineSegments ref={web} geometry={lines}>
          <lineBasicMaterial color="#7df9ff" transparent opacity={0.3} blending={AdditiveBlending} depthWrite={false} />
        </lineSegments>
        {layout.map((cat) => (
          <group key={cat.id}>
            <mesh position={cat.hub}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color={cat.color} toneMapped={false} />
            </mesh>
            <HoloNode text={cat.title} color={cat.color} position={[cat.hub[0], cat.hub[1] + 0.14, cat.hub[2]]} big onPick={() => openCat(cat.id)} />
            {cat.items.map((it) => (
              <group key={it.name}>
                <mesh position={it.pos}>
                  <sphereGeometry args={[0.014 + (it.level / 100) * 0.014, 8, 8]} />
                  <meshBasicMaterial color={cat.color} toneMapped={false} />
                </mesh>
                <HoloNode
                  text={it.name}
                  color={cat.color}
                  level={it.level}
                  position={[it.pos[0], it.pos[1] + 0.09, it.pos[2]]}
                  onPick={() => openCat(cat.id)}
                />
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}
