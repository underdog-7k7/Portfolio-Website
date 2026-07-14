import { useRef, type MouseEvent } from 'react'

const MAX_DEG = 7

/** subtle cursor-driven 3D tilt for cards/buttons; pass enabled=false on touch */
export function useTilt<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T | null>(null)

  if (!enabled) return { ref, onMouseMove: undefined, onMouseLeave: undefined }

  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(700px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)'
  }

  return { ref, onMouseMove, onMouseLeave }
}
