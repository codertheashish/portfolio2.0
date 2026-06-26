'use client'
import { useState } from 'react'

const projects = [
  { num:'01', emoji:'✍️', cat:'cv',   title:'AI Air Writing',       link:'https://github.com/codertheashish/Ai-Air-Writing',   stack:['Python','OpenCV','MediaPipe'], desc:'Real-time AI system — draw in the air using only your index finger. MediaPipe hand tracking + OpenCV virtual canvas. Full color palette & eraser support.' },
  { num:'02', emoji:'🤖', cat:'ai',   title:'ARC Chatbot',          link:'https://github.com/codertheashish/ARC-Chatbot',       stack:['Python','NLP','pyttsx3'],       desc:'Voice-enabled Python chatbot with text & speech response. NLP fundamentals + TTS integration. Conversational AI that listens and talks back — in the terminal.' },
  { num:'03', emoji:'🧥', cat:'cv',   title:'Invisible Cloak',      link:'https://github.com/codertheashish/Invisible-Cloth',   stack:['Python','OpenCV','HSV Masking'],desc:'Harry Potter-style real-time invisibility. HSV color masking replaces a cloth with live background — seamless illusion using frame-difference technique.' },
  { num:'04', emoji:'😊', cat:'ai',   title:'Emotion Detection',    link:'https://github.com/codertheashish/Emotion-Detection',  stack:['HTML/JS','Face-API.js','WebRTC'],desc:'Browser-based real-time emotion detection via Face-API.js. 7 emotions detected live from webcam — happy, sad, angry, fearful, surprised, disgusted, neutral.' },
  { num:'05', emoji:'🧮', cat:'web',  title:'Android Calculator',   link:'https://github.com/codertheashish/Calculator-App',    stack:['Python','Kivy','Android'],      desc:'Clean responsive Android calculator with Python & Kivy. Full-screen mobile experience, packaged and deployed for Android. All arithmetic ops — smooth UI.' },
  { num:'06', emoji:'🎂', cat:'web',  title:'Birthday Surprise Site',link:'https://github.com/codertheashish/Happy-Birthday',   stack:['HTML','CSS','JS','Web Audio'],  desc:'Cinematic interactive birthday experience with CSS animations, background music, memory gallery and personalized messages. Advanced frontend creative skills.' },
  { num:'07', emoji:'📋', cat:'util', title:'Attendance Tracker',   link:'https://github.com/codertheashish/Attendance-Tracker', stack:['Python','CSV','CLI'],           desc:'Python-based Student Attendance System with CSV storage. Add students, mark attendance, auto-calculate percentages, flag low-attendance warnings.' },
  { num:'08', emoji:'📱', cat:'util', title:'QR Code Generator',    link:'https://github.com/codertheashish/Qr-Code',           stack:['Python','qrcode','Pillow'],     desc:'Instant QR code generation for any URL, text or data. Lightweight Python tool — outputs high-quality PNG. Simple, fast, no-fluff utility.' },
]

const filters = [
  { label: 'All Projects', cat: 'all' },
  { label: 'Computer Vision', cat: 'cv' },
  { label: 'AI / NLP', cat: 'ai' },
  { label: 'Web / App', cat: 'web' },
  { label: 'Utilities', cat: 'util' },
]

export default function Projects() {
  const [active, setActive] = useState('all')
  const visible = projects.filter(p => active === 'all' || p.cat === active)

  return (
    <section id="projects">
      <div className="sec-tag anim">mission logs</div>
      <h2 className="sec-title anim">What I&apos;ve Built</h2>
      <div className="sec-line anim" />

      <div className="proj-filter anim">
        {filters.map(f => (
          <button
            key={f.cat}
            className={`filt-btn${active === f.cat ? ' active' : ''}`}
            onClick={() => setActive(f.cat)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="proj-grid">
        {visible.map((p, i) => (
          <div
            key={p.num}
            className={`proj-card anim${i % 3 > 0 ? ` anim-d${i % 3}` : ''}`}
            onClick={() => window.open(p.link, '_blank')}
          >
            <div className="proj-num">// {p.num}</div>
            <span className="proj-emoji">{p.emoji}</span>
            <div className="proj-title">{p.title}</div>
            <div className="proj-desc">{p.desc}</div>
            <div className="proj-stack">
              {p.stack.map(s => <span key={s} className="proj-stk">{s}</span>)}
            </div>
            <div className="proj-link">View on GitHub →</div>
          </div>
        ))}
      </div>

      <div className="proj-more-wrap anim">
        <a
          className="btn-repos"
          href="https://github.com/codertheashish?tab=repositories"
          target="_blank"
          rel="noreferrer"
        >
          View All Repositories
          <span className="btn-repos-count">18 REPOS ↗</span>
        </a>
      </div>
    </section>
  )
}
