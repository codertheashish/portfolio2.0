'use client'
// /admin/approve?t=<token>&d=approve|deny — opened from the security e-mail.
// A button click (POST) is required, so mail scanners that pre-fetch links
// cannot approve or deny anything by accident.
import { useEffect, useState } from 'react'
import '../admin.css'

export default function ApprovePage() {
  const [token, setToken] = useState('')
  const [pref, setPref]   = useState('approve')
  const [state, setState] = useState('checking') // checking | ready | invalid | done
  const [busy, setBusy]   = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr]     = useState('')

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const t = q.get('t') || ''
    setToken(t); setPref(q.get('d') === 'deny' ? 'deny' : 'approve')
    window.history.replaceState(null, '', '/admin/approve') // keep token out of history/screenshots
    fetch('/api/admin/approve?t=' + encodeURIComponent(t), { cache: 'no-store' })
      .then(r => r.json()).then(j => setState(j.valid ? 'ready' : 'invalid')).catch(() => setState('invalid'))
  }, [])

  async function decide(decision) {
    setBusy(true); setErr('')
    try {
      const r = await fetch('/api/admin/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, decision }) })
      const j = await r.json()
      if (r.ok) { setResult(j); setState('done') } else { setErr(j.message || 'Failed'); setState('invalid') }
    } catch { setErr('Network error — try again') }
    setBusy(false)
  }

  return (
    <div className="adm-login">
      <div className="adm-card adm-login-box">
        <div className="adm-eyebrow">// SECURITY CHECKPOINT</div>
        <h1 className="adm-h1">Admin access request</h1>
        {state === 'checking' && <p className="adm-muted">Verifying link…</p>}
        {state === 'invalid' && <p className="adm-msg err">{err || 'This link is invalid, expired or has already been used.'}</p>}
        {state === 'ready' && (
          <>
            <p className="adm-muted">The Admin Panel is locked after 3 failed attempts. Approving opens a short login window — <b>both passwords are still required</b>. Denying keeps it locked.</p>
            <div className="adm-row" style={{ flexDirection: 'column' }}>
              <button className={'adm-btn ' + (pref === 'approve' ? '' : 'ghost')} disabled={busy} onClick={() => decide('approve')}>APPROVE ACCESS</button>
              <button className="adm-btn danger" disabled={busy} onClick={() => decide('deny')}>DENY ACCESS</button>
            </div>
            {err && <p className="adm-msg err">{err}</p>}
          </>
        )}
        {state === 'done' && result?.decision === 'approve' && <p className="adm-msg ok">✓ Approved. A {result.windowMinutes}-minute login window is open with 3 fresh attempts. Both passwords are still required.</p>}
        {state === 'done' && result?.decision === 'deny' && <p className="adm-msg ok">✓ Denied. The Admin Panel stays locked.</p>}
      </div>
    </div>
  )
}
