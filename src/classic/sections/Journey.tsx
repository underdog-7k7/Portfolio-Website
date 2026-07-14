import type { CSSProperties } from 'react'
import journey from '../../data/journey.json'
import { useReveal } from '../useReveal'
import type { ClassicTheme } from '../useClassicTheme'

export function Journey({ theme }: { theme: ClassicTheme }) {
  const { ref, inView } = useReveal<HTMLDivElement>()
  const kicker = theme === 'dark' ? '$ git log -7' : 'Exhibit E: Journey'

  return (
    <section className="section" id="journey">
      <div ref={ref} className={`section-inner reveal ${inView ? 'in-view' : ''}`}>
        <p className="kicker">{kicker}</p>
        <h2 className="h-section">{journey.title}</h2>

        <div className="timeline">
          {journey.stops.map((stop) => (
            <div
              key={stop.year + stop.title}
              className="timeline-item"
              data-type={stop.type}
              style={{ '--tl-color': `var(--type-${stop.type})` } as CSSProperties}
            >
              <span className="timeline-year">{stop.year}</span>
              <h3 className="timeline-title">{stop.title}</h3>
              <p className="timeline-org">{stop.org}</p>
              <p className="timeline-detail muted">{stop.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
