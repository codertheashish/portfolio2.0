const items = [
  {
    date: '2025 — PRESENT',
    role: 'AI Intern',
    company: 'Techpile Technology Pvt. Ltd.',
    desc: 'Working on real-world AI/ML projects, applying computer vision and Python-based automation to solve production-level problems. Collaborating with development teams to build intelligent solutions at scale.',
    tags: ['Python', 'AI/ML', 'Computer Vision'],
  },
  {
    date: '2025 — HACKATHON',
    role: 'Hackathon Participant',
    company: 'SRIMT Hackathon — Lucknow',
    desc: 'Built rapid-prototype solutions under pressure. Applied AI/ML skills in a competitive environment. Received participation certificate — experience in team-based problem solving and fast delivery.',
    tags: ['Hackathon', 'Teamwork', 'Problem Solving'],
  },
  {
    date: '2024 — PRESENT',
    role: 'B.Tech — CSE (AI & ML)',
    company: 'SRIMT, AKTU — Lucknow · Expected 2028',
    desc: 'Bachelor of Technology in Computer Science Engineering with specialization in AI and ML. Building strong foundations in DSA, ML theory, and practical project development — one semester at a time.',
    tags: ['AI/ML', 'DSA', 'Algorithms', 'AKTU'],
  },
]

export default function Experience() {
  return (
    <section id="experience">
      <div className="sec-tag anim">career ops</div>
      <h2 className="sec-title anim">Experience &amp; Education</h2>
      <div className="sec-line anim" />

      <div className="timeline">
        {items.map((it, i) => (
          <div className={`tl-item anim${i > 0 ? ` anim-d${i}` : ''}`} key={i}>
            <div className="tl-dot" />
            <div className="tl-date">{it.date}</div>
            <div className="tl-role">{it.role}</div>
            <div className="tl-company">{it.company}</div>
            <div className="tl-desc">{it.desc}</div>
            <div className="tl-tags">
              {it.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
