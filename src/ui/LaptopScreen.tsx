import { useEffect, useState, type CSSProperties } from 'react'
import { useAppStore } from '../store/useAppStore'
import profile from '../data/profile.json'

interface App {
  label: string
  icon: string
  color: string
  url: string
}

/** monochrome SVG (bootstrap-icons, MIT) tinted via CSS mask */
function Icon({ icon, color, size = 34 }: { icon: string; color: string; size?: number }) {
  const url = `url(${import.meta.env.BASE_URL}icons/${icon}.svg)`
  const style: CSSProperties = {
    width: size,
    height: size,
    backgroundColor: color,
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  }
  return <span style={style} className="block drop-shadow" />
}

const ICON_MAP: Record<string, { icon: string; color: string }> = {
  GitHub: { icon: 'github', color: '#1b1f23' },
  LinkedIn: { icon: 'linkedin', color: '#0A66C2' },
  'Google Dev': { icon: 'google', color: '#4285F4' },
  Instagram: { icon: 'instagram', color: '#E1306C' },
}

/**
 * "Animesh XP" — the laptop boots a classic-XP-styled desktop once the camera
 * has zoomed in: bliss-like wallpaper, desktop shortcuts, an explorer window
 * with my links, and the beloved green start button. Esc / red ✕ steps back.
 */
export function LaptopScreen() {
  const close = useAppStore((s) => s.closeOverlay)
  const [booting, setBooting] = useState(true)
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    const boot = setTimeout(() => setBooting(false), 1300)
    const tick = setInterval(() => setClock(new Date()), 30000)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(boot)
      clearInterval(tick)
    }
  }, [close])

  const apps: App[] = [
    ...profile.socials.map((s) => ({ label: s.label, url: s.url, ...(ICON_MAP[s.label] ?? { icon: 'folder-fill', color: '#e8b04b' }) })),
    { label: 'My Resume', icon: 'file-earmark-person-fill', color: '#6b4f2a', url: import.meta.env.BASE_URL + profile.resume },
    { label: 'E-mail Me', icon: 'envelope-fill', color: '#c0392b', url: `mailto:${profile.email}` },
  ]

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-3 sm:p-8">
      <div className="flex max-h-[82dvh] w-full max-w-3xl animate-rise flex-col overflow-hidden rounded-xl border-4 border-[#2b2b2b] shadow-[0_0_70px_rgba(63,167,255,0.3)]">
        {booting ? (
          /* boot screen */
          <div className="flex h-[420px] flex-col items-center justify-center gap-6 bg-black">
            <p className="font-display text-2xl text-white">
              Animesh<span className="align-super text-xs text-white/70"> XP</span>
            </p>
            <div className="flex h-4 w-40 items-center gap-1 overflow-hidden rounded border border-white/40 px-0.5">
              <div className="flex animate-[bootbar_1.1s_linear_infinite] gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2.5 w-3 rounded-sm bg-[#3A6EA5]" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* desktop */}
            <div
              className="relative min-h-[420px] flex-1 overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse 120% 55% at 50% 108%, #3f9b3f 0%, #2f7d33 42%, transparent 43%), linear-gradient(#245edb 0%, #3f8cf3 45%, #7ec0ee 72%, #b8dcf5 100%)',
              }}
            >
              {/* desktop shortcuts */}
              <div className="absolute left-3 top-3 flex flex-col gap-3">
                {apps.slice(0, 3).map((a) => (
                  <a key={a.label} href={a.url} target="_blank" rel="noreferrer" className="group flex w-20 flex-col items-center gap-1 rounded p-1 hover:bg-blue-500/30">
                    <span className="rounded-lg bg-white/85 p-1.5 shadow group-hover:brightness-105">
                      <Icon icon={a.icon} color={a.color} size={30} />
                    </span>
                    <span className="text-center text-[11px] leading-tight text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.9)]">{a.label}</span>
                  </a>
                ))}
              </div>

              {/* explorer window */}
              <div className="absolute inset-x-6 top-6 sm:inset-x-16 sm:top-10">
                <div className="overflow-hidden rounded-t-lg border border-[#0831d9] shadow-2xl">
                  {/* title bar */}
                  <div className="flex items-center justify-between bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6] px-2 py-1.5">
                    <span className="flex items-center gap-1.5 text-[13px] font-bold text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.6)]">
                      🌐 Animesh's Links — Internet Explorer
                    </span>
                    <span className="flex gap-0.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#3a93ff] text-[10px] text-white shadow-inner">–</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#3a93ff] text-[10px] text-white shadow-inner">□</span>
                      <button
                        onClick={close}
                        aria-label="Close"
                        className="flex h-5 w-5 items-center justify-center rounded-sm bg-gradient-to-b from-[#e77c6d] to-[#c1290e] text-[11px] font-bold text-white hover:brightness-110"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                  {/* menu + address bar */}
                  <div className="border-b border-[#aca899] bg-[#ece9d8] px-2 py-0.5 text-[11px] text-black/80">
                    <span className="mr-3">File</span>
                    <span className="mr-3">Edit</span>
                    <span className="mr-3">View</span>
                    <span>Help</span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-[#aca899] bg-[#ece9d8] px-2 py-1 text-[11px]">
                    <span className="text-black/60">Address</span>
                    <span className="flex-1 truncate rounded border border-[#7f9db9] bg-white px-2 py-0.5 text-black">
                      https://animesh.dev/hi — {profile.name} · AI Engineer (GenAI & Agentic Systems)
                    </span>
                    <span className="rounded border border-[#7f9db9] bg-gradient-to-b from-white to-[#d6e5f5] px-2 py-0.5 text-black">Go</span>
                  </div>
                  {/* window body */}
                  <div className="bg-white px-4 py-4">
                    <p className="mb-3 text-[13px] text-black/75">
                      Welcome, visitor! You're on my actual laptop — where do you want to go today?
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {apps.map((a) => (
                        <a
                          key={a.label}
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col items-center gap-1.5 rounded-md border border-transparent p-2 text-center hover:border-[#7f9db9] hover:bg-[#e8f0fb]"
                        >
                          <Icon icon={a.icon} color={a.color} />
                          <span className="text-[11px] leading-tight text-black/85">{a.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* taskbar */}
            <div className="flex h-9 items-center justify-between bg-gradient-to-b from-[#3a81f3] via-[#245edb] to-[#1941a5] pr-2">
              <button
                onClick={close}
                className="flex h-full items-center gap-1 rounded-r-xl bg-gradient-to-b from-[#7ebb4c] via-[#3c9838] to-[#2d7a2a] px-4 font-display text-sm font-bold italic text-white shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)] [text-shadow:1px_1px_2px_rgba(0,0,0,0.6)] hover:brightness-110"
                title="Log off (step back)"
              >
                🏠 start
              </button>
              <span className="rounded bg-[#1089d3]/60 px-3 py-1 text-[11px] text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.5)]">
                Esc steps back · {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
