'use client'
import { useState } from 'react'

const projects = [
  { num:'01', emoji:'✍️', cat:'cv',   img:'/projects/Ai_air_writing.png',     title:'AI Air Writing',        link:'https://github.com/codertheashish/Ai-Air-Writing',     stack:['Python','OpenCV','MediaPipe'],   desc:'Real-time AI system — draw in the air using only your index finger. MediaPipe hand tracking + OpenCV virtual canvas. Full color palette & eraser support.' },
  { num:'02', emoji:'🤖', cat:'ai',   img:'/projects/Arc_chatbot.png',        title:'ARC Chatbot',           link:'https://github.com/codertheashish/ARC-Chatbot',        stack:['Python','NLP','pyttsx3'],        desc:'Voice-enabled Python chatbot with text & speech response. NLP fundamentals + TTS integration. Conversational AI that listens and talks back — in the terminal.' },
  { num:'03', emoji:'🧥', cat:'cv',   img:'/projects/Invisible_cloak.png',    title:'Invisible Cloak',       link:'https://github.com/codertheashish/Invisible-Cloth',    stack:['Python','OpenCV','HSV Masking'], desc:'Harry Potter-style real-time invisibility. HSV color masking replaces a cloth with live background — seamless illusion using frame-difference technique.' },
  { num:'04', emoji:'😊', cat:'ai',   img:'/projects/Emotion_detection.png',  title:'Emotion Detection',     link:'https://github.com/codertheashish/Emotion-Detection',  stack:['HTML/JS','Face-API.js','WebRTC'],desc:'Browser-based real-time emotion detection via Face-API.js. 7 emotions detected live from webcam — happy, sad, angry, fearful, surprised, disgusted, neutral.' },
  { num:'06', emoji:'✋', cat:'cv',   img:'/projects/AR_hand_tracking.png',   title:'AR Hand Tracking',      link:'https://github.com/codertheashish/AR-Hand-Tracking',   stack:['Python','OpenCV','MediaPipe','Augmented Reality'], desc:'Real-time AR hand tracking using MediaPipe and OpenCV, enabling gesture recognition and interactive virtual overlays with 21 hand landmarks.'},
  { num:'06', emoji:'🎂', cat:'web',  img:'/projects/Birthday_site.png',      title:'Birthday Surprise Site',link:'https://github.com/codertheashish/Happy-Birthday',     stack:['HTML','CSS','JS','Web Audio'],  desc:'Cinematic interactive birthday experience with CSS animations, background music, memory gallery and personalized messages. Advanced frontend creative skills.' },
  { num:'05', emoji:'🕵️', cat:'ai',   img:'/projects/Deepfake_detection.png', title:'Deepfake Detection',    link:'https://github.com/codertheashish/Deepfake-Detection-Images',stack:['Python','TensorFlow','OpenCV','CNN'],desc:'AI-powered image deepfake detector that classifies real and manipulated faces using a CNN model with TensorFlow and OpenCV.'},
  { num:'04', emoji:'📄', cat:'ai',   img:'/projects/AI_resume_analyzer.png', title:'AI Resume Analyzer',    link:'https://github.com/codertheashish/AI-Resume-Analyzer', stack:['Python','Flask','Gemini AI','PDF Parsing','HTML/CSS','JavaScript'], desc:'Smart AI-powered resume analysis platform with ATS scoring, resume parsing, job description matching, skill-gap detection, and personalized optimization suggestions to enhance interview readiness.'
},
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

  return (
    <section id="projects">
      <div className="sec-tag anim in">mission logs</div>
      <h2 className="sec-title anim in">What I&apos;ve Built</h2>
      <div className="sec-line anim in" />

      <div className="proj-filter anim in">
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
        {projects.map((p) => (
          <div
            key={p.num}
            className="proj-card in"
            style={{ display: (active === 'all' || p.cat === active) ? 'block' : 'none', padding: 0, overflow: 'hidden' }}
            onClick={() => window.open(p.link, '_blank')}
          >
            {/* Project Image */}
            <div style={{
              width: '100%',
              height: '220px',
              overflow: 'hidden',
              borderBottom: '1px solid rgba(0,255,136,0.1)',
              background: '#020a0f',
              position: 'relative'
            }}>
              <img
                src={p.img}
                alt={p.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.85,
                  transition: 'opacity 0.3s, transform 0.3s',
                }}
                onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.transform = 'scale(1.05)' }}
                onMouseLeave={e => { e.target.style.opacity = 0.85; e.target.style.transform = 'scale(1)' }}
                onError={e => {
                  e.target.parentElement.style.display = 'flex'
                  e.target.parentElement.style.alignItems = 'center'
                  e.target.parentElement.style.justifyContent = 'center'
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<span style="font-size:40px">${p.emoji}</span>`
                }}
              />
            </div>

            {/* Card Content */}
            <div style={{ padding: '1.75rem' }}>
              <div className="proj-num">// {p.num}</div>
              <div className="proj-title">{p.title}</div>
              <div className="proj-desc">{p.desc}</div>
              <div className="proj-stack">
                {p.stack.map(s => <span key={s} className="proj-stk">{s}</span>)}
              </div>
              <div className="proj-link">View on GitHub →</div>
            </div>
          </div>
        ))}
      </div>

      <div className="proj-more-wrap anim in">
        <a
          className="btn-repos"
          href="https://github.com/codertheashish?tab=repositories"
          target="_blank"
          rel="noreferrer"
        >
          View All Repositories
          <span className="btn-repos-count">32 REPOS ↗</span>
        </a>
      </div>
    </section>
  )
}
