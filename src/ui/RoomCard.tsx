import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useWeather } from '../services/weather'
import skills from '../data/skills.json'


interface RoomCopy {
  title: string
  hook: string
  chip?: { label: string; run: () => void }
}

/**
 * Screen-space room intro card, bottom-left. Replaces the old in-world sign
 * plaques: slides in when you enter a room, names it, gives one hook line and
 * one tappable action, then fades out. The balcony line is live weather.
 */
export function RoomCard() {
  const room = useAppStore((s) => s.room)
  const started = useAppStore((s) => s.started)
  const overlay = useAppStore((s) => s.overlay)
  const focused = useAppStore((s) => s.focus !== null)
  const weather = useWeather()
  const [shown, setShown] = useState<string | null>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!started) return
    setShown(room)
    setFading(false)
    const fade = setTimeout(() => setFading(true), 6200)
    const hide = setTimeout(() => setShown(null), 6800)
    return () => {
      clearTimeout(fade)
      clearTimeout(hide)
    }
  }, [room, started])

  if (!shown || overlay || focused) return null

  const open = useAppStore.getState().openOverlay
  const copy: Record<string, RoomCopy> = {
    hall: {
      title: `Hi!! Animesh Here, Welcome to my portfolio personifed as a House`,
      hook: 'The goal was to bring a 3D persective to my portfolio, and to make it a fun place to explore at the same time, built entirely using Fable 5. Each room represents a different aspect of my work and personality, and the house as a whole is a reflection of me. \nInteract with the floating Double Pyramids to explore the House',
    },
    living: {
      title: 'Living Room',
      hook: 'The hologram has a few things to say about the skills I am honing currently, The screen on the wall shows my latest public GitHub activity, and theres a jukebox to play a few of my favorite tracks and radio stations(community Radio-Browser API), check the balcony for the ISS and the weather in Hyderabad',
      chip: { label: 'Open the skill map ✦', run: () => open({ kind: 'skills', categoryId: skills.categories[0].id }) },
    },
    gallery: {
      title: 'Gallery',
      hook: 'Seven projects on air, interact with the Screen to have a detailed view of that projects I have worked on, one journey chalkboard for a brief history of how Ive rolled,and one very real laptop (DO TRY THAT!).',
      chip: {
        label: 'Turn The Screen On →',
        run: () =>
          useAppStore.getState().setFocus({
            pos: [6.5, 1.62, 3.6],
            look: [6.5, 1.75, 0.2],
            overlay: { kind: 'tv' },
          }),
      },
    },
    kitchen: {
      title: 'Kitchen',
      hook: 'The kitchen represents the Ideas we cook up, the recipes we follow, and the ingredients we use to make something new. If you have an Idea or something to share, or you simply want to get in touch.. use this space ',
    },
    balcony: {
      title: 'Balcony',
      hook: weather
        ? `${Math.round(weather.temp)}°C · ${weather.label} in Hyderabad right now${weather.raining ? ' — hence the rain.' : '.'}`
        : 'A quiet night over Hyderabad.',
    },
    workshop: {
      title: 'The Lab',
      hook: 'Half-built things live here — mind the solder fumes.',
      chip: { label: "see what I'm building 🔧", run: () => open({ kind: 'current' }) },
    },
  }
  const info = copy[shown]
  if (!info) return null

  return (
    <div
      className={`pointer-events-auto absolute bottom-6 left-4 max-w-[300px] transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      } ${shown === 'hall' ? 'hidden sm:block' : ''}`}
    >
      <div className="animate-rise rounded-2xl border border-amberish/25 bg-ink/90 px-4 py-3 shadow-xl backdrop-blur-md">
        <p className="flex items-center gap-2 font-display text-sm font-bold text-cream">
          <span className="text-amberish">◆</span> {info.title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-cream/65">{info.hook}</p>
        {info.chip && (
          <button
            onClick={info.chip.run}
            className="mt-2 rounded-full bg-amberish px-3 py-1 font-display text-[11px] font-semibold text-ink transition hover:brightness-110"
          >
            {info.chip.label}
          </button>
        )}
      </div>
    </div>
  )
}
