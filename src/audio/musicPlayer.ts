import { create } from 'zustand'
import musicData from '../data/music.json'

/**
 * Jukebox audio engine. Tracks are plain MP3s in `public/music/`, listed in
 * `src/data/music.json` — drop files in, add their paths to the manifest,
 * done. A single shared <audio> element survives overlay open/close so the
 * music keeps playing while you walk around.
 */

export const tracks: string[] = musicData.tracks

export function trackName(path: string): string {
  const base = decodeURIComponent(path.split('/').pop() ?? path)
  return base.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
}

let audio: HTMLAudioElement | null = null

function ensureAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'none'
    audio.addEventListener('ended', () => useMusicStore.getState().next())
    audio.addEventListener('error', () =>
      useMusicStore.setState({
        playing: false,
        error: 'Could not load that track — check that the file exists in public/music/.',
      }),
    )
  }
  return audio
}

interface MusicState {
  index: number
  playing: boolean
  error: string | null
  play: (index?: number) => void
  pause: () => void
  stop: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  shuffle: () => void
}

export const useMusicStore = create<MusicState>((set, get) => ({
  index: 0,
  playing: false,
  error: null,

  play: (index) => {
    if (tracks.length === 0) return
    const i = ((index ?? get().index) + tracks.length) % tracks.length
    const el = ensureAudio()
    const src = import.meta.env.BASE_URL + tracks[i]
    if (!el.src.endsWith(tracks[i])) el.src = src
    void el.play().catch(() => set({ playing: false, error: 'Playback blocked — tap play again.' }))
    set({ index: i, playing: true, error: null })
  },
  pause: () => {
    audio?.pause()
    set({ playing: false })
  },
  stop: () => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    set({ playing: false })
  },
  toggle: () => (get().playing ? get().pause() : get().play()),
  next: () => get().play(get().index + 1),
  prev: () => get().play(get().index - 1),
  shuffle: () => {
    if (tracks.length < 2) return get().play()
    let i = get().index
    while (i === get().index) i = Math.floor(Math.random() * tracks.length)
    get().play(i)
  },
}))
