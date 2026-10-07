'use client'
import { useCollection, splitList } from '../lib/useCollection'
import { DEFAULT_EDUCATION } from '../lib/defaultData'

export default function Education() {
  const items = useCollection('Education', DEFAULT_EDUCATION)
  return (
    <section id="education">
      <div className="sec-tag anim">academic log</div>
      <h2 className="sec-title anim">Education</h2>
      <div className="sec-line anim" />

      <div className="timeline">
        {items.map((it, i) => (
          <div className="tl-item anim in" key={it.id || i}>
            <div className="tl-dot" />
            <div className="tl-date">{it.date}</div>
            <div className="tl-role">{it.degree}</div>
            <div className="tl-company">{it.institute}</div>
            {it.desc && <div className="tl-desc">{it.desc}</div>}
            <div className="tl-tags">
              {splitList(it.tags).map(t => <span key={t} className="tl-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
