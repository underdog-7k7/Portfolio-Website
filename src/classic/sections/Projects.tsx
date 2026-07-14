import projects from '../../data/projects.json'
import { Icon } from '../Icon'
import { useTilt } from '../useTilt'
import { useReveal } from '../useReveal'
import type { ClassicTheme } from '../useClassicTheme'

interface Project {
  id: string
  title: string
  subtitle: string
  category: string
  date: string
  description: string
  tech: string[]
  image: string
  proprietary?: boolean
  github?: string
  live?: string
  extraLinks?: { label: string; url: string }[]
}

const allProjects = projects.projects as Project[]

function ProjectCard({ project, isTouch }: { project: Project; isTouch: boolean }) {
  const tilt = useTilt<HTMLDivElement>(!isTouch)
  return (
    <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} className="card">
      <span className="kicker" style={{ fontSize: '0.66rem' }}>
        {project.category}
      </span>
      <h3 className="h-section" style={{ fontSize: '1.2rem' }}>
        {project.title}
      </h3>
      <p className="muted" style={{ fontSize: '0.84rem', margin: 0 }}>
        {project.subtitle} · {project.date}
      </p>
      <p style={{ fontSize: '0.88rem', lineHeight: 1.6, margin: '4px 0' }}>{project.description}</p>

      <div className="chip-row">
        {project.tech.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <div className="chip-row" style={{ marginTop: 6 }}>
        {project.proprietary && <span className="badge">🔒 Proprietary</span>}
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener" className="badge badge-live">
            ● Watch it live
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener" className="social-link">
            <Icon icon="github" size={15} /> View on GitHub
          </a>
        )}
        {project.extraLinks?.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener" className="social-link">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export function Projects({ theme, isTouch }: { theme: ClassicTheme; isTouch: boolean }) {
  const { ref, inView } = useReveal<HTMLDivElement>()
  const kicker = theme === 'dark' ? '$ ls ~/projects' : 'Exhibit B: Projects'

  return (
    <section className="section" id="projects">
      <div ref={ref} className={`section-inner reveal ${inView ? 'in-view' : ''}`}>
        <p className="kicker">{kicker}</p>
        <h2 className="h-section">Things I've shipped</h2>

        <div className="grid grid-2">
          {allProjects.map((project) => (
            <ProjectCard key={project.id} project={project} isTouch={isTouch} />
          ))}
        </div>
      </div>
    </section>
  )
}
