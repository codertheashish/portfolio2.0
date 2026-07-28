'use client'
import { useEffect, useRef } from 'react'

const cats = [
  { ico: '🐍', name: '// LANGUAGES',  pills: ['Python','Java','C','HTML','CSS','JavaScript'] },
  { ico: '🧠', name: '// AI / ML',    pills: ['TensorFlow','OpenCV','MediaPipe','Face-API.js','NLP'] },
  { ico: '🚀', name: '// FRAMEWORKS', pills: ['Flask','Streamlit','Kivy'] },
  { ico: '💾', name: '// DATA & DB',  pills: ['MySQL','Power BI','MS Excel'] },
  { ico: '🛠️', name: '// TOOLS & OS', pills: ['Git','GitHub','Linux','VS Code','Jupyter'] },
  { ico: '💡', name: '// CONCEPTS',   pills: ['OOP','REST API','Agile','Problem Solving'] },
]

const bars = [
  { name: 'Python',                    pct: 90 },
  { name: 'OpenCV / Computer Vision',  pct: 80 },
  { name: 'Machine Learning / TensorFlow', pct: 75 },
  { name: 'Flask / Streamlit',         pct: 72 },
  { name: 'MySQL / Data Analysis',     pct: 68 },
]

export default function Skills() {
  const barsRef = useRef([])

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.w + '%'
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.4 })
    barsRef.current.forEach(el => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="full-wrap" id="skills">
      <section style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="sec-tag anim">tech arsenal</div>
        <h2 className="sec-title anim">Skills Matrix</h2>
        <div className="sec-line anim" />
      </section>

      <div className="skills-grid">
        {cats.map((c, i) => (
          <div className={`skill-cat anim${i > 0 ? ` anim-d${Math.min(i, 3)}` : ''}`} key={c.name}>
            <div className="skill-cat-hd">
              <div className="skill-cat-ico">{c.ico}</div>
              <div className="skill-cat-nm">{c.name}</div>
            </div>
            <div className="skill-pills">
              {c.pills.map(p => <span key={p} className="spill">{p}</span>)}
            </div>
          </div>
        ))}
      </div>

      <section style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="skill-bars">
          <p className="bar-head">// PROFICIENCY LEVELS</p>
          {bars.map((b, i) => (
            <div className={`skill-bar-row anim${i > 0 ? ` anim-d${Math.min(i, 3)}` : ''}`} key={b.name}>
              <div className="skill-bar-top">
                <span className="skill-bar-name">{b.name}</span>
                <span className="skill-bar-pct">{b.pct}%</span>
              </div>
              <div className="skill-bar-track">
                <div
                  className="skill-bar-fill"
                  data-w={b.pct}
                  ref={el => barsRef.current[i] = el}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
