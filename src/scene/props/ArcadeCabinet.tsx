import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, MeshBasicMaterial } from 'three'
import { signTexture } from './Signage'

/**
 * Retro arcade cabinet for the workshop — procedural like every other prop.
 * The screen shows a green CRT attract loop ("INSERT COIN" blinks via
 * emissive-ish material pulse); interacting opens the DEV·TRIVIA overlay.
 */

function marqueeTexture() {
  return signTexture('arcade:marquee', 512, 128, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#1a1030')
    g.addColorStop(1, '#0c0818')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    // starburst lines
    ctx.strokeStyle = 'rgba(125,249,255,0.25)'
    ctx.lineWidth = 2
    for (let i = 0; i < 9; i++) {
      ctx.beginPath()
      ctx.moveTo(40 + i * 55, h)
      ctx.lineTo(80 + i * 55, 0)
      ctx.stroke()
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '700 64px "Space Grotesk", "Segoe UI", sans-serif'
    ctx.shadowColor = '#ffb454'
    ctx.shadowBlur = 18
    ctx.fillStyle = '#ffb454'
    ctx.fillText('DEV·TRIVIA', w / 2, h / 2 + 2)
    ctx.shadowBlur = 4
    ctx.fillStyle = '#fff3d6'
    ctx.fillText('DEV·TRIVIA', w / 2, h / 2 + 2)
  })
}

function screenTexture() {
  return signTexture('arcade:screen', 384, 320, (ctx, w, h) => {
    ctx.fillStyle = '#04120a'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(52,211,153,0.5)'
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, w - 20, h - 20)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#34d399'
    ctx.font = '700 44px "Courier New", monospace'
    ctx.fillText('DEV·TRIVIA', w / 2, 92)
    ctx.font = '400 24px "Courier New", monospace'
    ctx.fillStyle = 'rgba(52,211,153,0.85)'
    ctx.fillText('5 QUESTIONS', w / 2, 150)
    ctx.fillText('NO LIFELINES', w / 2, 184)
    ctx.font = '700 28px "Courier New", monospace'
    ctx.fillStyle = '#a7f3d0'
    ctx.fillText('INSERT COIN', w / 2, 248)
    ctx.font = '400 18px "Courier New", monospace'
    ctx.fillStyle = 'rgba(52,211,153,0.6)'
    ctx.fillText('HI-SCORE 404', w / 2, 288)
    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.28)'
    for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1.5)
  })
}

export function ArcadeCabinet({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const marquee = useMemo(() => marqueeTexture(), [])
  const screen = useMemo(() => screenTexture(), [])
  const screenRef = useRef<Mesh>(null)

  // slow CRT glow pulse — sells "the machine is on" without a light source
  useFrame(({ clock }) => {
    const m = screenRef.current?.material as MeshBasicMaterial | undefined
    if (m) m.color.setScalar(0.85 + Math.sin(clock.elapsedTime * 2.2) * 0.15)
  })

  return (
    <group position={position} rotation-y={rotationY}>
      {/* body */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.72, 1.7, 0.6]} />
        <meshStandardMaterial color="#241a3a" roughness={0.6} />
      </mesh>
      {/* side art stripes */}
      {[-0.365, 0.365].map((x) => (
        <mesh key={x} position={[x, 0.9, 0.05]} rotation-y={x > 0 ? Math.PI / 2 : -Math.PI / 2}>
          <planeGeometry args={[0.5, 1.5]} />
          <meshStandardMaterial color="#ffb454" roughness={0.7} transparent opacity={0.25} />
        </mesh>
      ))}
      {/* marquee */}
      <mesh position={[0, 1.79, 0.06]} rotation-x={-0.15}>
        <boxGeometry args={[0.74, 0.26, 0.55]} />
        <meshStandardMaterial color="#17102a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.79, 0.345]} rotation-x={-0.15}>
        <planeGeometry args={[0.7, 0.2]} />
        <meshBasicMaterial map={marquee} toneMapped={false} />
      </mesh>
      {/* screen bezel + CRT (flat — a tilt would sink the top edge into the body) */}
      <mesh position={[0, 1.3, 0.302]}>
        <planeGeometry args={[0.62, 0.52]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.4} />
      </mesh>
      <mesh ref={screenRef} position={[0, 1.3, 0.304]}>
        <planeGeometry args={[0.56, 0.46]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      {/* control deck */}
      <mesh position={[0, 0.98, 0.38]} rotation-x={-0.35}>
        <boxGeometry args={[0.72, 0.07, 0.34]} />
        <meshStandardMaterial color="#17102a" roughness={0.6} />
      </mesh>
      {/* joystick */}
      <group position={[-0.18, 1.05, 0.42]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
          <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.4} />
        </mesh>
      </group>
      {/* buttons */}
      {[
        [0.1, '#e74c3c'],
        [0.22, '#f1c40f'],
      ].map(([x, c]) => (
        <mesh key={String(x)} position={[x as number, 1.02, 0.42]}>
          <cylinderGeometry args={[0.028, 0.028, 0.02, 12]} />
          <meshStandardMaterial color={c as string} roughness={0.4} />
        </mesh>
      ))}
      {/* coin door */}
      <mesh position={[0, 0.35, 0.302]}>
        <planeGeometry args={[0.24, 0.3]} />
        <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.42, 0.305]}>
        <planeGeometry args={[0.03, 0.08]} />
        <meshBasicMaterial color="#ffb454" />
      </mesh>
    </group>
  )
}
