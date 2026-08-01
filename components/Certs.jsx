'use client';
// components/Certs.jsx
// ================================================================
// Dynamic Certificates — Google Sheets se load hota hai
// ================================================================

import { useState, useEffect } from 'react';
import { DEFAULT_CERTS } from '../lib/defaultData';

export default function Certs() {
  const [certs, setCerts] = useState(DEFAULT_CERTS);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch('/api/sheets?action=getCerts');
        const json = await res.json();
        if (json.status === 'ok' && json.data?.length) {
          setCerts(json.data);
        }
      } catch { /* use defaults */ }
    }
    load();
  }, []);

  // Admin se instant update
  useEffect(() => {
    const handler = (e) => { if (e.detail?.certs) setCerts(e.detail.certs); };
    window.addEventListener('portfolioCertsUpdated', handler);
    return () => window.removeEventListener('portfolioCertsUpdated', handler);
  }, []);

  return (
    <section id="certs" style={{ padding: 'clamp(4rem,7vw,6rem) clamp(1.5rem,5vw,4rem)', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', letterSpacing: '4px', color: '#00d4ff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#4a7a8a' }}>//</span> verified credentials
      </div>
      <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: '#e8f8ff', letterSpacing: '-1px', marginBottom: '8px' }}>
        Certifications
      </h2>
      <div style={{ width: '36px', height: '2px', background: '#00ff88', marginBottom: 'clamp(2rem,4vw,3rem)', boxShadow: '0 0 8px #00ff88' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1px', background: 'rgba(0,255,136,.1)' }}>
        {certs.map((c, i) => <CertCard key={c.name + i} cert={c} />)}
      </div>
    </section>
  );
}

function CertCard({ cert: c }) {
  const [hovered, setHovered] = useState(false);
  const isClickable = c.certUrl && !c.certUrl.includes('YOUR_') && c.certUrl.startsWith('http');

  const inner = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#071825' : '#041018',
        padding: '1.25rem', display: 'flex', gap: '12px', alignItems: 'flex-start',
        transition: 'background .2s', position: 'relative', overflow: 'hidden', height: '100%',
      }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '1px',
        background: '#00ff88', transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform .3s',
      }} />
      <div style={{
        width: '38px', height: '38px', minWidth: '38px',
        background: 'rgba(0,255,136,.07)', border: `1px solid ${hovered ? 'rgba(0,255,136,.25)' : 'rgba(0,255,136,.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', transition: 'border-color .2s',
      }}>
        {c.emoji || '📜'}
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#e8f8ff', marginBottom: '4px', lineHeight: 1.4 }}>{c.name}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#4a7a8a', marginBottom: '6px' }}>{c.org}</div>
        {isClickable
          ? <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', letterSpacing: '1.5px', color: '#00ff88', display: 'inline-flex', alignItems: 'center', gap: hovered ? '6px' : '4px', transition: 'gap .2s' }}>↗ VIEW CERTIFICATE</div>
          : <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#4a7a8a' }}>LINK PENDING</div>
        }
      </div>
    </div>
  );

  return isClickable
    ? <a href={c.certUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{inner}</a>
    : <div style={{ display: 'block' }}>{inner}</div>;
}
