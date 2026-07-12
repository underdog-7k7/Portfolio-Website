import { Interactable } from '../../interactions/Interactable'
import { GalleryDesk, CeilingLamp, GalleryBench, Laptop } from '../props/props'
import { TV } from '../props/TV'
import { JourneyBoard } from '../props/JourneyBoard'
import { useAppStore } from '../../store/useAppStore'

/**
 * The gallery: ANIMESH·TV on the north wall is the ONLY project display
 * (scales to any number of projects), and the east wall carries the metro-map
 * journey board — education → internships → full-time.
 */
export function Gallery() {
  return (
    <group>
      <CeilingLamp position={[6.5, 2.85, 3.5]} intensity={22} distance={13} />
      <GalleryDesk position={[6.5, 0, 7.6]} />
      <GalleryBench position={[6.5, 0, 3.6]} />

      {/* the projects TV — walk up and switch it on */}
      <Interactable
        id="projects-tv"
        position={[6.5, 0, 0.6]}
        radius={3.8}
        label="View My Projects"
        overlay={{ kind: 'tv' }}
        proximity={false}
        markerY={0}
        room="gallery"
        onActivate={() =>
          useAppStore.getState().setFocus({
            pos: [6.5, 1.62, 3.6],
            look: [6.5, 1.75, 0.2],
            overlay: { kind: 'tv' },
          })
        }
      >
        <TV position={[0, 0, -0.38]} />
      </Interactable>

      {/* classroom chalkboard on the east wall — proximity opens the full story */}
      <Interactable
        id="journey-board"
        position={[10.8, 0, 4]}
        radius={2.7}
        label="Read my journey board"
        overlay={{ kind: 'journey' }}
        markerY={0}
        room="gallery"
      >
        <JourneyBoard position={[0.03, 1.75, 0]} rotationY={-Math.PI / 2} />
      </Interactable>

      {/* the laptop: activating it flies the camera in and boots a desktop with my links */}
      <Interactable
        id="laptop"
        position={[6.5, 0, 7.55]}
        radius={2.2}
        label="Use my laptop"
        overlay={{ kind: 'laptop' }}
        proximity={false}
        markerY={1.6}
        room="gallery"
        onActivate={() =>
          useAppStore.getState().setFocus({
            pos: [6.5, 1.08, 6.45],
            look: [6.5, 0.93, 7.43],
            overlay: { kind: 'laptop' },
          })
        }
      >
        {/* rotated so the screen faces the visitor approaching from the room */}
        <Laptop position={[0, 0.75, 0]} rotationY={Math.PI} />
      </Interactable>
    </group>
  )
}
