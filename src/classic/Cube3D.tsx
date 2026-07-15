import { useEffect, useRef } from 'react'

const MAX_SPEED = 220 // deg/s cap on rotation speed, per axis
const IDLE_SPEED = 40 // deg/s default auto-spin around Y until the user swipes
const DRAG_DEG_PER_PX = 0.6

export function Cube3D() {
  const cubeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cube = cubeRef.current
    if (!cube) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clamp = (v: number) => Math.max(-MAX_SPEED, Math.min(MAX_SPEED, v))

    let rotX = -18
    let rotY = 0
    let velX = 0
    let velY = reduceMotion ? 0 : IDLE_SPEED

    let dragging = false
    let lastX = 0
    let lastY = 0
    let lastT = 0
    let flickDX = 0
    let flickDY = 0
    let flickDT = 0

    const apply = () => {
      cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`
    }
    apply()

    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min((now - lastT) / 1000, 0.05)
      lastT = now
      if (!dragging) {
        rotX += velX * dt
        rotY += velY * dt
        apply()
      }
      raf = requestAnimationFrame(tick)
    })
    lastT = performance.now()

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      cube.setPointerCapture(e.pointerId)
      cube.classList.add('is-dragging')
      lastX = e.clientX
      lastY = e.clientY
      lastT = performance.now()
      flickDX = 0
      flickDY = 0
      flickDT = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      flickDT = Math.max(now - lastT, 1)
      flickDX = dx
      flickDY = dy

      rotY += dx * DRAG_DEG_PER_PX
      rotX -= dy * DRAG_DEG_PER_PX
      apply()

      lastX = e.clientX
      lastY = e.clientY
      lastT = now
    }

    const endDrag = () => {
      if (!dragging) return
      dragging = false
      cube.classList.remove('is-dragging')
      lastT = performance.now()

      if (!reduceMotion && flickDT > 0) {
        velY = clamp((flickDX / flickDT) * 1000 * DRAG_DEG_PER_PX)
        velX = clamp((-flickDY / flickDT) * 1000 * DRAG_DEG_PER_PX)
      } else {
        velX = 0
        velY = 0
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (cube.hasPointerCapture(e.pointerId)) cube.releasePointerCapture(e.pointerId)
      endDrag()
    }

    cube.addEventListener('pointerdown', onPointerDown)
    cube.addEventListener('pointermove', onPointerMove)
    cube.addEventListener('pointerup', onPointerUp)
    cube.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(raf)
      cube.removeEventListener('pointerdown', onPointerDown)
      cube.removeEventListener('pointermove', onPointerMove)
      cube.removeEventListener('pointerup', onPointerUp)
      cube.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  return (
    <div className="cube3d-scene" aria-hidden="true">
      <div className="cube3d" ref={cubeRef}>
        <div className="cube3d-face cube3d-face--front" />
        <div className="cube3d-face cube3d-face--back" />
        <div className="cube3d-face cube3d-face--right" />
        <div className="cube3d-face cube3d-face--left" />
        <div className="cube3d-face cube3d-face--top" />
        <div className="cube3d-face cube3d-face--bottom" />
      </div>
    </div>
  )
}
