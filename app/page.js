'use client'
import { useState, useEffect } from 'react'
import Intro      from '@/components/Intro'
import Navbar     from '@/components/Navbar'
import Hero       from '@/components/Hero'
import About      from '@/components/About'
import Skills     from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects   from '@/components/Projects'
import Certs      from '@/components/Certs'
import Contact    from '@/components/Contact'

export default function Home() {
  const [entered, setEntered] = useState(false)

  /* ── custom cursor ── */
  useEffect(() => {
    if (!entered) return
    const cur  = document.getElementById('cur')
    const curR = document.getElementById('cur-ring')
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px' }
    document.addEventListener('mousemove', onMove)
    let rafId
    const loop = () => { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; curR.style.left = rx + 'px'; curR.style.top = ry + 'px'; rafId = requestAnimationFrame(loop) }
    loop()
    const hoverEls = document.querySelectorAll('a,button,.proj-card,.cert-card,.htag,.spill,.filt-btn')
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => { cur.style.transform='translate(-50%,-50%) scale(2.5)'; curR.style.transform='translate(-50%,-50%) scale(1.6)' })
      el.addEventListener('mouseleave', () => { cur.style.transform='translate(-50%,-50%) scale(1)'; curR.style.transform='translate(-50%,-50%) scale(1)' })
    })
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafId) }
  }, [entered])

  /* ── matrix bg ── */
  useEffect(() => {
    if (!entered) return
    const cv  = document.getElementById('matrix-bg')
    const ctx = cv.getContext('2d')
    const chars = 'アイABCDE01234<>{}|/\\'
    let W, H, cols, drops = []
    function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; cols = Math.floor(W / 18); drops = Array(cols).fill(1) }
    resize()
    window.addEventListener('resize', resize)
    const id = setInterval(() => {
      ctx.fillStyle = 'rgba(0,5,10,.06)'; ctx.fillRect(0, 0, W, H)
      ctx.font = '13px monospace'
      drops.forEach((d, i) => { ctx.fillStyle = '#00ff88'; ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 18, d * 18); if (d * 18 > H && Math.random() > 0.975) drops[i] = 0; drops[i]++ })
    }, 60)
    return () => { clearInterval(id); window.removeEventListener('resize', resize) }
  }, [entered])

  /* ── scroll animations ── */
  useEffect(() => {
    if (!entered) return
    const els = document.querySelectorAll('.anim')
    const io  = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('in') }), { threshold: 0.1 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [entered])

  /* ── counter animation ── */
  useEffect(() => {
    if (!entered) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const t = +e.target.dataset.count
          let c = 0
          const run = () => { c++; e.target.textContent = c; if (c < t) setTimeout(run, 55) }
          run(); io.unobserve(e.target)
        }
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-count]').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [entered])

  function handleEnter() {
    const intro = document.getElementById('intro')
    intro.style.transition = 'opacity .7s,transform .7s'
    intro.style.opacity    = '0'
    intro.style.transform  = 'scale(1.03)'
    setTimeout(() => setEntered(true), 700)
  }

  return (
    <>
      {/* Cursor */}
      <div id="cur" />
      <div id="cur-ring" />

      {/* Intro screen */}
      {!entered && <Intro onEnter={handleEnter} />}

      {/* Matrix bg + scanlines always mounted */}
      <canvas id="matrix-bg" />
      <div className="scanlines" />

      {/* Main site */}
      <div className="wrap" style={{ display: entered ? 'block' : 'none' }}>
        <Navbar />
        <Hero />
        <hr className="divider" />
        <About />
        <hr className="divider" />
        <Skills />
        <hr className="divider" />
        <Experience />
        <hr className="divider" />
        <Projects />
        <hr className="divider" />
        <Certs />
        <hr className="divider" />
        <Contact />

        <footer>
          <div className="foot-logo">[codertheashish] // Ashish Kumar Prajapati // Lucknow, India</div>
          <div className="foot-text">© 2026 · Built with Python mindset · All systems operational</div>
          <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Back to Top</button>
        </footer>
      </div>
    </>
  )
}
