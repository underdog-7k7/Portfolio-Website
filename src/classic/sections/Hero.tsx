import profile from '../../data/profile.json'
import { useTypewriter } from '../../ui/useTypewriter'
import { Cube3D } from '../Cube3D'
import { useTilt } from '../useTilt'
import type { ClassicTheme } from '../useClassicTheme'

export function Hero({
  theme,
  ready,
  progress,
  loadingRequested,
  onEnter,
  isTouch,
}: {
  theme: ClassicTheme
  ready: boolean
  progress: number
  loadingRequested: boolean
  onEnter: () => void
  isTouch: boolean
}) {
  const typed = useTypewriter(profile.roles)
  const tilt = useTilt<HTMLButtonElement>(!isTouch)

  const kicker = theme === 'dark' ? '> whoami?' : 'Who_am_I? '

  return (
    <section className="section hero-section" id="top">
      <div className="section-inner">
        <div className="hero-row">
          <div className="hero-copy">
            <p className="kicker">{kicker}</p>
            <h1 className="h-hero">{profile.fullName}</h1>
            <p className="lede">{typed || ' '}</p>
            <p className="lede muted">{profile.location} · building GenAI systems, agentic workflows and the FastAPI backends that hold them up.</p>

            <div className="hero-cta-row">
              {!loadingRequested ? (
                <button
                  ref={tilt.ref}
                  onMouseMove={tilt.onMouseMove}
                  onMouseLeave={tilt.onMouseLeave}
                  onClick={onEnter}
                  className="btn"
                  type="button"
                >
                  Click this for a 3-Dimensional View of my Work →
                </button>
              ) : (
                <div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.max(progress, 6)}%` }} />
                  </div>
                  <p className="progress-label">{ready ? 'Stepping inside…' : `Loading the house… ${Math.round(progress)}%`}</p>
                </div>
              )}
              <a href="#about" className="hint">
                Or if you Prefer scrolling? The classic version continues below ↓
              </a>
            </div>
          </div>

          <Cube3D />
        </div>
      </div>
    </section>
  )
}
