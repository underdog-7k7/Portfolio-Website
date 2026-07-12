import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three'
import { Interactable } from '../../interactions/Interactable'
import { Telescope, LoungeChair, Planter, StringLights, SideTable, CardTable } from '../props/props'
import { useWeather } from '../../services/weather'

/**
 * Live rain over the balcony deck — only renders when Open-Meteo says it is
 * actually raining in Hyderabad right now. One <points> cloud, one draw call.
 */
function Rain() {
  const weather = useWeather()
  const raining = weather?.raining ?? false
  const geometry = useMemo(() => {
    const n = 420
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -15.4 + Math.random() * 4.3
      pos[i * 3 + 1] = Math.random() * 3.2
      pos[i * 3 + 2] = 2.1 + Math.random() * 4.8
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame((_, rawDt) => {
    if (!raining) return
    const attr = geometry.getAttribute('position') as BufferAttribute
    const arr = attr.array as Float32Array
    const fall = Math.min(rawDt, 0.05) * 6
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] -= fall
      if (arr[i] < 0.04) arr[i] = 3.2
    }
    attr.needsUpdate = true
  })

  if (!raining) return null
  return (
    <points geometry={geometry}>
      <pointsMaterial color="#a8c0dd" size={0.03} transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

export function Balcony() {
  return (
    <group>
      {/* cool moonlight wash over the deck */}
      <pointLight position={[-13.2, 2.6, 4.5]} color="#bcd4ff" intensity={9} distance={9} decay={1.8} />
      <StringLights from={[-15.4, 1.25, 2.2]} to={[-15.4, 1.25, 6.8]} />
      <StringLights from={[-15.3, 1.25, 7]} to={[-11.2, 1.25, 7]} />

      <LoungeChair position={[-13, 0, 5.8]} rotationY={-0.5} />
      <Planter position={[-15.05, 0, 6.4]} />
      <Planter position={[-15.05, 0, 2.6]} />

      {/* real Hyderabad weather, live */}
      <Rain />

      {/* telescope: live ISS spotter (position computed in-browser from TLE) */}
      <Interactable
        id="telescope-iss"
        position={[-14.3, 0, 3.2]}
        radius={2}
        label="Spot the ISS through the telescope"
        overlay={{ kind: 'telescope' }}
        proximity={false}
        markerY={1.9}
      >
        <Telescope position={[0, 0, 0]} rotationY={0.8} />
      </Interactable>

      {/* chai on the side table = programming jokes, one per sip */}
      <Interactable
        id="chai-jokes"
        position={[-12.1, 0, 5.2]}
        radius={1.2}
        label="Chai break — hear a joke"
        overlay={{ kind: 'joke' }}
        proximity={false}
        markerY={1.15}
      >
        <SideTable position={[0, 0, 0]} />
      </Interactable>

      {/* bistro card table by the railing — pick a card, any card
          (radius kept small so it never overlaps the chai trigger) */}
      <Interactable
        id="card-trick"
        position={[-12.3, 0, 2.7]}
        radius={1.4}
        label="Pick a card — a little magic"
        overlay={{ kind: 'cards' }}
        proximity={false}
        markerY={1.45}
      >
        <CardTable position={[0, 0, 0]} rotationY={0.5} />
      </Interactable>
    </group>
  )
}
