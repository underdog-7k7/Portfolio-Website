import { Interactable } from '../../interactions/Interactable'
import { Telescope, LoungeChair, Planter, StringLights, SideTable } from '../props/props'

export function Balcony() {
  return (
    <group>
      {/* cool moonlight wash over the deck */}
      <pointLight position={[-13.2, 2.6, 4.5]} color="#bcd4ff" intensity={9} distance={9} decay={1.8} />
      <StringLights from={[-15.4, 1.25, 2.2]} to={[-15.4, 1.25, 6.8]} />
      <StringLights from={[-15.3, 1.25, 7]} to={[-11.2, 1.25, 7]} />

      <LoungeChair position={[-13, 0, 5.8]} rotationY={-0.5} />
      <SideTable position={[-12.1, 0, 5.2]} />
      <Planter position={[-15.05, 0, 6.4]} />
      <Planter position={[-15.05, 0, 2.6]} />

      {/* telescope: click for a programming joke from the stars */}
      <Interactable
        id="telescope-joke"
        position={[-14.3, 0, 3.2]}
        radius={2}
        label="Peek through the telescope"
        overlay={{ kind: 'joke' }}
        proximity={false}
        markerY={1.9}
      >
        <Telescope position={[0, 0, 0]} rotationY={0.8} />
      </Interactable>
    </group>
  )
}
