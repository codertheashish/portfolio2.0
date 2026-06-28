const certs = [
  { ico:'☁️', name:'Generative AI Foundations',      org:'Amazon Web Services (AWS)',      link:'/certificates/aws_gen_ai.jpg' },
  { ico:'🐍', name:'Python 101 for Data Science',    org:'Cognitive Class — IBM',           link:'/certificates/python101.jpg' },
  { ico:'🤖', name:'AI Appreciate',                  org:'AI Student Appreciate ',         link:'/certificates/ai-appreciate.jpg' },
  { ico:'🤖', name:'AI Aware',                       org:'AI Student Aware ',              link:'/certificates/ai-aware.jpg' },
  { ico:'🛡️', name:'Cybersecurity Analyst Simulation',org:'IAA via Forage',                 link:'/certificates/cybersecurity-analyst.jpg' },
  { ico:'📊', name:'MS Excel Mastery',                org:'Simplilearn ',                   link:'/certificates/ms-excel.jpg' },
  { ico:'📊', name:'Power BI ',                       org:'Office Master',                  link:'/certificates/power-bi-workshop.jpg' },
  { ico:'🤝', name:'Professional Networking',         org:'HP LIFE',                        link:'/certificates/hp-life.jpg' },
  { ico:'🏆', name:'Hackathon Participation',         org:'SRIMT Hackathon',                link:'/certificates/hackathon_in_srimt.jpg' },
  { ico:'💻', name:'C Programming Fundamentals',      org:'Simplilearn',                    link:'/certificates/c-programming-basics.jpg' },
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
