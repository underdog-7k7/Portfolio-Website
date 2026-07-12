import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
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

const HOME_URL = 'animesh.dev/home'

type WinId = 'ie' | 'notepad' | 'bin'

type Page =
  | { kind: 'home' }
  | { kind: 'results'; q: string }
  | { kind: 'note'; icon: string; title: string; lines: string[] }

const README = `hey, you found my laptop 👋

this machine runs Animesh XP (service pack ∞).
a few things actually work around here:

  · the address bar navigates for real — try
    "github", "linkedin" or "resume"
  · the desktop icons open things
  · the recycle bin holds dark secrets

whatever you do, do NOT type "rm -rf /" in the
address bar. seriously. don't.

– animesh`

const BIN_ITEMS: Array<{ icon: string; name: string; note: string }> = [
  { icon: '👤', name: 'scary_avatar.obj', note: 'deleted after one (1) collective nightmare' },
  { icon: '🌐', name: 'bootstrap_portfolio_v1.html', note: 'the old website. it had a good run' },
  { icon: '📝', name: 'todo_2024.txt', note: '"build a cooler portfolio" ✓ done' },
]

/** address-bar brain: real destinations, gentle jokes for everything else */
function resolve(raw: string, apps: App[]): { page: Page; bsod?: boolean; open?: string } {
  const q = raw.trim().toLowerCase()
  const find = (label: string) => apps.find((a) => a.label === label)?.url
  if (!q || q === HOME_URL || q === 'home' || q.includes('animesh.dev')) return { page: { kind: 'home' } }
  if (/rm\s+-rf|format\s+c|system32|sudo\s/.test(q)) return { page: { kind: 'home' }, bsod: true }
  if (q.includes('github')) return { open: find('GitHub'), page: openedNote('GitHub') }
  if (q.includes('linkedin')) return { open: find('LinkedIn'), page: openedNote('LinkedIn') }
  if (q.includes('insta')) return { open: find('Instagram'), page: openedNote('Instagram') }
  if (q.includes('google dev') || q.includes('developers.google') || q.includes('gdg'))
    return { open: find('Google Dev'), page: openedNote('my Google Dev profile') }
  if (q.includes('resume') || q === 'cv') return { open: find('My Resume'), page: openedNote('my resume') }
  if (q.includes('mail') || q.includes('contact')) return { open: find('E-mail Me'), page: openedNote('your mail app') }

  const egg = (icon: string, title: string, ...lines: string[]): { page: Page } => ({ page: { kind: 'note', icon, title, lines } })
  if (q.includes('google'))
    return egg('🌀', 'We need to go deeper', 'You googled Google on a fake browser inside a laptop inside a 3D house.', 'The internet police have been notified.')
  if (q.includes('youtube') || q.includes('netflix'))
    return egg('📺', 'Buffering… forever', 'This is a 2003 laptop on hallway Wi-Fi.', 'ANIMESH·TV in the gallery streams my projects in glorious 4K reality.')
  if (q.includes('stack overflow') || q.includes('stackoverflow'))
    return egg('📚', 'Closed as duplicate', 'Your question was answered in 2013.', 'It was not. It never is.')
  if (q.includes('gpt') || q.includes('claude') || q.includes('chatbot') || q === 'ai' || q.includes('gemini'))
    return egg('🤖', 'Looking for AI?', "The robot in the hallway IS the AI — it's my twin, allegedly.", 'Go say hi. It waves back.')
  if (q.includes('minesweeper') || q.includes('solitaire') || q.includes('game'))
    return egg('🎮', 'No games installed', 'This machine is for Serious Business™.', 'The console under the TV, however…')
  if (q.includes('password') || q.includes('admin') || q.includes('hack'))
    return egg('🔐', 'Access denied', 'Nice try. The password is hunter2.', 'Wait— no. Forget you read that.')
  if (q.includes('music') || q.includes('spotify'))
    return egg('🎵', 'Wrong device', 'The jukebox in the living room takes requests.', 'It has better speakers than this laptop, too.')
  if (q.includes('joke'))
    return egg('🔭', 'Jokes are outside', 'The telescope on the balcony dispenses programming jokes.', 'Star-certified. Mostly terrible.')
  if (q.includes('pizza') || q.includes('food') || q.includes('recipe') || q.includes('cook'))
    return egg('🍳', 'Kitchen is that way', "The island in the kitchen takes project 'recipes'.", 'Pitch me one — I read every note.')
  if (q.includes('animesh'))
    return egg('👀', "He's not on this internet", "You're literally standing inside his portfolio.", 'Look around — the house is the website.')
  if (q === 'hi' || q === 'hello' || q === 'hey')
    return egg('👋', 'Hello, visitor!', "You've got mail! (You don't.)", 'But you could send some — the E-mail icon works for real.')
  if (q.includes('42') || q.includes('meaning of life')) return egg('🌌', '42', 'You already knew the answer.', 'The question, however, is still buffering.')
  return { page: { kind: 'results', q: raw.trim() } }
}

