'use client';
// components/Projects.jsx
// ================================================================
// Dynamic Projects — Google Sheets se load hota hai
// Fallback: DEFAULT_PROJECTS (lib/defaultData.js)
// ================================================================

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DEFAULT_PROJECTS } from '../lib/defaultData';

const CATS = [
  { key: 'all', label: 'All Projects' },
  { key: 'cv',  label: 'Computer Vision' },
  { key: 'ai',  label: 'AI / NLP' },
  { key: 'web', label: 'Web / App' },
  { key: 'util',label: 'Utilities' },
];

export default function Projects() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);
  const sectionRef = useRef(null);

  // ── Fetch from Google Sheets via Next.js API ──────────────────
  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch('/api/sheets?action=getProjects');
        const json = await res.json();
        if (json.status === 'ok' && json.data?.length) {
          setProjects(json.data);
        }
      } catch {
        // Sheet not connected — default data use hoga
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Listen for admin updates (same-tab instant refresh) ───────
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.projects) setProjects(e.detail.projects);
    };
    window.addEventListener('portfolioProjectsUpdated', handler);
    return () => window.removeEventListener('portfolioProjectsUpdated', handler);
  }, []);

  const visible = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" style={{ padding: 'clamp(4rem,7vw,6rem) clamp(1.5rem,5vw,4rem)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '4px', color: 'var(--c,#00d4ff)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#4a7a8a' }}>//</span> mission logs
      </div>
      <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: '#e8f8ff', letterSpacing: '-1px', marginBottom: '8px' }}>
        What I&apos;ve Built
      </h2>
      <div style={{ width: '36px', height: '2px', background: 'var(--g,#00ff88)', marginBottom: 'clamp(2rem,4vw,3rem)', boxShadow: '0 0 8px #00ff88' }} />

      {/* Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
        {CATS.map(c => (
          <button key={c.key}
            onClick={() => setFilter(c.key)}
            style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '1.5px',
              padding: '6px 16px', cursor: 'pointer', background: filter === c.key ? 'rgba(0,255,136,.05)' : 'transparent',
              border: `1px solid ${filter === c.key ? 'var(--g,#00ff88)' : 'rgba(0,255,136,.1)'}`,
              color: filter === c.key ? 'var(--g,#00ff88)' : '#4a7a8a', transition: 'all .2s',
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#4a7a8a', letterSpacing: '2px' }}>
          Loading projects...
        </div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#4a7a8a' }}>
          No projects in this category. Add via Admin Panel!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5px', background: 'rgba(0,255,136,.1)' }}>
          {visible.map((p, i) => (
            <ProjectCard key={p.title + i} project={p} idx={i} />
          ))}
        </div>
      )}

      {/* View All */}
      <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,136,.1)' }} />
        <a href="https://github.com/codertheashish?tab=repositories" target="_blank" rel="noreferrer"
          style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '2px',
            padding: '13px 32px', cursor: 'pointer', background: 'transparent',
            border: '1px solid rgba(0,255,136,.25)', color: 'var(--g,#00ff88)',
            display: 'inline-flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', textDecoration: 'none',
          }}>
          ⌥ View All Repositories
          <span style={{ background: 'rgba(0,255,136,.12)', border: '1px solid rgba(0,255,136,.25)', fontSize: '9px', padding: '2px 8px' }}>
            GITHUB ↗
          </span>
        </a>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,136,.1)' }} />
      </div>
    </section>
  );
}

function ProjectCard({ project: p, idx }) {
  const [hovered, setHovered] = useState(false);
  const delay = idx % 3 === 1 ? '.1s' : idx % 3 === 2 ? '.2s' : '0s';

  return (
    <a href={p.githubUrl} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', background: hovered ? '#071825' : '#041018',
        padding: '1.75rem', cursor: 'pointer', position: 'relative',
        overflow: 'hidden', transition: 'background .25s', textDecoration: 'none',
        animationDelay: delay,
      }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
        background: 'var(--g,#00ff88)', transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform .35s', boxShadow: '0 0 8px #00ff88',
      }} />

      {/* Image */}
      {p.image && (
        <div style={{ width: '100%', height: '140px', overflow: 'hidden', marginBottom: '1rem', background: '#020a0f', position: 'relative' }}>
          <img src={p.image} alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: hovered ? 1 : 0.75, transition: 'opacity .3s' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#4a7a8a', letterSpacing: '3px', marginBottom: '1rem' }}>
        // {String(p.num || idx + 1).padStart(2, '0')}
      </div>
      <span style={{ fontSize: '28px', display: 'block', lineHeight: 1, marginBottom: '.75rem' }}>{p.emoji || '📁'}</span>
      <div style={{ fontSize: '15px', fontWeight: 600, color: hovered ? 'var(--g,#00ff88)' : '#e8f8ff', marginBottom: '.5rem', transition: 'color .2s' }}>
        {p.title}
      </div>
      <div style={{ fontSize: '12px', color: '#4a7a8a', lineHeight: 1.78, marginBottom: '1rem' }}>{p.desc}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '1.25rem' }}>
        {(p.stack || '').split(',').map(s => (
          <span key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#4a7a8a', border: '1px solid rgba(0,255,136,.1)', padding: '2px 8px' }}>
            {s.trim()}
          </span>
        ))}
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: hovered ? '10px' : '6px', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '1.5px', color: 'var(--g,#00ff88)', transition: 'gap .2s' }}>
        View on GitHub →
      </div>
    </a>
  );
}
