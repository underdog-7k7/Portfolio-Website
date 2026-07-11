import type { ReactNode } from 'react'
import { useAppStore } from '../store/useAppStore'
import { SkillsPanel } from './SkillsPanel'
import { ProjectPanel } from './ProjectPanel'
import { ContactCard } from './ContactCard'
import { JokeToast } from './JokeToast'
import { JukeboxPanel } from './JukeboxPanel'
import { AgentPanel } from './AgentPanel'
import { IdeaPanel } from './IdeaPanel'
import { LaptopScreen } from './LaptopScreen'
import { TVCarousel } from './TVCarousel'
import { CurrentWorkPanel } from './CurrentWorkPanel'
import { JourneyPanel } from './JourneyPanel'

/**
 * Panel shell. Layout is viewport-driven: an invisible flex container fills
 * the screen and the card sizes itself inside it, so it adapts to any window
 * height (taskbar, split-screen, fullscreen) instead of assuming 100vh.
 * Mobile: bottom sheet. Desktop: right-side card, vertically centered but
 * never taller than the actual viewport.
 */
function Panel({ title, children }: { title: string; children: ReactNode }) {
  const close = useAppStore((s) => s.closeOverlay)
  const isTouch = useAppStore((s) => s.isTouch)
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:justify-end sm:p-5">
      <div className="pointer-events-auto flex max-h-[85dvh] w-full animate-rise flex-col rounded-t-3xl bg-ink/92 text-cream shadow-2xl backdrop-blur-md sm:max-h-full sm:w-[400px] sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
          <h2 className="font-display text-xl font-bold text-amberish">{title}</h2>
          <button onClick={close} aria-label="Close" className="rounded-full bg-cream/10 px-2.5 py-0.5 text-sm text-cream/80 hover:bg-cream/20">
            ✕
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-5 pb-5">
          {children}
          {!isTouch && <p className="mt-4 text-center text-[10px] text-cream/40">walk away to close · Esc frees the cursor for links</p>}
        </div>
      </div>
    </div>
  )
}

export function OverlayRoot() {
  const overlay = useAppStore((s) => s.overlay)
  if (!overlay) return null
  switch (overlay.kind) {
    case 'skills':
      return <SkillsPanel categoryId={overlay.categoryId} Panel={Panel} />
    case 'project':
      return <ProjectPanel projectId={overlay.projectId} Panel={Panel} />
    case 'contact':
      return <ContactCard Panel={Panel} />
    case 'joke':
      return <JokeToast />
    case 'jukebox':
      return <JukeboxPanel Panel={Panel} />
    case 'agent':
      return <AgentPanel Panel={Panel} />
    case 'idea':
      return <IdeaPanel Panel={Panel} />
    case 'laptop':
      return <LaptopScreen />
    case 'tv':
      return <TVCarousel />
    case 'current':
      return <CurrentWorkPanel Panel={Panel} />
    case 'journey':
      return <JourneyPanel Panel={Panel} />
  }
}

export type PanelComponent = typeof Panel
