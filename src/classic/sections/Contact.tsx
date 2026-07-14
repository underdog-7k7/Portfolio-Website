import { useEffect, useState } from 'react'
import profile from '../../data/profile.json'
import { Icon } from '../Icon'
import { useReveal } from '../useReveal'
import { formatLastUpdated } from '../lastUpdated'
import type { ClassicTheme } from '../useClassicTheme'

const ICON_BY_LABEL: Record<string, string> = {
  GitHub: 'github',
  LinkedIn: 'linkedin',
  'Google Dev': 'google',
  Instagram: 'instagram',
}

function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
  return Promise.resolve()
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <button type="button" onClick={() => copyText(email).then(() => setCopied(true))} className="social-link copy-link">
      <Icon icon="envelope-fill" size={16} />
      {email}
      <span className={`copy-affordance ${copied ? 'copied' : ''}`}>{copied ? 'Copied ✓' : 'Copy'}</span>
    </button>
  )
}

export function Contact({ theme }: { theme: ClassicTheme }) {
  const { ref, inView } = useReveal<HTMLDivElement>()
  const kicker = theme === 'dark' ? '$ ./contact.sh' : 'Exhibit F: Contact'
  const resumeUrl = `${import.meta.env.BASE_URL}${profile.resume}`

  return (
    <section className="section" id="contact">
      <div ref={ref} className={`section-inner reveal ${inView ? 'in-view' : ''}`}>
        <p className="kicker">{kicker}</p>
        <h2 className="h-section">Let's talk (or maybe hasta la vista)</h2>
        <p className="lede">
          Open to conversations about AI engineering roles, RAG platforms and agentic systems. The quickest way
          in is email.
        </p>

        <div className="social-row">
          <CopyEmail email={profile.email} />
          <a href={resumeUrl} target="_blank" rel="noopener" className="social-link">
            <Icon icon="file-earmark-person-fill" size={16} /> Resume
          </a>
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener" className="social-link">
              <Icon icon={ICON_BY_LABEL[s.label] ?? 'folder-fill'} size={16} /> {s.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          <a href="#top" className="hint">
            ↑ Still curious? Step inside the 3D house.
          </a>
          <p className="footer-note">Last updated {formatLastUpdated(__LAST_UPDATED__)}</p>
        </div>
      </div>
    </section>
  )
}
