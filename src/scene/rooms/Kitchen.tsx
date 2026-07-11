import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { Interactable } from '../../interactions/Interactable'
import {
  KitchenCounter,
  Fridge,
  Island,
  DiningSet,
  CeilingLamp,
  PendantLamp,
  Pantry,
  Sideboard,
  UpperCabinet,
  ShelfJars,
  WallClock,
  FruitBowl,
  IdeaBoard,
} from '../props/props'
import { tileTexture } from '../textures'
import profile from '../../data/profile.json'

export function Kitchen() {
  const resumeUrl = import.meta.env.BASE_URL + profile.resume
  const backsplash = useMemo(() => {
    const t = tileTexture().clone()
    t.needsUpdate = true
    t.repeat.set(7, 1.2)
    return t
  }, [])

  return (
    <group>
      <CeilingLamp position={[-1.2, 2.85, -4.8]} intensity={20} distance={12} />
      <CeilingLamp position={[6.5, 2.85, -4.5]} intensity={14} distance={9} color="#ffe2b0" />
      <KitchenCounter position={[-2.5, 0, -8.45]} />
      <PendantLamp position={[-1.9, 2.05, -5.2]} />
      <PendantLamp position={[-0.5, 2.05, -5.2]} />
      <DiningSet position={[6.5, 0, -4.5]} />

      {/* dining rug */}
      <mesh position={[6.5, 0.012, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 32]} />
        <meshStandardMaterial color="#6d4a35" roughness={1} />
      </mesh>

      {/* backsplash + upper cabinets over the counter */}
      <mesh position={[-2.5, 1.55, -8.85]}>
        <planeGeometry args={[7, 1.2]} />
        <meshStandardMaterial map={backsplash} roughness={0.4} />
      </mesh>
      <UpperCabinet position={[-4.9, 2.4, -8.6]} w={2.4} />
      <UpperCabinet position={[0.2, 2.4, -8.6]} w={1.6} />
      {/* range hood over the burners */}
      <mesh position={[-1.25, 2.35, -8.55]}>
        <boxGeometry args={[1.2, 0.5, 0.7]} />
        <meshStandardMaterial color="#8f9aa3" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-1.25, 2.85, -8.6]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#7a858e" metalness={0.5} roughness={0.4} />
      </mesh>

      <ShelfJars position={[3.9, 1.7, -8.72]} />
      <WallClock position={[8.6, 2.35, -8.82]} rotationY={0} />
      <Pantry position={[-10.6, 0, -3.2]} rotationY={0} />
      <Sideboard position={[10.6, 0, -4.5]} rotationY={Math.PI} />

      {/* neon-ish kitchen slogan — in the gap between the cabinets and the shelf */}
      <Text
        position={[2.3, 2.5, -8.8]}
        fontSize={0.22}
        color="#ffb454"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        Let's cook something together
      </Text>

      {/* the island is the contact "recipe card" station */}
      <Interactable
        id="contact-island"
        position={[-1.2, 0, -5.2]}
        radius={2.2}
        label="Contact recipe card"
        overlay={{ kind: 'contact' }}
        markerY={1.7}
        room="kitchen"
      >
        <Island position={[0, 0, 0]} />
        <FruitBowl position={[-0.85, 1.05, -0.25]} />
      </Interactable>

      {/* fridge magnet = resume download (click / E) */}
      <Interactable
        id="fridge-resume"
        position={[2.2, 0, -8.35]}
        radius={1.9}
        label="Grab my resume off the fridge"
        overlay={{ kind: 'contact' }}
        proximity={false}
        markerY={2.4}
      >
        <group
          onClick={(e) => {
            e.stopPropagation()
            window.open(resumeUrl, '_blank', 'noopener')
          }}
        >
          <Fridge position={[0, 0, 0]} />
        </group>
      </Interactable>

      {/* idea corkboard: visitors pitch their own "recipe" */}
      <Interactable
        id="idea-board"
        position={[5.8, 0, -8.5]}
        radius={2.3}
        label="Pin your idea on the board"
        overlay={{ kind: 'idea' }}
        proximity={false}
        markerY={2.75}
      >
        <IdeaBoard position={[0, 1.85, -0.32]} rotationY={0} />
        <Text position={[0, 2.65, -0.3]} fontSize={0.17} color="#ffb454" anchorX="center">
          Got a recipe in mind? Pitch it!
        </Text>
      </Interactable>
    </group>
  )
}
