import profile from '../../data/profile.json'
import profilePhoto from '../assets/profile-photo.jpeg'
import { useReveal } from '../useReveal'
import type { ClassicTheme } from '../useClassicTheme'

function Photo() {
  return (
    <div className="photo-frame">
      <img src={profilePhoto} alt={profile.fullName} />
    </div>
  )
}

export function About({ theme }: { theme: ClassicTheme }) {
  const { ref, inView } = useReveal<HTMLDivElement>()
  const kicker = theme === 'dark' ? '$ cat about.md' : 'Exhibit A: About'

  return (
    <section className="section" id="about">
      <div ref={ref} className={`section-inner reveal ${inView ? 'in-view' : ''}`}>
        <p className="kicker">{kicker}</p>
        <h2 className="h-section">Who am I and what do I strive to build?</h2>

        <div className="about-row">
          <Photo />
          <div className="about-copy">
            <p className="lede">{profile.bio}</p>

            <div className="role-chip-row">
              {profile.roles.map((r) => (
                <span key={r} className="role-chip">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
