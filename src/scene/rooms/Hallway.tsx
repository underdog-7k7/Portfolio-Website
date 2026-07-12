import { ConsoleTable, CeilingLamp, CoatRack } from '../props/props'
import { RobotAvatar } from '../props/RobotAvatar'
import { Interactable } from '../../interactions/Interactable'

export function Hallway() {
  return (
    <group>
      <CeilingLamp position={[0, 2.85, 4.5]} intensity={18} distance={10} />
      <ConsoleTable position={[2.1, 0, 7]} rotationY={Math.PI} />
      <CoatRack position={[-2.1, 0, 7.8]} />

      {/* the AI-twin robot greeter */}
      <Interactable
        id="avatar-agent"
        position={[1.5, 0, 5.2]}
        radius={1.9}
        label="Talk to my AI twin"
        overlay={{ kind: 'agent' }}
        proximity={false}
        markerY={0}
        room="hall"
      >
        <RobotAvatar position={[0, 0, 0]} rotationY={-0.6} />
      </Interactable>
      {/* doormat */}
      <mesh position={[0, 0.02, 8.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.8]} />
        <meshStandardMaterial color="#5d4a36" roughness={1} />
      </mesh>
    </group>
  )
}
