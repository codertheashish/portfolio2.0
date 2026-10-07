'use client'
import { useEffect, useRef } from 'react'
import { useCollection, splitList } from '../lib/useCollection'
import { DEFAULT_SKILL_GROUPS, DEFAULT_SKILL_BARS } from '../lib/defaultData'

export default function Skills() {
  const cats = useCollection('SkillGroups', DEFAULT_SKILL_GROUPS)
  const bars = useCollection('SkillBars', DEFAULT_SKILL_BARS)
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
  }, [bars])

  return (
    <div className="full-wrap" id="skills">
      <section style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="sec-tag anim">tech arsenal</div>
        <h2 className="sec-title anim">Skills Matrix</h2>
        <div className="sec-line anim" />
      </section>

      <div className="skills-grid">
        {cats.map((c, i) => (
          <div className="skill-cat anim in" key={c.id || c.name}>
            <div className="skill-cat-hd">
              <div className="skill-cat-ico">{c.ico}</div>
              <div className="skill-cat-nm">{c.name}</div>
            </div>
            <div className="skill-pills">
              {splitList(c.pills).map(p => <span key={p} className="spill">{p}</span>)}
            </div>
          </div>
        ))}
      </div>

      <section style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="skill-bars">
          <p className="bar-head">// PROFICIENCY LEVELS</p>
          {bars.map((b, i) => (
            <div className="skill-bar-row anim in" key={(b.id || b.name) + b.pct}>
              <div className="skill-bar-top">
                <span className="skill-bar-name">{b.name}</span>
                <span className="skill-bar-pct">{b.pct}%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" data-w={b.pct} ref={el => (barsRef.current[i] = el)} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
