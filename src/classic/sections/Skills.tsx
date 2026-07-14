import skills from '../../data/skills.json'
import { tierLabel } from '../tier'
import { useTilt } from '../useTilt'
import { useReveal } from '../useReveal'
import type { ClassicTheme } from '../useClassicTheme'

function SkillCard({ category, isTouch }: { category: (typeof skills.categories)[number]; isTouch: boolean }) {
  const tilt = useTilt<HTMLDivElement>(!isTouch)
  return (
    <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} className="card">
      <h3 className="h-section" style={{ fontSize: '1.15rem' }}>
        {category.title}
      </h3>
      <p className="muted" style={{ fontSize: '0.86rem', margin: 0 }}>
        {category.blurb}
      </p>
      <div>
        {category.items.map((item) => (
          <div key={item.name} className="skill-item">
            <span className="skill-name">{item.name}</span>
            <span className="skill-tier">{tierLabel(item.level)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Skills({ theme, isTouch }: { theme: ClassicTheme; isTouch: boolean }) {
  const { ref, inView } = useReveal<HTMLDivElement>()
  const kicker = theme === 'dark' ? '$ ls ~/skills' : 'Exhibit D: Skills'

  return (
    <section className="section" id="skills">
      <div ref={ref} className={`section-inner reveal ${inView ? 'in-view' : ''}`}>
        <p className="kicker">{kicker}</p>
        <h2 className="h-section">What I actually use</h2>

        <div className="grid grid-3">
          {skills.categories.map((category) => (
            <SkillCard key={category.id} category={category} isTouch={isTouch} />
          ))}
        </div>
      </div>
    </section>
  )
}