function openedNote(what: string): Page {
  return {
    kind: 'note',
    icon: '🌍',
    title: `Opening ${what}…`,
    lines: ['A real tab should have opened.', 'If your popup blocker ate it, use the icons on the home page instead.'],
  }
}

function pageTitle(page: Page): string {
  if (page.kind === 'home') return "Animesh's Links"
  if (page.kind === 'results') return `${page.q} — Search`
  return page.title
}

/** classic-XP window chrome; the blue depth cue tracks focus */
function XPWindow({
  title,
  icon,
  active,
  z,
  className,
  onFocus,
  onClose,
  onMin,
  children,
}: {
  title: string
  icon: string
  active: boolean
  z: number
  className: string
  onFocus: () => void
  onClose: () => void
  onMin: () => void
  children: ReactNode
}) {
  return (
    <div
      className={`absolute flex flex-col overflow-hidden rounded-t-lg border shadow-2xl ${active ? 'border-[#0831d9]' : 'border-[#7a96df]'} ${className}`}
      style={{ zIndex: z }}
      onMouseDown={onFocus}
    >
      <div
        className={`flex shrink-0 items-center justify-between px-2 py-1.5 ${
          active ? 'bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6]' : 'bg-gradient-to-b from-[#8ba0e0] via-[#aebfe8] to-[#8ba0e0]'
        }`}
      >
        <span className="flex items-center gap-1.5 truncate text-[13px] font-bold text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.6)]">
          {icon} {title}
        </span>
        <span className="flex shrink-0 gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMin()
            }}
            aria-label="Minimize"
            className="flex h-5 w-5 items-end justify-center rounded-sm bg-[#3a93ff] pb-1 text-white shadow-inner hover:brightness-110"
          >
            <span className="block h-[3px] w-2.5 bg-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close window"
            className="flex h-5 w-5 items-center justify-center rounded-sm bg-gradient-to-b from-[#e77c6d] to-[#c1290e] text-[11px] font-bold text-white hover:brightness-110"
          >
            ✕
          </button>
        </span>
      </div>
      {children}
    </div>
  )
}

/**
 * "Animesh XP" — the laptop boots a working desktop. The browser navigates
 * (with easter eggs), closing it lands on a clickable desktop with icons,
 * a start menu, notepad, a recycle bin full of lore, and one very blue
 * screen for the brave. Esc / Shut Down steps back out to the room.
 */
