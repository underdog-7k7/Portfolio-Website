import './classic.css'
import { useAppStore } from '../store/useAppStore'
import { useClassicTheme } from './useClassicTheme'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Journey } from './sections/Journey'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Contact } from './sections/Contact'
import { Achievements } from './sections/Achievements'

export function ClassicLanding({
  ready,
  progress,
  loadingRequested,
  onEnter,
}: {
  ready: boolean
  progress: number
  loadingRequested: boolean
  onEnter: () => void
}) {
  const { theme, toggle } = useClassicTheme()
  const isTouch = useAppStore((s) => s.isTouch)

  return (
    <div className="classic-shell scanlines" data-theme={theme}>
      <button type="button" className="classic-toggle" onClick={toggle}>
        {theme === 'dark' ? 'Let there be light' : 'If you insist, darkness'}
      </button>

      <Hero theme={theme} ready={ready} progress={progress} loadingRequested={loadingRequested} onEnter={onEnter} isTouch={isTouch} />
      <About theme={theme} />
      <Projects theme={theme} isTouch={isTouch} />
      <Achievements theme={theme} isTouch={isTouch} />
      <Skills theme={theme} isTouch={isTouch} />
      <Journey theme={theme} />
      <Contact theme={theme} />
    </div>
  )
}
