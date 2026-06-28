'use client'
import { useState } from 'react'

const certs = [
  { ico:'🤖', name:'Generative AI Foundations',        org:'Amazon Web Services (AWS) · 2 Badges', multi:[{ label:'Generative AI', link:'/certificates/aws_gen_ai.jpg'},{ label:'Generative AI Badge', link:'/certificates/generative Ai.jpg'}]},
  { ico:'🐍', name:'Python 101 for Data Science',      org:'Cognitive Class — IBM',                link:'/certificates/python101.jpg' },
  { ico:'🤖', name:'AI Appreciate + AI Aware',         org:'AI Student Community · 2 Badges',      multi:[{ label:'AI Appreciate', link:'/certificates/ai-appreciate.jpg'},{ label:'AI Aware', link:'/certificates/ai-aware.jpg'}]},
  { ico:'🛡️', name:'Cybersecurity Analyst Simulation', org:'IAA via Forage',                       link:'/certificates/cybersecurity-analyst.jpg' },
  { ico:'📊', name:'MS Excel Mastery',                 org:'Simplilearn',                          link:'/certificates/ms-excel.jpg' },
  { ico:'📊', name:'Power BI',                         org:'Office Master',                        link:'/certificates/power-bi-workshop.jpg' },
  { ico:'🤝', name:'Professional Networking',          org:'HP LIFE',                              link:'/certificates/hp-life.jpg' },
  { ico:'🏆', name:'Hackathon Participation',          org:'SRIMT Hackathon',                      link:'/certificates/hackathon_in_srimt.jpg' },
  { ico:'💻', name:'C Programming Fundamentals',       org:'Simplilearn',                          link:'/certificates/c-programming-basics.jpg' },
]

export default function Certs() {
  const [popup, setPopup] = useState(null)

  return (
    <section id="certs">
      <div className="sec-tag anim">verified credentials</div>
      <h2 className="sec-title anim">Certifications</h2>
      <div className="sec-line anim" />

      <div className="certs-grid">
        {certs.map((c, i) => (
          c.multi ? (
            <div
              key={i}
              className="cert-card"
              style={{cursor:'pointer'}}
              onClick={() => setPopup(c.multi)}
            >
              <div className="cert-ico">{c.ico}</div>
              <div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-org">{c.org}</div>
                <div className="cert-badge">VIEW CERTIFICATE</div>
              </div>
            </div>
          ) : (
            
              key={i}
              className="cert-card"
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
          )
        ))}
      </div>

      {popup && (
        <div
          onClick={() => setPopup(null)}
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.9)',
            zIndex:9999, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            gap:'1.5rem', padding:'2rem', cursor:'pointer'
          }}
        >
          <p style={{fontFamily:'monospace', fontSize:11, letterSpacing:3, color:'#4a7a8a'}}>
            CLICK ANYWHERE TO CLOSE
          </p>
          <div style={{display:'flex', gap:'1.5rem', flexWrap:'wrap', justifyContent:'center'}}>
            {popup.map((item, i) => (
              
                key={i}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  gap:'0.75rem', border:'1px solid rgba(0,255,136,0.25)',
                  padding:'1.25rem', background:'#041018', textDecoration:'none'
                }}
              >
                <img src={item.link} alt={item.label}
                  style={{width:220, height:'auto'}}
                  onError={e => { e.target.style.display='none' }}
                />
                <span style={{fontFamily:'monospace', fontSize:11, letterSpacing:2, color:'#00ff88'}}>
                  ↗ {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
