'use client'
import { useEffect, useState } from 'react'

const fmt = ms => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, '0')).join(':')
}

const REASONS = {
  server_not_configured: 'Server env vars missing: set SHEET_URL, APPS_SCRIPT_API_KEY, ADMIN_SECURITY_SECRET (see README).',
  script_not_updated: 'Apps Script is still the OLD version. Paste the new google-apps-script.gs and deploy it as a NEW VERSION.',
  security_backend_unavailable: 'Cannot reach Google Apps Script. Check SHEET_URL and your internet connection.',
  unauthorized: 'Apps Script rejected the API key. APPS_SCRIPT_API_KEY (env) must equal Script Property API_KEY.',
}

export default function AdminLogin({ initialLock, configured }) {
  const [step, setStep]   = useState(1)
  const [pw, setPw]       = useState('')
  const [busy, setBusy]   = useState(false)
  const [msg, setMsg]     = useState('')
  const [lock, setLock]   = useState(initialLock.locked ? initialLock.until : 0)
  const [now, setNow]     = useState(Date.now())

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const locked = lock && now < lock

  async function submit(e) {
    e.preventDefault()
    if (!pw || busy) return
    setBusy(true); setMsg('')
    const sent = pw; setPw('')                    // never keep the password in state
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ step, password: sent }) })
      const j = await r.json().catch(() => ({}))
      if (r.status === 423) { setLock(j.until); setStep(1) }
      else if (r.ok && j.next === 2) setStep(2)
      else if (r.ok) { window.location.reload(); return }
      else if (r.status === 401 && j.message === 'start_over') { setStep(1); setMsg('Session step expired — start again.') }
      else if (r.status === 401) { setStep(1); setMsg(`Incorrect credentials. ${j.attemptsLeft} attempt${j.attemptsLeft === 1 ? '' : 's'} left before lockout.`) }
      else setMsg(REASONS[j.message] || 'Something went wrong. Try again.')
    } catch { setMsg('Network error. Try again.') }
    setBusy(false)
  }

  return (
    <div className="adm-login">
      <div className="adm-grid-bg" />
      <form className="adm-card adm-login-box" onSubmit={submit} autoComplete="off">
        <div className="adm-eyebrow">// ADMIN ACCESS</div>
        <h1 className="adm-h1">Portfolio Admin</h1>
        <div className="adm-steps" aria-label="Authentication progress">
          <span className={step >= 1 ? 'on' : ''}>01 PRIMARY KEY</span><i /><span className={step >= 2 ? 'on' : ''}>02 SECONDARY KEY</span>
        </div>

        {!configured && <p className="adm-msg err">Admin backend is not configured. Set the environment variables listed in the README.</p>}

        {locked ? (
          <div className="adm-lock" role="alert">
            <div className="adm-lock-ico">🔒</div>
            <div className="adm-lock-t">ACCESS LOCKED</div>
            <div className="adm-lock-c">{fmt(lock - now)}</div>
            <p className="adm-muted">Too many failed attempts. The owner has been alerted by e-mail and can approve a new attempt. Otherwise the lock lifts automatically.</p>
          </div>
        ) : (
          <>
            <label className="adm-label" htmlFor="pw">{step === 1 ? 'PASSWORD 1' : 'PASSWORD 2'}</label>
            <input id="pw" className="adm-input" type="password" autoFocus key={step} value={pw} onChange={e => setPw(e.target.value)}
              autoComplete="off" spellCheck={false} placeholder="••••••••••••" disabled={busy || !configured} />
            {msg && <p className="adm-msg err" role="alert">{msg}</p>}
            <button className="adm-btn full" disabled={busy || !pw || !configured}>{busy ? 'VERIFYING…' : step === 1 ? 'CONTINUE →' : 'AUTHENTICATE →'}</button>
          </>
        )}
        <a className="adm-link" href="/">← Back to portfolio</a>
      </form>
    </div>
  )
}
