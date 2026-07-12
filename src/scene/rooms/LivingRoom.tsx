import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { Interactable } from '../../interactions/Interactable'
import { Sofa, CoffeeTable, Bookshelf, Workstation, Cabinet, FloorLamp, CeilingLamp, WallArt, Jukebox } from '../props/props'
import { HoloProjector } from '../props/HoloProjector'
import { getRepos, timeAgo } from '../../services/github'
import skills from '../../data/skills.json'

/**
 * The living room. Skills moved off the furniture onto the holographic
 * constellation; the workstation monitor now mirrors my real GitHub (its
 * texture redraws when the API answers) and the coffee table hides a card
 * trick. Bookshelf & cabinet stay as cozy decor.
 */

/** terminal-style monitor texture that fills with real repo names */
function useGitHubScreen(): CanvasTexture {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 160
    const ctx = c.getContext('2d')!
    const draw = (repos: Awaited<ReturnType<typeof getRepos>>) => {
      ctx.fillStyle = '#0d1420'
      ctx.fillRect(0, 0, 256, 160)
      ctx.font = 'bold 11px monospace'
      ctx.fillStyle = '#58e08a'
      ctx.fillText('$ gh repo list --sort pushed', 8, 16)
      if (!repos) {
        ctx.fillStyle = '#7d8799'
        ctx.fillText('fetching…', 8, 36)
      } else {
        repos.slice(0, 6).forEach((r, i) => {
          const y = 36 + i * 20
          ctx.fillStyle = '#ffcb6b'
          ctx.fillText(r.name.slice(0, 20), 8, y)
          ctx.fillStyle = '#7d8799'
          ctx.font = '10px monospace'
          ctx.fillText(timeAgo(r.pushedAt), 178, y)
          ctx.font = 'bold 11px monospace'
        })
        ctx.fillStyle = '#58e08a'
        ctx.fillText('$ █', 8, 36 + Math.min(repos.length, 6) * 20)
      }
    }
    draw(null)
    const t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    void getRepos().then((rs) => {
      draw(rs)
      t.needsUpdate = true
    })
    return t
  }, [])
}

export function LivingRoom() {
  const ghScreen = useGitHubScreen()
  return (
    <group>
      <CeilingLamp position={[-7, 2.85, 4.5]} intensity={22} distance={13} />
      {/* sofa faces the coffee table / room, not the wall */}
      <Sofa position={[-7.5, 0, 6]} rotationY={0} />
      <CoffeeTable position={[-7.5, 0, 4.4]} />
      {/* east corner — out of the hologram's projection */}
      <FloorLamp position={[-3.2, 0, 8.2]} />
      <WallArt position={[-7.5, 1.95, 8.84]} rotationY={Math.PI} w={1.5} h={1.1} />
      <WallArt position={[-9.6, 1.9, 0.16]} rotationY={0} w={1.0} h={0.8} />

      {/* cozy decor (used to carry the skills panels) */}
      <Bookshelf position={[-10.6, 0, 1.8]} rotationY={0} />
      <Cabinet position={[-5, 0, 8.45]} rotationY={Math.PI} />

      {/* jukebox against the north wall — live radio + local tapes */}
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

      {/* the workstation streams my real GitHub activity */}
      <Interactable
        id="github-live"
        position={[-7, 0, 0.65]}
        radius={2.1}
        label="See what I'm coding lately"
        overlay={{ kind: 'github' }}
        markerY={2.1}
        room="living"
      >
        <Workstation position={[0, 0, 0]} rotationY={0} screen={ghScreen} />
      </Interactable>

      {/* the skills constellation — SW corner, with room to breathe */}
      <Interactable
        id="skill-holo"
        position={[-9.6, 0, 7.2]}
        radius={2.8}
        label="Explore the skill constellation"
        overlay={{ kind: 'skills', categoryId: skills.categories[0].id }}
        proximity={false}
        markerY={3.0}
        room="living"
      >
        <HoloProjector position={[0, 0, 0]} />
      </Interactable>
    </group>
  )
}
