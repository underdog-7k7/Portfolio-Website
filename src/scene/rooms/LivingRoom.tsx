import { Interactable } from '../../interactions/Interactable'
import { Sofa, CoffeeTable, Bookshelf, Workstation, Cabinet, FloorLamp, CeilingLamp, WallArt, Jukebox } from '../props/props'
import skills from '../../data/skills.json'

/**
 * Each skills category from skills.json is bound to a piece of furniture via
 * its `prop` field — add a category to the JSON and give it a slot here and
 * both the 3D room and the overlay update together.
 */
const SLOTS: Record<string, { position: [number, number, number]; rotationY: number; markerY: number }> = {
  bookshelf: { position: [-10.6, 0, 1.8], rotationY: 0, markerY: 2.5 },
  workstation: { position: [-7, 0, 0.65], rotationY: 0, markerY: 2.1 },
  cabinet: { position: [-5, 0, 8.45], rotationY: Math.PI, markerY: 1.8 },
}

const PROPS: Record<string, (p: { position: [number, number, number]; rotationY?: number }) => JSX.Element> = {
  bookshelf: Bookshelf,
  workstation: Workstation,
  cabinet: Cabinet,
}

export function LivingRoom() {
  return (
    <group>
      <CeilingLamp position={[-7, 2.85, 4.5]} intensity={22} distance={13} />
      <Sofa position={[-7.5, 0, 6]} rotationY={Math.PI} />
      <CoffeeTable position={[-7.5, 0, 4.4]} />
      <FloorLamp position={[-10.4, 0, 8.3]} />
      <WallArt position={[-7.5, 1.95, 8.84]} rotationY={Math.PI} w={1.5} h={1.1} />
      <WallArt position={[-9.6, 1.9, 0.16]} rotationY={0} w={1.0} h={0.8} />

      {/* jukebox against the north wall — the house soundtrack */}
      <Interactable
        id="jukebox"
        position={[-4.6, 0, 0.6]}
        radius={1.9}
        label="Play the jukebox"
        overlay={{ kind: 'jukebox' }}
        proximity={false}
        markerY={1.9}
        room="living"
      >
        <Jukebox position={[0, 0, 0]} />
      </Interactable>

      {skills.categories.map((cat) => {
        const slot = SLOTS[cat.prop]
        const Prop = PROPS[cat.prop]
        if (!slot || !Prop) return null
        return (
          <Interactable
            key={cat.id}
            id={`skills-${cat.id}`}
            position={slot.position}
            radius={2.1}
            label={cat.title}
            overlay={{ kind: 'skills', categoryId: cat.id }}
            markerY={slot.markerY}
            room="living"
          >
            <Prop position={[0, 0, 0]} rotationY={slot.rotationY} />
          </Interactable>
        )
      })}
    </group>
  )
}
