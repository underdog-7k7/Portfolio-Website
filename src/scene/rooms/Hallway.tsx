import { Text } from '@react-three/drei'
import { ConsoleTable, CeilingLamp, CoatRack } from '../props/props'
import { RobotAvatar } from '../props/RobotAvatar'
import { Interactable } from '../../interactions/Interactable'
import profile from '../../data/profile.json'

/** Doorway signage — the in-world wayfinding for both control schemes. */
function DoorSign({ position, rotationY, children }: { position: [number, number, number]; rotationY: number; children: string }) {
  return (
    <Text position={position} rotation-y={rotationY} fontSize={0.16} color="#ffb454" anchorX="center" anchorY="middle" outlineWidth={0.006} outlineColor="#3a2a1c">
      {children}
    </Text>
  )
}

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
        markerY={2.45}
        room="hall"
      >
        <RobotAvatar position={[0, 0, 0]} rotationY={-0.6} />
      </Interactable>
      {/* doormat */}
      <mesh position={[0, 0.02, 8.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.8]} />
        <meshStandardMaterial color="#5d4a36" roughness={1} />
      </mesh>
      {/* welcome text on the north face the player sees at spawn */}
      <Text position={[0, 2.86, 0.2]} fontSize={0.24} color="#f5ecd9" anchorX="center" anchorY="middle" maxWidth={4}>
        {`Welcome to\n${profile.name}'s house`}
      </Text>
      {/* wayfinding above each doorway */}
      <DoorSign position={[-2.32, 2.45, 4.75]} rotationY={Math.PI / 2}>
        ← Living Room · Skills
      </DoorSign>
      <DoorSign position={[2.32, 2.45, 4.75]} rotationY={-Math.PI / 2}>
        Gallery · Projects →
      </DoorSign>
      <DoorSign position={[0, 2.38, 0.2]} rotationY={0}>
        ↑ Kitchen · Contact
      </DoorSign>
    </group>
  )
}
