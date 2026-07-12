import { useState } from 'react'
import type { PanelComponent } from './OverlayRoot'
import { tracks, trackName, nowPlayingLabel, useMusicStore } from '../audio/musicPlayer'
import { getStations, RADIO_PRESETS, type Station } from '../services/radio'

/**
 * The jukebox: live internet radio (Radio-Browser API — real stations, no
 * key) on top, local "tapes" from public/music/ below. The music keeps
 * playing while you walk around the house.
 */
export function JukeboxPanel({ Panel }: { Panel: PanelComponent }) {
  const { source, playing, error, playTape, playRadio, toggle, stop, next, prev, shuffle } = useMusicStore()
  const [tag, setTag] = useState<string | null>(null)
  /** undefined = loading, null = fetch failed */
  const [stations, setStations] = useState<Station[] | null | undefined>()

  const choosePreset = async (t: string) => {
    setTag(t)
    setStations(undefined)
    const list = await getStations(t)
    setStations(list)
    if (list?.[0]) playRadio(list[0])
  }

  const isTape = source?.kind === 'tape'
  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-lg text-cream transition hover:bg-cream/20 active:scale-90 disabled:opacity-30'

  return (
    <Panel title="🎵 Jukebox">
      {/* now playing */}
      <div className="mb-4 rounded-xl bg-cream/5 p-3 text-center">
        <p className="text-[10px] uppercase tracking-widest text-cream/50">
          {playing ? (source?.kind === 'radio' ? '📡 live on air' : 'Now spinning') : source ? 'Paused' : 'Silence'}
        </p>
        <p className="mt-1 truncate font-display text-base font-semibold text-amberish">{source ? nowPlayingLabel(source) : 'pick something below'}</p>
      </div>

      <div className="mb-4 flex items-center justify-center gap-3">
        <button className={btn} onClick={prev} aria-label="Previous" disabled={!isTape}>
          ⏮
        </button>
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-amberish text-xl text-ink transition hover:brightness-110 active:scale-90 disabled:opacity-40"
          onClick={toggle}
          aria-label="Play / pause"
          disabled={!source && tracks.length === 0}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button className={btn} onClick={next} aria-label="Next" disabled={!isTape}>
          ⏭
        </button>
      </div>
      {error && <p className="mb-3 text-center text-xs text-red-400">{error}</p>}

      {/* live radio */}
      <h3 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-cream/50">
        📡 Live radio <span className="normal-case text-cream/35">· real stations via radio-browser</span>
      </h3>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {RADIO_PRESETS.map((p) => (
          <button
            key={p.tag}
            onClick={() => void choosePreset(p.tag)}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              tag === p.tag ? 'bg-amberish font-semibold text-ink' : 'bg-cream/10 text-cream/80 hover:bg-cream/20'
            }`}
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      {tag && stations === undefined && <p className="mb-3 animate-pulse text-xs text-cream/50">tuning the antenna…</p>}
      {tag && stations === null && <p className="mb-3 text-xs text-cream/55">The antenna is down — no stations reachable right now.</p>}
      {stations && (
        <ul className="mb-4 space-y-1">
          {stations.slice(0, 3).map((s) => {
            const active = source?.kind === 'radio' && source.station.uuid === s.uuid
            return (
              <li key={s.uuid}>
                <button
                  onClick={() => playRadio(s)}
                  className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                    active ? 'bg-amberish/20 text-amberish' : 'text-cream/75 hover:bg-cream/10'
                  }`}
                >
                  {active && playing ? '📡 ' : ''}
                  {s.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* local tapes */}
      <h3 className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-cream/50">📼 My tapes</h3>
      {tracks.length === 0 ? (
        <p className="rounded-xl bg-cream/5 p-3 text-xs leading-relaxed text-cream/60">
          The record crate is empty — drop <code className="text-amberish">.mp3</code> files into <code className="text-amberish">public/music/</code>{' '}
          and list them in <code className="text-amberish">src/data/music.json</code>.
        </p>
      ) : (
        <>
          <ul className="space-y-1">
            {tracks.map((t, i) => {
              const active = source?.kind === 'tape' && source.index === i
              return (
                <li key={t}>
                  <button
                    onClick={() => playTape(i)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      active ? 'bg-amberish/20 text-amberish' : 'text-cream/75 hover:bg-cream/10'
                    }`}
                  >
                    {active && playing ? '♪ ' : ''}
                    {trackName(t)}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button className="rounded-full bg-cream/10 px-4 py-1.5 text-xs text-cream/85 hover:bg-cream/20" onClick={shuffle}>
              🔀 Surprise me
            </button>
            <button className="rounded-full bg-cream/10 px-4 py-1.5 text-xs text-cream/85 hover:bg-cream/20" onClick={stop}>
              ⏹ Stop
            </button>
          </div>
        </>
      )}
      <p className="mt-3 text-center text-[10px] text-cream/40">the music keeps playing while you explore</p>
    </Panel>
  )
}
