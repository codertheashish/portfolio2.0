'use client';
import { useState, useEffect } from 'react';
import { DEFAULT_CERTS } from '../lib/defaultData';

export default function Certs() {
  const [certs, setCerts] = useState(DEFAULT_CERTS);
  const [modal, setModal] = useState(null); // {image, name}

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch('/api/sheets?action=getCerts');
        const json = await res.json();
        if (json.status === 'ok' && json.data?.length) setCerts(json.data);
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.detail?.certs) setCerts(e.detail.certs); };
    window.addEventListener('portfolioCertsUpdated', handler);
    return () => window.removeEventListener('portfolioCertsUpdated', handler);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <section id="certs" style={{ padding: 'clamp(4rem,7vw,6rem) clamp(1.5rem,5vw,4rem)', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="sec-tag anim">verified credentials</div>
        <h2 className="sec-title anim">Certifications</h2>
        <div className="sec-line anim" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1px', background: 'var(--border)' }}>
          {certs.map((c, i) => (
            <CertCard key={c.name + i} cert={c} onView={setModal} />
          ))}
        </div>
      </section>

      {/* Image Viewer Modal */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', zIndex: 9000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', backdropFilter: 'blur(8px)',
          }}
        >
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '3px', color: 'var(--g,#00ff88)' }}>
                {modal.name}
              </div>
              <button onClick={() => setModal(null)}
                style={{ background: 'none', border: '1px solid rgba(0,255,136,.2)', color: '#8aabb8', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', padding: '4px 12px', cursor: 'pointer', letterSpacing: '2px' }}>
                ✕ CLOSE
              </button>
            </div>
            <img
              src={modal.image}
              alt={modal.name}
              style={{ maxWidth: '85vw', maxHeight: '80vh', objectFit: 'contain', border: '1px solid rgba(0,255,136,.15)' }}
            />
            {modal.certUrl && (
              <a href={modal.certUrl} target="_blank" rel="noreferrer"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: 'var(--g,#00ff88)', letterSpacing: '2px', textDecoration: 'none', textAlign: 'center' }}>
                ↗ VIEW ONLINE
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CertCard({ cert: c, onView }) {
  const [hovered, setHovered] = useState(false);
  const hasExternalLink = c.certUrl && !c.certUrl.includes('YOUR_') && c.certUrl.startsWith('http');
  const hasImage = c.image && c.image !== '';

  const handleClick = () => {
    if (hasImage) {
      onView({ image: c.image, name: c.name, certUrl: hasExternalLink ? c.certUrl : '' });
    } else if (hasExternalLink) {
      window.open(c.certUrl, '_blank');
    }
  };

  const isInteractive = hasImage || hasExternalLink;

  return (
    <div
      className="cert-card"
      onClick={isInteractive ? handleClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: isInteractive ? 'pointer' : 'default' }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '1px',
        background: 'var(--g,#00ff88)', transform: hovered && isInteractive ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform .3s',
      }} />

      {/* Thumbnail */}
      {hasImage && (
        <div style={{
          width: '52px', height: '38px', minWidth: '52px', overflow: 'hidden',
          border: `1px solid ${hovered ? 'rgba(0,255,136,.25)' : 'rgba(0,255,136,.1)'}`,
          background: '#020a0f', transition: 'border-color .2s', flexShrink: 0,
        }}>
          <img src={c.image} alt={c.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: hovered ? 1 : 0.8, transition: 'opacity .2s' }}
          />
        </div>
      )}

      {!hasImage && (
        <div className="cert-ico">{c.emoji || '📜'}</div>
      )}

      <div style={{ flex: 1 }}>
        <div className="cert-name">{c.name}</div>
        <div className="cert-org">{c.org}</div>
        {isInteractive
          ? <div className="cert-badge">{hasImage ? 'VIEW CERTIFICATE' : 'OPEN LINK'}</div>
          : <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: '#4a7a8a' }}>PENDING</div>
        }
      </div>
    </div>
  );
}
