'use client'
import { useEffect, useState } from 'react'

const roles = [
  'Python Developer',
  'AI/ML Engineer',
  'Computer Vision Builder',
  'Open Source Creator',
  'Problem Solver',
]

const tags  = ['Python','TensorFlow','OpenCV','MediaPipe','Flask','Streamlit','MySQL','Linux']
const stats = [
  { num: 38,     label: 'Repositories', isCount: true },
  { num: 8,      label: 'Certs',        isCount: true },
  { num: 'AI/ML',label: 'Specialization'},
  { num: '∞',    label: 'Learning' },
]

export default function Hero() {
  const [typed, setTyped] = useState('')
  const [ri, setRi]       = useState(0)
  const [ci, setCi]       = useState(0)
  const [del, setDel]     = useState(false)
  const [photoOk, setPhotoOk] = useState(true)   // falls back to a monogram if the photo file is missing

  useEffect(() => {
    const cur = roles[ri]
    const id  = setTimeout(() => {
      if (!del) {
        setTyped(cur.slice(0, ci + 1))
        if (ci + 1 === cur.length) { setTimeout(() => setDel(true), 1800); return }
        setCi(c => c + 1)
      } else {
        setTyped(cur.slice(0, ci - 1))
        if (ci - 1 === 0) { setDel(false); setRi(r => (r + 1) % roles.length); setCi(0); return }
        setCi(c => c - 1)
      }
    }, del ? 45 : 85)
    return () => clearTimeout(id)
  }, [typed, ci, del, ri])

  return (
    <div className="hero" id="home">
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow anim">SYSTEM ONLINE — LUCKNOW, INDIA</div>
          <h1 className="hero-name anim anim-d1">
            Ashish Kumar<br /><em>Prajapati</em>
          </h1>
          <div className="hero-role anim anim-d2">
            <span>{typed}</span><span className="blink">|</span>
          </div>
          <p className="hero-desc anim anim-d2">
            B.Tech CSE (AI/ML) @ SRIMT Lucknow. Gen AI Intern @ Techpile Technology.
            Building intelligent systems with Python, Computer Vision &amp; Machine Learning — turning ideas into code that actually works.
          </p>
          <div className="hero-tags anim anim-d3">
            {tags.map(t => <span key={t} className="htag">{t}</span>)}
          </div>
          <div className="hero-actions anim anim-d3">
            <a className="btn btn-neon" href="#projects">View Projects ↓</a>
            <a className="btn btn-ghost" href="#contact">Get in Touch →</a>
            <a className="btn btn-ghost" href="/resume/Ashish_Kumar_Prajapati_Resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a>
          </div>
          <div className="hero-stats anim anim-d4">
            {stats.map(s => (
              <div key={s.label}>
                <div
                  className="hstat-num"
                  style={typeof s.num === 'string' ? { fontSize: '1.4rem' } : {}}
                  data-count={s.isCount ? s.num : undefined}
                >
                  {s.num}
                </div>
                <div className="hstat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: profile portrait + (existing) terminal */}
        <div className="hero-visual anim anim-d2">
          <figure className="profile" aria-label="Portrait of Ashish Kumar Prajapati">
            <div className="profile-frame">
              <span className="profile-ring" aria-hidden="true" />
              <span className="profile-ring r2" aria-hidden="true" />
              <div className="profile-glass">
                {photoOk ? (
                  <img src="/profile/ashish-kumar-prajapati.jpg" alt="Ashish Kumar Prajapati" width="320" height="320"
                    className="profile-img" fetchPriority="high" onError={() => setPhotoOk(false)} />
                ) : (
                  <div className="profile-mono" aria-hidden="true">AP</div>
                )}
                <span className="profile-scan" aria-hidden="true" />
              </div>
              <span className="profile-corner tl" aria-hidden="true" /><span className="profile-corner br" aria-hidden="true" />
            </div>
            <figcaption className="profile-cap">
              <span className="profile-name">ASHISH KUMAR PRAJAPATI</span>
              <span className="profile-meta">AI/ML • PYTHON • COMPUTER VISION</span>
            </figcaption>
          </figure>

        {/* Terminal */}
        <div className="terminal">
          <div className="term-hdr">
            <div className="dot-r" /><div className="dot-y" /><div className="dot-g" />
            <div className="term-title">dev.profile.py</div>
          </div>
          <div className="term-body">
            <div><span className="tc"># Ashish Kumar Prajapati</span></div>
            <div>&nbsp;</div>
            <div><span className="tk">class</span> <span className="tcl">Developer</span>:</div>
            <div>&nbsp;&nbsp;name&nbsp;&nbsp;&nbsp;= <span className="ts">"Ashish Kumar Prajapati"</span></div>
            <div>&nbsp;&nbsp;role&nbsp;&nbsp;&nbsp;= <span className="ts">"Python Dev / AI-ML"</span></div>
            <div>&nbsp;&nbsp;base&nbsp;&nbsp;&nbsp;= <span className="ts">"Lucknow, India 🇮🇳"</span></div>
            <div>&nbsp;&nbsp;degree&nbsp;= <span className="ts">"B.Tech CSE (AI/ML)"</span></div>
            <div>&nbsp;</div>
            <div>&nbsp;&nbsp;stack = [</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="ts">"Python"</span>, <span className="ts">"TensorFlow"</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="ts">"OpenCV"</span>, <span className="ts">"Flask"</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="ts">"Streamlit"</span>, <span className="ts">"MySQL"</span></div>
            <div>&nbsp;&nbsp;]</div>
            <div>&nbsp;</div>
            <div>&nbsp;&nbsp;<span className="tk">def</span> <span className="tf">status</span>(self):</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="tk">return</span> {'{'}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ts">"internship"</span>: <span className="tn">True</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ts">"open_to_work"</span>: <span className="tn">True</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ts">"coffee_needed"</span>: <span className="tn">True</span></div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{'}'}</div>
            <div>&nbsp;</div>
            <div><span className="ts">✓ Ready.</span><span className="blink"> ▊</span></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
