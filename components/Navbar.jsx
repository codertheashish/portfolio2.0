'use client'
import { useState } from 'react'

const links = ['about', 'skills', 'experience', 'projects', 'certs', 'contact']

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav>
        <div className="logo">
          <div className="logo-dot" />
          [codertheashish]
        </div>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l}><a href={`#${l}`}>{l === 'experience' ? 'exp' : l}</a></li>
          ))}
        </ul>

        <div className="nav-right">
          <div className="status-pill">OPEN TO WORK</div>
          <button
            className={`hamburger${open ? ' active' : ''}`}
            onClick={() => setOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mob-menu${open ? ' open' : ''}`}>
        {links.map(l => (
          <a key={l} href={`#${l}`} onClick={() => setOpen(false)}>{l}</a>
        ))}
      </div>
    </>
  )
}
