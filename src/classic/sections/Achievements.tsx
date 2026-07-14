import journey from '../../data/journey.json'
import { useReveal } from '../useReveal'
import { useTilt } from '../useTilt'
import type { ClassicTheme } from '../useClassicTheme'

function CertCard({ cert, isTouch }: { cert: { name: string; year: string }; isTouch: boolean }) {
  const tilt = useTilt<HTMLDivElement>(!isTouch)
  return (
    <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} className="card cert-card">
      <div className="medal">
        <span>&apos;{cert.year.slice(-2)}</span>
      </div>
      <div>
        <p className="cert-year">{cert.year}</p>
        <h3 className="cert-name">{cert.name}</h3>
      </div>
    </div>
  )
}

export function Achievements({ theme, isTouch }: { theme: ClassicTheme; isTouch: boolean }) {
  const { ref, inView } = useReveal<HTMLDivElement>()
  const kicker = theme === 'dark' ? '$ ls ~/certs' : 'Exhibit C: Certifications'

  return (
    <section className="section" id="achievements">
      <div ref={ref} className={`section-inner reveal ${inView ? 'in-view' : ''}`}>
        <p className="kicker">{kicker}</p>
        <h2 className="h-section">On the record</h2>

        <div className="grid grid-2">
          {journey.certifications.map((cert) => (
            <CertCard key={cert.name} cert={cert} isTouch={isTouch} />
          ))}
        </div>
      </div>
    </section>
  )
}
