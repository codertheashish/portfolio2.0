'use client'
// /admin/reset?t=<token> — opened from the reset e-mail. Choose a new Password 1 and Password 2.
import { useEffect, useState } from 'react'
import '../admin.css'

export default function ResetPage() {
  const [token, setToken] = useState('')
  const [state, setState] = useState('checking') // checking | ready | invalid | done
  const [f, setF] = useState({ p1: '', c1: '', p2: '', c2: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t') || ''
    setToken(t)
    window.history.replaceState(null, '', '/admin/reset')   // keep the token out of history
    fetch('/api/admin/reset?t=' + encodeURIComponent(t), { cache: 'no-store' })
      .then(r => r.json()).then(j => setState(j.valid ? 'ready' : 'invalid')).catch(() => setState('invalid'))
  }, [])

  async function submit(e) {
    e.preventDefault(); setErr('')
    if (f.p1.length < 12 || f.p2.length < 12) return setErr('Both passwords need at least 12 characters.')
    if (f.p1 !== f.c1 || f.p2 !== f.c2) return setErr('A confirmation does not match.')
    if (f.p1 === f.p2) return setErr('Password 1 and Password 2 must be different.')
    setBusy(true)
    try {
      const r = await fetch('/api/admin/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, p1: f.p1, p2: f.p2 }) })
      const j = await r.json().catch(() => ({}))
      if (r.ok) { setF({ p1: '', c1: '', p2: '', c2: '' }); setState('done') }
      else if (r.status === 410) setState('invalid')
      else setErr(j.message || 'Failed. Try again.')
    } catch { setErr('Network error. Try again.') }
    setBusy(false)
  }

  const inp = (k, label) => (
    <div className="adm-field full" style={{ marginBottom: 10 }}>
      <label className="adm-label">{label}</label>
      <input className="adm-input" type="password" autoComplete="new-password" value={f[k]} onChange={e => set(k, e.target.value)} />
    </div>
  )
  return (
    <div className="adm-login">
      <div className="adm-grid-bg" />
      <form className="adm-card adm-login-box" onSubmit={submit}>
        <div className="adm-eyebrow">// PASSWORD RESET</div>
        <h1 className="adm-h1">Choose new passwords</h1>
        {state === 'checking' && <p className="adm-muted">Verifying link…</p>}
        {state === 'invalid' && <><p className="adm-msg err">This reset link is invalid, expired or already used. Request a new one from the login page.</p><a className="adm-link" href="/admin">← Back to login</a></>}
        {state === 'ready' && (
          <>
            {inp('p1', 'NEW PASSWORD 1')}{inp('c1', 'CONFIRM PASSWORD 1')}
            {inp('p2', 'NEW PASSWORD 2')}{inp('c2', 'CONFIRM PASSWORD 2')}
            <p className="adm-muted small">12+ characters each, and the two must be different. Every old session is signed out and any lock is cleared.</p>
            {err && <p className="adm-msg err" role="alert">{err}</p>}
            <button className="adm-btn full" disabled={busy}>{busy ? 'SAVING…' : 'RESET PASSWORDS'}</button>
          </>
        )}
        {state === 'done' && <><p className="adm-msg ok">✓ Passwords reset. You can log in with the new ones now.</p><a className="adm-btn full" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 12 }} href="/admin">GO TO LOGIN →</a></>}
      </form>
    </div>
  )
}
