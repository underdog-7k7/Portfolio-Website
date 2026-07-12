import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getISS, tickISS, type ISS } from '../services/iss'

/**
 * The balcony telescope: a live ISS spotter. Orbital elements are fetched
 * once, then the position is computed locally every second — watch the
 * distance change in real time.
 */
export function TelescopePanel() {
  const close = useAppStore((s) => s.closeOverlay)
  const [iss, setIss] = useState<ISS | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let live = true
    void getISS().then((d) => {
      if (!live) return
      if (d) setIss(d)
      else setFailed(true)
    })
    const t = setInterval(() => {
      if (!live) return
      const d = tickISS()
      if (d) setIss(d)
    }, 1000)
    return () => {
      live = false
      clearInterval(t)
    }
  }, [])

  return (
    <div className="pointer-events-auto fixed inset-x-4 bottom-8 z-40 mx-auto max-w-md animate-rise rounded-2xl bg-ink/95 p-5 text-cream shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-start justify-between">
        <span className="font-display text-sm font-bold text-amberish">🔭 ISS Spotter — live</span>
        <button onClick={close} aria-label="Close" className="rounded-full bg-cream/10 px-2 text-sm text-cream/80 hover:bg-cream/20">
          ✕
        </button>
      </div>

      {failed ? (
        <p className="text-sm text-cream/70">
          Clouds tonight — couldn't pull the station's orbit data. Try again in a bit.
        </p>
      ) : !iss ? (
        <p className="animate-pulse text-sm text-cream/60">Scanning the sky for a very fast dot…</p>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-cream/90">
            The International Space Station is{' '}
            <span className="font-semibold tabular-nums text-amberish">{Math.round(iss.distanceKm).toLocaleString()} km</span> from this balcony{' '}
            <span className="text-cream/55">(and counting)</span> — look roughly <span className="font-semibold text-amberish">{iss.bearing}</span>.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {(
              [
                ['altitude', `${Math.round(iss.altitudeKm)} km`],
                ['speed', `${Math.round(iss.velocityKmh).toLocaleString()} km/h`],
                ['over', `${iss.lat.toFixed(1)}°, ${iss.lon.toFixed(1)}°`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-xl bg-cream/5 px-2 py-2">
                <p className="text-[10px] uppercase tracking-widest text-cream/45">{k}</p>
                <p className="mt-0.5 text-xs font-semibold tabular-nums text-cream/90">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-cream/45">
            Position computed right here in your browser (SGP4 over live orbital elements). It laps the planet every ~92 minutes — it is not
            slowing down for you.
          </p>
        </>
      )}
    </div>
  )
}
