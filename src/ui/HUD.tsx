import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { ROOM_LABELS, type RoomId } from '../scene/houseLayout'
import { useTypewriter } from './useTypewriter'
import { nowPlayingLabel, useMusicStore } from '../audio/musicPlayer'
import { RoomCard } from './RoomCard'
import profile from '../data/profile.json'

function HeroIntro({ isTouch }: { isTouch: boolean }) {
  const typed = useTypewriter(profile.roles)
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 flex flex-col items-center gap-1 px-4 text-center">
      <p className="font-display text-sm uppercase tracking-[0.25em] text-cream/70">Hi, I'm</p>
      <h1 className="font-display text-3xl font-bold text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-4xl">{profile.name}</h1>
      <p className="h-6 text-base text-amberish sm:text-lg">
        {typed}
        <span className="animate-blink">|</span>
      </p>
      <p className="mt-2 rounded-full bg-black/45 px-4 py-1.5 text-xs text-cream/85 backdrop-blur">
        {isTouch ? 'Tap a glowing circle to explore my house' : 'Click to grab the camera · WASD to explore my house'}
      </p>
    </div>
  )
}

function FullscreenButton() {
  const [isFull, setIsFull] = useState(false)
  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }
  return (
    <button
      onClick={toggle}
      title={isFull ? 'Exit fullscreen' : 'Fullscreen'}
      className="pointer-events-auto rounded-full bg-black/45 px-3 py-1.5 text-xs text-cream/85 backdrop-blur transition hover:bg-black/65"
    >
      {isFull ? '🗗 exit' : '⛶ Fullscreen F11 '}
    </button>
  )
}

function NowPlaying() {
  const playing = useMusicStore((s) => s.playing)
  const source = useMusicStore((s) => s.source)
  const openOverlay = useAppStore((s) => s.openOverlay)
  if (!playing || !source) return null
  return (
    <button
      onClick={() => openOverlay({ kind: 'jukebox' })}
      className="pointer-events-auto absolute bottom-4 right-4 max-w-[220px] truncate rounded-full bg-black/55 px-4 py-1.5 text-xs text-amberish backdrop-blur transition hover:bg-black/75"
    >
      {source.kind === 'radio' ? '📡 ' : '♪ '}
      {nowPlayingLabel(source)}
    </button>
  )
}

export function HUD() {
  const started = useAppStore((s) => s.started)
  const isTouch = useAppStore((s) => s.isTouch)
  const near = useAppStore((s) => s.near)
  const overlay = useAppStore((s) => s.overlay)
  const room = useAppStore((s) => s.room)
  const focused = useAppStore((s) => s.focus !== null)
  if (!started) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {/* crosshair */}
      {!isTouch && !overlay && !focused && (
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream/80 shadow-[0_0_6px_rgba(0,0,0,0.9)]" />
      )}

      {/* room chip */}
      <div className="absolute left-4 top-4 rounded-full bg-black/45 px-4 py-1.5 font-display text-xs font-semibold text-cream backdrop-blur">
        {ROOM_LABELS[room as RoomId] ?? room}
      </div>

      {/* controls hint + fullscreen */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <span className="hidden rounded-full bg-black/45 px-4 py-1.5 text-xs text-cream/75 backdrop-blur sm:block">
          {isTouch ? 'tap circles · swipe to look' : 'WASD (Or Arrows) · Mouse(Look Around) · E interact · Esc cursor'}
        </span>
        <FullscreenButton />
      </div>

      {/* interaction prompt */}
      {near && !overlay && !focused && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <span className="rounded-full bg-amberish px-5 py-2 font-display text-sm font-semibold text-ink shadow-lg">
            {isTouch ? `Tap · ${near.label}` : `Press E · ${near.label}`}
          </span>
        </div>
      )}

      <NowPlaying />
      <RoomCard />

      {/* hero intro while standing in the hallway */}
      {room === 'hall' && !overlay && <HeroIntro isTouch={isTouch} />}
    </div>
  )
}
