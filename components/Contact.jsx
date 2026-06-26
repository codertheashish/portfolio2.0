'use client'
import { useState } from 'react'

const socials = [
  { icon:'⌥', label:'GITHUB',    val:'github.com/codertheashish',         href:'https://github.com/codertheashish' },
  { icon:'in', label:'LINKEDIN',  val:'ashish-kumar-prajapati',             href:'https://www.linkedin.com/in/ashish-kumar-prajapati-3b6858301' },
  { icon:'@',  label:'EMAIL',     val:'codertheashish@gmail.com',           href:'mailto:codertheashish@gmail.com' },
  { icon:'◉',  label:'INSTAGRAM', val:'@codertheashish',                    href:'https://www.instagram.com/codertheashish' },
]

export default function Contact() {
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [subj,  setSubj]  = useState('')
  const [msg,   setMsg]   = useState('')
  const [status, setStatus] = useState('>_ awaiting input...')
  const [statusColor, setStatusColor] = useState('')

  function sendMsg() {
    if (!name.trim() || !email.trim() || !msg.trim()) {
      setStatus('⚠ Required fields missing.')
      setStatusColor('#ff5f57')
      return
    }
    const subject = subj.trim() || 'Portfolio Contact'
    window.location.href =
      `mailto:codertheashish@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg)}`
    setStatus('✓ Opening your email client...')
    setStatusColor('var(--g)')
  }

  return (
    <div className="full-wrap" id="contact">
      <section style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="sec-tag anim">contact portal</div>
        <h2 className="sec-title anim">Let&apos;s Connect</h2>
        <div className="sec-line anim" />

        <div className="contact-grid">
          <div>
            <p className="contact-title anim">Let&apos;s build<br />something <span>great</span></p>
            <p className="contact-desc anim">Open to internships, collaborations, and interesting AI/ML projects. Whether it&apos;s building something cool or exploring new ideas — feel free to reach out!</p>
            <div className="social-list anim">
              {socials.map(s => (
                <a key={s.label} className="soc-row" href={s.href} target="_blank" rel="noreferrer">
                  <span className="soc-icon">{s.icon}</span>
                  <span className="soc-label">{s.label}</span>
                  <span className="soc-val">{s.val}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="anim anim-d1">
            <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text2)', letterSpacing:3, marginBottom:'1rem' }}>// SEND A MESSAGE</p>
            <div className="cform">
              <input  className="cinput" type="text"  placeholder="Your Name"       value={name}  onChange={e => setName(e.target.value)}  />
              <input  className="cinput" type="email" placeholder="your@email.com"  value={email} onChange={e => setEmail(e.target.value)} />
              <input  className="cinput" type="text"  placeholder="Subject"          value={subj}  onChange={e => setSubj(e.target.value)}  />
              <textarea className="cinput" placeholder="Your message..." value={msg} onChange={e => setMsg(e.target.value)} />
              <button className="csend" onClick={sendMsg}>SEND MESSAGE →</button>
              <p className="form-note" style={{ color: statusColor || undefined }}>{status}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
