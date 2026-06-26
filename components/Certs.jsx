const certs = [
  { ico:'☁️', name:'Generative AI Foundations',      org:'Amazon Web Services (AWS)',      link:'YOUR_AWS_CERT_LINK_HERE' },
  { ico:'🐍', name:'Python 101 for Data Science',    org:'Cognitive Class — IBM',           link:'YOUR_IBM_CERT_LINK_HERE' },
  { ico:'🤖', name:'AI Appreciate + AI Aware',        org:'AI Student Community · 2 Badges', link:'YOUR_AI_COMMUNITY_CERT_LINK_HERE' },
  { ico:'🛡️', name:'Cybersecurity Analyst Simulation',org:'IAA via Forage',                 link:'YOUR_FORAGE_CERT_LINK_HERE' },
  { ico:'📊', name:'Power BI & MS Excel Mastery',     org:'Simplilearn / Office Master',    link:'YOUR_POWERBI_CERT_LINK_HERE' },
  { ico:'🤝', name:'Professional Networking',         org:'HP LIFE',                        link:'YOUR_HPLIFE_CERT_LINK_HERE' },
  { ico:'🏆', name:'Hackathon Participation',         org:'SRIMT Hackathon',                link:'YOUR_HACKATHON_CERT_LINK_HERE' },
  { ico:'💻', name:'C Programming Fundamentals',      org:'Simplilearn',                    link:'YOUR_C_CERT_LINK_HERE' },
]

export default function Certs() {
  return (
    <section id="certs">
      <div className="sec-tag anim">verified credentials</div>
      <h2 className="sec-title anim">Certifications</h2>
      <div className="sec-line anim" />

      <div className="certs-grid">
        {certs.map((c, i) => (
          <a
            key={i}
            className={`cert-card anim${i % 4 > 0 ? ` anim-d${i % 4}` : ''}`}
            href={c.link}
            target="_blank"
            rel="noreferrer"
          >
            <div className="cert-ico">{c.ico}</div>
            <div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-org">{c.org}</div>
              <div className="cert-badge">VIEW CERTIFICATE</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
