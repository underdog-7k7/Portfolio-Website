import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import projectsData from '../data/projects.json'
import type { ProjectData } from '../interactions/ProjectFrame'

const projects = projectsData.projects as ProjectData[]

/**
 * ANIMESH·TV — fullscreen streaming-style project browser that appears once
 * the camera settles in front of the TV. Scales to any number of projects.
 * ◀ ▶ / arrow keys / thumbnail rail to browse, autoplay until first touch,
 * LIVE badge + demo button for deployed projects, Esc powers off.
 */
export function TVCarousel() {
  const close = useAppStore((s) => s.closeOverlay)
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const railRef = useRef<HTMLDivElement>(null)

  const go = useCallback(
    (dir: number, manual = true) => {
      if (manual) setAuto(false)
      setIndex((i) => (i + dir + projects.length) % projects.length)
    },
    [],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, go])

  // autoplay until the visitor takes the remote
  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => go(1, false), 6000)
    return () => clearInterval(t)
  }, [auto, go])

  // keep the active thumbnail in view
  useEffect(() => {
    railRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  const p = projects[index]
  const live = p.live && p.live.length > 0 ? p.live : null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-2 sm:p-8">
      <div className="relative flex max-h-[88dvh] w-full max-w-4xl animate-crt-on flex-col overflow-hidden rounded-2xl border border-cyan-100/10 bg-[#07090f] shadow-[0_0_80px_rgba(255,180,84,0.18)]">
        {/* CRT scanlines + vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.07]"
          style={{ background: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)' }}
        />
        <div className="pointer-events-none absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />

        {/* header */}
        <div className="relative z-20 flex items-center justify-between border-b border-white/10 px-4 py-2.5 sm:px-6">
          <span className="font-display text-sm font-bold tracking-widest text-amberish">ANIMESH·TV</span>
          <span className="hidden font-mono text-[11px] text-white/40 sm:block">
            CH 07 — PROJECTS · {index + 1}/{projects.length} {auto ? '· autoplay' : ''}
          </span>
          <button onClick={close} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85 hover:bg-white/20">
            ⏻ power off
          </button>
        </div>

        {/* hero — re-keyed per project for the channel-switch animation */}
        <div key={p.id} className="relative z-20 grid min-h-0 flex-1 animate-channel gap-4 overflow-y-auto p-4 sm:grid-cols-[5fr_4fr] sm:gap-6 sm:p-6">
          <div className="relative">
            <img
              src={import.meta.env.BASE_URL + p.image}
              alt={p.title}
              className="max-h-52 w-full rounded-xl border border-white/10 object-cover shadow-[0_8px_40px_rgba(0,0,0,0.6)] sm:max-h-72"
            />
            {live && (
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
              </span>
            )}
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/70">{p.date}</span>
          </div>
          <div className="flex min-w-0 flex-col">
            <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">{p.category}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{p.title}</h2>
            <p className="text-sm font-semibold text-amberish">{p.subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-white/70 ring-1 ring-white/10">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {live && (
                <a href={live} target="_blank" rel="noreferrer" className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
                  ▶ Watch it live
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="rounded-full bg-amberish px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110">
                  View on GitHub ↗
                </a>
              )}
              {p.proprietary && (
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/60">
                  🔒 Proprietary — built for a client/employer
                </span>
              )}
              {p.extraLinks?.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10">
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* remote row: arrows + thumbnail rail */}
        <div className="relative z-20 flex items-center gap-2 border-t border-white/10 px-3 py-3 sm:px-5">
          <button onClick={() => go(-1)} aria-label="Previous" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/90 transition hover:bg-white/25 active:scale-90">
            ◀
          </button>
          <div ref={railRef} className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 [scrollbar-width:thin]">
            {projects.map((proj, i) => (
              <button
                key={proj.id}
                onClick={() => {
                  setAuto(false)
                  setIndex(i)
                }}
                className={`relative shrink-0 overflow-hidden rounded-lg transition-all ${
                  i === index ? 'ring-2 ring-amberish' : 'opacity-55 hover:opacity-90'
                }`}
              >
                <img src={import.meta.env.BASE_URL + proj.image} alt={proj.title} className="h-14 w-24 object-cover" />
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-1 text-[9px] text-white/85">{proj.title}</span>
              </button>
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/90 transition hover:bg-white/25 active:scale-90">
            ▶
          </button>
        </div>
        <p className="relative z-20 pb-2 text-center font-mono text-[10px] text-white/30">◀ ▶ or arrow keys to browse · Esc to power off</p>
      </div>
    </div>
  )
}
