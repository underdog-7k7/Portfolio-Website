import type { PanelComponent } from './OverlayRoot'
import { tracks, trackName, useMusicStore } from '../audio/musicPlayer'

export function JukeboxPanel({ Panel }: { Panel: PanelComponent }) {
  const { index, playing, error, play, toggle, stop, next, prev, shuffle } = useMusicStore()

  if (tracks.length === 0) {
    return (
      <Panel title="🎵 Jukebox">
        <p className="text-sm text-cream/75">The record crate is empty!</p>
        <p className="mt-3 rounded-xl bg-cream/5 p-3 text-xs leading-relaxed text-cream/60">
          Drop <code className="text-amberish">.mp3</code> files into <code className="text-amberish">public/music/</code> and list them in{' '}
          <code className="text-amberish">src/data/music.json</code> — the jukebox picks them up automatically.
        </p>
      </Panel>
    )
  }

  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-lg text-cream transition hover:bg-cream/20 active:scale-90'

  return (
    <Panel title="🎵 Jukebox">
      <div className="mb-4 rounded-xl bg-cream/5 p-3 text-center">
        <p className="text-[10px] uppercase tracking-widest text-cream/50">{playing ? 'Now spinning' : 'Paused'}</p>
        <p className="mt-1 truncate font-display text-base font-semibold text-amberish">{trackName(tracks[index])}</p>
      </div>

      <div className="mb-4 flex items-center justify-center gap-3">
        <button className={btn} onClick={prev} aria-label="Previous">
          ⏮
        </button>
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-amberish text-xl text-ink transition hover:brightness-110 active:scale-90"
          onClick={toggle}
          aria-label="Play / pause"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button className={btn} onClick={next} aria-label="Next">
          ⏭
        </button>
      </div>
      <div className="mb-4 flex items-center justify-center gap-3">
        <button className="rounded-full bg-cream/10 px-4 py-1.5 text-xs text-cream/85 hover:bg-cream/20" onClick={shuffle}>
          🔀 Surprise me
        </button>
        <button className="rounded-full bg-cream/10 px-4 py-1.5 text-xs text-cream/85 hover:bg-cream/20" onClick={stop}>
          ⏹ Stop
        </button>
      </div>

      {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

      <ul className="space-y-1">
        {tracks.map((t, i) => (
          <li key={t}>
            <button
              onClick={() => play(i)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                i === index ? 'bg-amberish/20 text-amberish' : 'text-cream/75 hover:bg-cream/10'
              }`}
            >
              {i === index && playing ? '♪ ' : ''}
              {trackName(t)}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-[10px] text-cream/40">the music keeps playing while you explore</p>
    </Panel>
  )
}
