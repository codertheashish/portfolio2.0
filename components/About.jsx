'use client'
import { useCollection } from '../lib/useCollection'
import { DEFAULT_ABOUT_TEXT, DEFAULT_ABOUT_INFO } from '../lib/defaultData'

export default function About() {
  const paras = useCollection('AboutText', DEFAULT_ABOUT_TEXT)
  const info  = useCollection('AboutInfo', DEFAULT_ABOUT_INFO)

  return (
    <section id="about">
      <div className="sec-tag anim">subject dossier</div>
      <h2 className="sec-title anim">About Me</h2>
      <div className="sec-line anim" />

      <div className="about-grid">
        <div className="about-text anim in">
          {paras.map((p, i) => <p key={p.id || i}>{p.text}</p>)}
        </div>

        <div className="info-block anim anim-d1 in">
          {info.map((r, i) => (
            <div className="info-row" key={r.id || i}>
              <div className="info-ico">{r.ico}</div>
              <div>
                <div className="info-main">{r.main}</div>
                <div className="info-sub">{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
