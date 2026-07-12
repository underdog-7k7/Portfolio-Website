import { create } from 'zustand'
import musicData from '../data/music.json'
import type { Station } from '../services/radio'

/**
 * Jukebox audio engine — one shared <audio> element that survives overlay
 * open/close, playing either local "tapes" (MP3s in public/music/, listed in
 * src/data/music.json) or live internet-radio streams from Radio-Browser.
 */

export const tracks: string[] = musicData.tracks

export function trackName(path: string): string {
  const base = decodeURIComponent(path.split('/').pop() ?? path)
  return base.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
}

export type Source = { kind: 'tape'; index: number } | { kind: 'radio'; station: Station }

export function nowPlayingLabel(source: Source): string {
  return source.kind === 'radio' ? source.station.name : trackName(tracks[source.index])
}

let audio: HTMLAudioElement | null = null

function ensureAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'none'
    audio.addEventListener('ended', () => {
      const s = useMusicStore.getState()
      // tapes advance; a live stream "ending" means it dropped
      if (s.source?.kind === 'tape') s.next()
      else useMusicStore.setState({ playing: false })
    })
    audio.addEventListener('error', () => {
      const s = useMusicStore.getState()
      useMusicStore.setState({
        playing: false,
        error:
          s.source?.kind === 'radio'
            ? 'That station dropped the signal — try another one.'
            : 'Could not load that track — check that the file exists in public/music/.',
      })
    })
  }
  return audio
}

interface MusicState {
  source: Source | null
  playing: boolean
  error: string | null
  playTape: (index?: number) => void
  playRadio: (station: Station) => void
  pause: () => void
  stop: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  shuffle: () => void
}

export const useMusicStore = create<MusicState>((set, get) => ({
  source: null,
  playing: false,
  error: null,

  playTape: (index) => {
    if (tracks.length === 0) return
    const cur = get().source
    const base = index ?? (cur?.kind === 'tape' ? cur.index : 0)
    const i = (base + tracks.length) % tracks.length
    const el = ensureAudio()
    const src = import.meta.env.BASE_URL + tracks[i]
    if (!el.src.endsWith(tracks[i])) el.src = src
    void el.play().catch(() => set({ playing: false, error: 'Playback blocked — tap play again.' }))
    set({ source: { kind: 'tape', index: i }, playing: true, error: null })
  },
  playRadio: (station) => {
    const el = ensureAudio()
    el.src = station.url
    void el.play().catch(() => set({ playing: false, error: 'Playback blocked — tap the station again.' }))
    set({ source: { kind: 'radio', station }, playing: true, error: null })
  },
  pause: () => {
    audio?.pause()
    set({ playing: false })
  },
  stop: () => {
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    set({ playing: false, source: null })
  },
  toggle: () => {
    const s = get()
    if (s.playing) return s.pause()
    if (s.source?.kind === 'radio') return s.playRadio(s.source.station)
    return s.playTape()
  },
  next: () => {
    const cur = get().source
    if (cur?.kind === 'tape') get().playTape(cur.index + 1)
  },
  prev: () => {
    const cur = get().source
    if (cur?.kind === 'tape') get().playTape(cur.index - 1)
  },
  shuffle: () => {
    const cur = get().source
    const curIndex = cur?.kind === 'tape' ? cur.index : -1
    if (tracks.length < 2) return get().playTape()
    let i = curIndex
    while (i === curIndex) i = Math.floor(Math.random() * tracks.length)
    get().playTape(i)
  },
}))
