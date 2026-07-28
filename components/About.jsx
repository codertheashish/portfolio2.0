export default function About() {
  const info = [
    { ico: '🎓', main: 'B.Tech CSE (AI & ML)',            sub: 'SRIMT · AKTU, Lucknow · 2024–2028' },
    { ico: '💼', main: 'AI Intern',                        sub: 'Techpile Technology Pvt. Ltd.' },
    { ico: '📍', main: 'Lucknow, Uttar Pradesh',           sub: 'Origin: Kushinagar, UP' },
    { ico: '📧', main: 'codertheashish@gmail.com',         sub: 'Available for opportunities' },
    { ico: '⚡', main: 'Python · AI · ML · Computer Vision', sub: 'Core expertise' },
  ]

  return (
    <section id="about">
      <div className="sec-tag anim">subject dossier</div>
      <h2 className="sec-title anim">About Me</h2>
      <div className="sec-line anim" />

      <div className="about-grid">
        <div className="about-text anim">
          <p>I&apos;m a B.Tech CSE (AI &amp; ML) student at SRIMT Lucknow (AKTU, 2024–2028), deeply passionate about using Python and Machine Learning to solve real-world problems that actually matter.</p>
          <p>From computer vision tools to voice-enabled chatbots and emotion detection systems — I love building projects that feel like magic. Every line of code is a chance to push what I thought was possible.</p>
          <p>Currently working as an AI Intern at Techpile Technology Pvt. Ltd., where I apply ML concepts in real production environments. I believe the best learning happens when you build things people actually use.</p>
          <p>Always exploring new ML papers, contributing to open source, and leveling up — one commit at a time. 🚀</p>
        </div>

        <div className="info-block anim anim-d1">
          {info.map((r, i) => (
            <div className="info-row" key={i}>
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
