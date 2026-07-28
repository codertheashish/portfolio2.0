'use client'
import { useEffect, useRef } from 'react'

export default function Intro({ onEnter }) {
  const canvasRef = useRef(null)
  const fillRef   = useRef(null)
  const pctRef    = useRef(null)
  const statusRef = useRef(null)
  const enterRef  = useRef(null)

  useEffect(() => {
    /* ── particle canvas ── */
    const ic  = canvasRef.current
    const ctx = ic.getContext('2d')
    let W, H
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 1.2 + 0.2,
      t: Math.random() * Math.PI * 2,
      v: Math.random() * 0.3 + 0.08,
    }))
    function resize() { W = ic.width = window.innerWidth; H = ic.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    let rafId
    function draw() {
      ctx.clearRect(0, 0, W, H)
      stars.forEach(s => {
        s.t += s.v * 0.018
        const o = 0.25 + Math.sin(s.t) * 0.28
        ctx.beginPath()
        ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,255,136,${o})`
        ctx.fill()
      })
      rafId = requestAnimationFrame(draw)
    }
    draw()

    /* ── loading steps ── */
    const steps = [
      { t: 'Booting NEURAL_OS...',              d: 250 },
      { t: 'Python + TensorFlow + OpenCV ✓',    d: 400 },
      { t: 'Mounting /dev/brain → Ashish ✓',    d: 350 },
      { t: 'STATUS: OPEN_TO_WORK ✓',            d: 300 },
      { t: 'All systems operational ✓',          d: 250 },
    ]
    let si = 0
    function runStep() {
      if (si >= steps.length) {
        statusRef.current.textContent = '✓ Portfolio ready.'
        fillRef.current.style.width   = '100%'
        pctRef.current.textContent    = '100%'
        setTimeout(() => { enterRef.current.style.display = 'inline-block' }, 500)
        return
      }
      const s = steps[si]
      statusRef.current.textContent = s.t
      const p = Math.round((si + 1) / steps.length * 92)
      fillRef.current.style.width   = p + '%'
      pctRef.current.textContent    = p + '%'
      si++
      setTimeout(runStep, s.d)
    }
    const t = setTimeout(runStep, 900)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(t)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div id="intro">
      <canvas id="intro-canvas" ref={canvasRef} />
      <div className="intro-ring" />
      <div className="intro-ring" />
      <div className="intro-ring" />
      <div className="intro-ring" />

      <div id="intro-content">
        <div id="intro-label">PORTFOLIO SYSTEM v3.0</div>
        <div id="intro-name">
          <span className="line1">ASHISH KUMAR</span>
          <span className="line2">PRAJAPATI</span>
        </div>
        <div id="intro-sub">Python Dev · AI/ML Engineer · Lucknow 🇮🇳</div>

        <div id="intro-bar-wrap">
          <div id="intro-bar-label">
            <span>LOADING</span>
            <span id="intro-pct" ref={pctRef}>0%</span>
          </div>
          <div id="intro-bar-track">
            <div id="intro-bar-fill" ref={fillRef} />
          </div>
          <div className="intro-status" ref={statusRef}>&nbsp;</div>
        </div>

        <button id="intro-enter" ref={enterRef} onClick={onEnter}>
          ENTER PORTFOLIO →
        </button>
      </div>

      <button id="intro-skip" onClick={onEnter}>SKIP ↓</button>
    </div>
  )
}