export function LaptopScreen() {
  const close = useAppStore((s) => s.closeOverlay)
  const [booting, setBooting] = useState(true)
  const [bsod, setBsod] = useState(false)
  const [wins, setWins] = useState<WinId[]>(['ie'])
  const [mini, setMini] = useState<WinId[]>([])
  const [startOpen, setStartOpen] = useState(false)
  const [binEmpty, setBinEmpty] = useState(false)
  const [page, setPage] = useState<Page>({ kind: 'home' })
  const [address, setAddress] = useState(HOME_URL)
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    const tick = setInterval(() => setClock(new Date()), 30000)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearInterval(tick)
    }
  }, [close])

  useEffect(() => {
    if (!booting) return
    const t = setTimeout(() => setBooting(false), 1300)
    return () => clearTimeout(t)
  }, [booting])

  const apps: App[] = [
    ...profile.socials.map((s) => ({ label: s.label, url: s.url, ...(ICON_MAP[s.label] ?? { icon: 'folder-fill', color: '#e8b04b' }) })),
    { label: 'My Resume', icon: 'file-earmark-person-fill', color: '#6b4f2a', url: import.meta.env.BASE_URL + profile.resume },
    { label: 'E-mail Me', icon: 'envelope-fill', color: '#c0392b', url: `mailto:${profile.email}` },
  ]

  const focusWin = (id: WinId) => {
    setWins((w) => [...w.filter((x) => x !== id), id])
    setMini((m) => m.filter((x) => x !== id))
  }
  const openWin = (id: WinId) => {
    setStartOpen(false)
    focusWin(id)
  }
  const closeWin = (id: WinId) => setWins((w) => w.filter((x) => x !== id))
  const minimize = (id: WinId) => setMini((m) => (m.includes(id) ? m : [...m, id]))
  const isOpen = (id: WinId) => wins.includes(id) && !mini.includes(id)
  const topWin: WinId | undefined = [...wins].reverse().find((id) => !mini.includes(id))

  const navigate = (raw: string) => {
    const r = resolve(raw, apps)
    if (r.bsod) {
      setBsod(true)
      return
    }
    if (r.open) window.open(r.open, '_blank', 'noopener')
    setPage(r.page)
    if (r.page.kind === 'home') setAddress(HOME_URL)
  }

  const reboot = () => {
    setBsod(false)
    setWins(['ie'])
    setMini([])
    setStartOpen(false)
    setPage({ kind: 'home' })
    setAddress(HOME_URL)
    setBooting(true)
  }

  const winMeta: Record<WinId, { icon: string; label: string }> = {
    ie: { icon: '🌐', label: pageTitle(page) },
    notepad: { icon: '🗒️', label: 'readme.txt' },
    bin: { icon: '🗑️', label: 'Recycle Bin' },
  }

  const desktopIcons: Array<{ icon: ReactNode; label: string; open: () => void }> = [
    { icon: <span className="text-3xl leading-none drop-shadow">🌐</span>, label: 'Internet Explorer', open: () => openWin('ie') },
    { icon: <span className="text-3xl leading-none drop-shadow">🗒️</span>, label: 'readme.txt', open: () => openWin('notepad') },
    { icon: <span className="text-3xl leading-none drop-shadow">🗑️</span>, label: 'Recycle Bin', open: () => openWin('bin') },
    ...apps
      .filter((a) => ['GitHub', 'My Resume', 'E-mail Me'].includes(a.label))
      .map((a) => ({
        icon: (
          <span className="rounded-lg bg-white/85 p-1.5 shadow">
            <Icon icon={a.icon} color={a.color} size={24} />
          </span>
        ),
        label: a.label,
        open: () => window.open(a.url, '_blank', 'noopener'),
      })),
  ]

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-3 sm:p-8">
      <div
        className="flex h-[min(82dvh,620px)] w-full max-w-3xl animate-rise flex-col overflow-hidden rounded-xl border-4 border-[#2b2b2b] shadow-[0_0_70px_rgba(63,167,255,0.3)]"
        style={{ fontFamily: 'Tahoma, "Segoe UI", sans-serif' }}
      >
        {booting ? (
          /* boot screen */
          <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-black">
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
        ) : bsod ? (
          /* the forbidden command was typed */
          <button onClick={reboot} className="flex-1 cursor-pointer bg-[#0000aa] p-6 text-left font-mono text-[12px] leading-relaxed text-white sm:p-10">
            <p className="mb-4">A problem has been detected and Animesh XP has been shut down to prevent damage to your curiosity.</p>
            <p className="mb-4 font-bold">VISITOR_EXECUTED_FORBIDDEN_COMMAND</p>
            <p className="mb-4">If this is the first time you've seen this stop error screen: congratulations, you found the easter egg. The readme warned you.</p>
            <p className="mb-6">Technical information:</p>
            <p className="mb-6">*** STOP: 0x0000007K7 (0xC0FFEE00, 0xDEADBEEF, 0x00000E55)</p>
            <p className="animate-blink">Click anywhere to reboot…</p>
          </button>
        ) : (
          <>
            {/* desktop */}
            <div
              className="relative min-h-0 flex-1 overflow-hidden"
              onMouseDown={() => setStartOpen(false)}
              style={{
                background:
                  'radial-gradient(ellipse 120% 55% at 50% 108%, #3f9b3f 0%, #2f7d33 42%, transparent 43%), linear-gradient(#245edb 0%, #3f8cf3 45%, #7ec0ee 72%, #b8dcf5 100%)',
              }}
            >
              {/* desktop shortcuts */}
              <div className="absolute left-3 top-3 flex flex-col gap-2.5">
                {desktopIcons.map((d) => (
                  <button key={d.label} onClick={d.open} className="group flex w-24 flex-col items-center gap-1 rounded p-1 hover:bg-blue-500/30">
                    {d.icon}
                    <span className="text-center text-[11px] leading-tight text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.9)]">{d.label}</span>
                  </button>
                ))}
              </div>

              {/* Internet Explorer */}
              {isOpen('ie') && (
                <XPWindow
                  title={`${pageTitle(page)} — Internet Explorer`}
                  icon="🌐"
                  active={topWin === 'ie'}
                  z={10 + wins.indexOf('ie')}
                  className="inset-x-3 top-3 bottom-3 sm:inset-x-12 sm:top-6 sm:bottom-8"
                  onFocus={() => focusWin('ie')}
                  onClose={() => closeWin('ie')}
                  onMin={() => minimize('ie')}
                >
                  {/* menu + address bar */}
                  <div className="shrink-0 border-b border-[#aca899] bg-[#ece9d8] px-2 py-0.5 text-[11px] text-black/80">
                    {['File', 'Edit', 'View', 'Favorites', 'Help'].map((m) =>
                      m === 'Help' ? (
                        <button
                          key={m}
                          onClick={() =>
                            setPage({
                              kind: 'note',
                              icon: '🫡',
                              title: 'No reinforcements.',
                              lines: ["You're on your own, soldier."],
                            })
                          }
                          className="mr-3 rounded px-1 hover:bg-[#c9d6ef]"
                        >
                          {m}
                        </button>
                      ) : (
                        <span key={m} className="mr-3 cursor-default rounded px-1 hover:bg-[#c9d6ef]">
                          {m}
                        </span>
                      ),
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 border-b border-[#aca899] bg-[#ece9d8] px-2 py-1 text-[11px]">
                    <button
                      onClick={() => {
                        setPage({ kind: 'home' })
                        setAddress(HOME_URL)
                      }}
                      title="Back home"
                      className="rounded border border-transparent px-1.5 py-0.5 text-[13px] text-[#1a5c1a] hover:border-[#7f9db9] hover:bg-white/60"
                    >
                      ⬅️
                    </button>
                    <button
                      onClick={() => navigate(address)}
                      title="Refresh"
                      className="rounded border border-transparent px-1.5 py-0.5 text-[13px] hover:border-[#7f9db9] hover:bg-white/60"
                    >
                      🔄
                    </button>
                    <span className="text-black/60">Address</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') navigate(address)
                        if (e.key === 'Escape') {
                          e.stopPropagation()
                          ;(e.target as HTMLInputElement).blur()
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      spellCheck={false}
                      aria-label="Address bar"
                      className="min-w-0 flex-1 rounded border border-[#7f9db9] bg-white px-2 py-0.5 text-black outline-none focus:border-[#316ac5]"
                    />
                    <button
                      onClick={() => navigate(address)}
                      className="rounded border border-[#7f9db9] bg-gradient-to-b from-white to-[#d6e5f5] px-2 py-0.5 text-black hover:brightness-105"
                    >
                      Go
                    </button>
                  </div>
                  {/* page */}
                  <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4">
                    {page.kind === 'home' && (
                      <>
                        <p className="mb-3 text-[13px] text-black/75">
                          Welcome, visitor! What are you looking for?
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
                        <p className="mt-4 rounded border border-dashed border-[#7f9db9]/60 bg-[#fdfae9] px-3 py-2 text-[11px] text-black/60">
                          💡 Pro tip: the address bar actually works(kinda). Try <b>github</b> or <b>resume</b> , or type anything else and see what
                          the internet says.
                        </p>
                      </>
                    )}
                    {page.kind === 'note' && (
                      <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <span className="text-4xl">{page.icon}</span>
                        <p className="text-[15px] font-bold text-black/85">{page.title}</p>
                        {page.lines.map((l) => (
                          <p key={l} className="max-w-sm text-[12px] text-black/65">
                            {l}
                          </p>
                        ))}
                        <button
                          onClick={() => {
                            setPage({ kind: 'home' })
                            setAddress(HOME_URL)
                          }}
                          className="mt-3 rounded border border-[#7f9db9] bg-gradient-to-b from-white to-[#d6e5f5] px-3 py-1 text-[11px] text-black hover:brightness-105"
                        >
                          ← back to safety
                        </button>
                      </div>
                    )}
                    {page.kind === 'results' && (
                      <div className="text-[12px]">
                        <p className="mb-1 text-[17px] font-bold">
                          <span className="text-[#4285F4]">Yah</span>
                          <span className="text-[#ea4335]">oo</span>
                          <span className="text-[#fbbc05]">gle</span>
                          <span className="text-black/80">!</span>{' '}
                          <span className="text-[13px] font-normal text-black/60">search</span>
                        </p>
                        <p className="mb-3 border-b border-black/10 pb-2 text-[11px] text-black/50">
                          About {apps.length} results for “{page.q}” (0.0000042 seconds)
                        </p>
                        <div className="space-y-3">
                          {apps.map((a) => (
                            <a key={a.label} href={a.url} target="_blank" rel="noreferrer" className="block">
                              <span className="text-[13px] text-[#1a0dab] underline">
                                {a.label} — Animesh Pandey
                              </span>
                              <span className="block truncate text-[11px] text-[#006621]">{a.url}</span>
                              <span className="block text-[11px] text-black/60">
                                The only result that matters for “{page.q}”. Probably.
                              </span>
                            </a>
                          ))}
                        </div>
                        <p className="mt-4 text-[11px] text-black/60">
                          Did you mean:{' '}
                          <a href={`mailto:${profile.email}`} className="italic text-[#1a0dab] underline">
                            hire animesh
                          </a>
                          ?
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center justify-between border-t border-[#aca899] bg-[#ece9d8] px-2 py-0.5 text-[10px] text-black/60">
                    <span>Done</span>
                    <span>🌐 Internet</span>
                  </div>
                </XPWindow>
              )}

              {/* Notepad */}
              {isOpen('notepad') && (
                <XPWindow
                  title="readme.txt — Notepad"
                  icon="🗒️"
                  active={topWin === 'notepad'}
                  z={10 + wins.indexOf('notepad')}
                  className="inset-x-6 top-8 sm:left-auto sm:right-8 sm:top-10 sm:w-80"
                  onFocus={() => focusWin('notepad')}
                  onClose={() => closeWin('notepad')}
                  onMin={() => minimize('notepad')}
                >
                  <div className="shrink-0 border-b border-[#aca899] bg-[#ece9d8] px-2 py-0.5 text-[11px] text-black/80">
                    <span className="mr-3">File</span>
                    <span className="mr-3">Edit</span>
                    <span>Format</span>
                  </div>
                  <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap bg-white px-3 py-2 font-mono text-[11px] leading-relaxed text-black">
                    {README}
                  </pre>
                </XPWindow>
              )}

              {/* Recycle Bin */}
              {isOpen('bin') && (
                <XPWindow
                  title="Recycle Bin"
                  icon="🗑️"
                  active={topWin === 'bin'}
                  z={10 + wins.indexOf('bin')}
                  className="inset-x-6 top-14 sm:left-28 sm:right-auto sm:top-12 sm:w-96"
                  onFocus={() => focusWin('bin')}
                  onClose={() => closeWin('bin')}
                  onMin={() => minimize('bin')}
                >
                  <div className="bg-white px-3 py-2">
                    {binEmpty ? (
                      <p className="py-6 text-center text-[12px] text-black/55">The bin is empty. So, so clean. ✨</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {BIN_ITEMS.map((it) => (
                          <li key={it.name} className="flex items-baseline gap-2 rounded px-1.5 py-1 hover:bg-[#e8f0fb]">
                            <span>{it.icon}</span>
                            <span className="text-[12px] text-black/85">{it.name}</span>
                            <span className="min-w-0 flex-1 truncate text-right text-[10px] italic text-black/45">{it.note}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-2 flex justify-end border-t border-black/10 pt-2">
                      <button
                        onClick={() => setBinEmpty(true)}
                        disabled={binEmpty}
                        className="rounded border border-[#7f9db9] bg-gradient-to-b from-white to-[#d6e5f5] px-2.5 py-0.5 text-[11px] text-black hover:brightness-105 disabled:opacity-40"
                      >
                        Empty Recycle Bin
                      </button>
                    </div>
                  </div>
                </XPWindow>
              )}

              {/* start menu */}
              {startOpen && (
                <div
                  className="absolute bottom-0 left-0 z-50 w-60 overflow-hidden rounded-t-lg border border-[#0831d9] bg-[#ece9d8] shadow-2xl"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 bg-gradient-to-b from-[#1c57c4] to-[#3a93ff] px-3 py-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded border-2 border-white/60 bg-[#7ec0ee] text-lg">👤</span>
                    <span className="text-[13px] font-bold text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.5)]">Visitor</span>
                  </div>
                  <div className="py-1 text-[12px] text-black/85">
                    {(
                      [
                        ['🌐', 'Internet Explorer', () => openWin('ie')],
                        ['🗒️', 'readme.txt', () => openWin('notepad')],
                        ['🗑️', 'Recycle Bin', () => openWin('bin')],
                      ] as Array<[string, string, () => void]>
                    ).map(([ic, label, fn]) => (
                      <button key={label} onClick={fn} className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#316ac5] hover:text-white">
                        <span>{ic}</span> {label}
                      </button>
                    ))}
                    <div className="mx-2 my-1 border-t border-black/15" />
                    <a
                      href={import.meta.env.BASE_URL + profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#316ac5] hover:text-white"
                    >
                      <span>📄</span> My Resume
                    </a>
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#316ac5] hover:text-white">
                      <span>✉️</span> E-mail Me
                    </a>
                    <div className="mx-2 my-1 border-t border-black/15" />
                    <button onClick={close} className="flex w-full items-center gap-2 px-3 py-1.5 text-left font-bold hover:bg-[#c1290e] hover:text-white">
                      <span>⏻</span> Shut Down — back to the room
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* taskbar */}
            <div className="flex h-9 shrink-0 items-center gap-1 bg-gradient-to-b from-[#3a81f3] via-[#245edb] to-[#1941a5] pr-2">
              <button
                onClick={() => setStartOpen((v) => !v)}
                className={`flex h-full shrink-0 items-center gap-1 rounded-r-xl bg-gradient-to-b from-[#7ebb4c] via-[#3c9838] to-[#2d7a2a] px-4 font-display text-sm font-bold italic text-white shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)] [text-shadow:1px_1px_2px_rgba(0,0,0,0.6)] hover:brightness-110 ${startOpen ? 'brightness-90' : ''}`}
                title="Start"
              >
                🪟 start
              </button>
              <div className="flex min-w-0 flex-1 gap-1 px-1">
                {wins.map((id) => (
                  <button
                    key={id}
                    onClick={() => (topWin === id && !mini.includes(id) ? minimize(id) : focusWin(id))}
                    className={`flex min-w-0 max-w-40 items-center gap-1 truncate rounded px-2 py-1 text-[11px] text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.5)] ${
                      topWin === id && !mini.includes(id) ? 'bg-[#1c3f8f] shadow-inner' : 'bg-[#3a6fd8] hover:bg-[#4a7de0]'
                    }`}
                  >
                    <span>{winMeta[id].icon}</span>
                    <span className="truncate">{winMeta[id].label}</span>
                  </button>
                ))}
              </div>
              <span className="shrink-0 rounded bg-[#1089d3]/60 px-3 py-1 text-[11px] text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.5)]">
                Esc steps back · {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
