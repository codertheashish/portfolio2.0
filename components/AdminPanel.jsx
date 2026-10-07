'use client'
import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_PROJECTS, DEFAULT_CERTS, DEFAULTS } from '../lib/defaultData'

const NAV = [['dashboard', '◈', 'Dashboard'], ['projects', '📁', 'Projects'], ['certs', '🏆', 'Certificates'], ['about', '👤', 'About'], ['skills', '⚡', 'Skills'], ['experience', '💼', 'Experience'], ['education', '🎓', 'Education'], ['settings', '⚙', 'Settings'], ['security', '🛡', 'Security']]
const EMPTY_P = { emoji: '', num: '', title: '', desc: '', stack: '', category: 'cv', githubUrl: '', liveUrl: '', image: '' }
const EMPTY_C = { emoji: '', name: '', org: '', certUrl: '', image: '' }

// every admin call goes through here: a 401 means the server session is gone
async function api(url, opts) {
  const r = await fetch(url, { cache: 'no-store', ...opts })
  if (r.status === 401) { window.location.reload(); throw new Error('unauthorized') }
  const j = await r.json().catch(() => ({}))
  return { ok: r.ok, status: r.status, ...j }
}
const post = (url, body) => api(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
const when = iso => { try { return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) } catch { return iso } }

export default function AdminPanel({ mustChange = false }) {
  const [view, setView] = useState(mustChange ? 'security' : 'dashboard')
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [certs, setCerts] = useState(DEFAULT_CERTS)
  const [sheetOk, setSheetOk] = useState(false)
  const [sec, setSec] = useState(null)

  const reload = useCallback(async () => {
    try {
      const [pr, cr] = await Promise.all([api('/api/sheets?action=getProjects&fresh=1'), api('/api/sheets?action=getCerts&fresh=1')])
      let ok = false
      if (pr.status === 'ok' && pr.data?.length) { setProjects(pr.data); ok = true }
      if (cr.status === 'ok' && cr.data?.length) { setCerts(cr.data); ok = true }
      setSheetOk(ok)
    } catch { setSheetOk(false) }
  }, [])
  const loadSec = useCallback(async () => { try { const r = await api('/api/admin/security'); if (r.status === 'ok') setSec(r) } catch {} }, [])
  useEffect(() => { reload(); loadSec() }, [reload, loadSec])

  async function logout() { await post('/api/admin/logout', {}).catch(() => {}); window.location.href = '/admin' }
  const go = v => { if (mustChange) return; setView(v); setOpen(false); if (v === 'security' || v === 'dashboard') loadSec() }

  return (
    <div className="adm-shell">
      <div className="adm-grid-bg" />
      <header className="adm-top">
        <button className="adm-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}><span /><span /><span /></button>
        <div className="adm-brand">⚙ ADMIN</div>
        <span className={'adm-pill ' + (sheetOk ? 'ok' : 'bad')}>{sheetOk ? '● SHEET CONNECTED' : '● OFFLINE'}</span>
      </header>
      {open && <div className="adm-scrim" onClick={() => setOpen(false)} />}
      <aside className={'adm-side' + (open ? ' open' : '')}>
        <div className="adm-brand big"><span className="adm-dot" />ADMIN</div>
        <div className="adm-rule" />
        <nav>
          {NAV.map(([k, ic, l]) => <button key={k} disabled={mustChange && k !== 'security'} className={'adm-nav' + (view === k ? ' on' : '')} onClick={() => go(k)}><span>{ic}</span>{l}</button>)}
          <button className="adm-nav out" onClick={logout}><span>⏻</span>Logout</button>
        </nav>
        <a className="adm-link side" href="/">← Back to portfolio</a>
      </aside>

      <main className="adm-main">
        {mustChange && <div className="adm-msg err" role="alert" style={{ marginBottom: '1rem', maxWidth: 920 }}>
          ⚠ You are using the built-in first-run passwords (they are visible in the public repo). Change BOTH Password 1 and Password 2 below
          — you will be signed out after each change and must log in again. Everything else is locked until then.</div>}
        {view === 'dashboard' && <Dashboard projects={projects} certs={certs} sec={sec} sheetOk={sheetOk} go={go} />}
        {view === 'projects' && <Projects projects={projects} reload={reload} />}
        {view === 'certs' && <Certs certs={certs} reload={reload} />}
        {view === 'about' && <>
          <Collection name="AboutText" tag="// about" title="About — Paragraphs" label={i => i.text.slice(0, 70)} fields={[{ k: 'text', label: 'PARAGRAPH *', area: true, full: true }]} />
          <Collection name="AboutInfo" tag="// about" title="About — Info Cards" label={i => i.main} sub={i => i.sub}
            fields={[{ k: 'ico', label: 'EMOJI', ph: '📍' }, { k: 'main', label: 'MAIN TEXT *', ph: 'Lucknow, Uttar Pradesh' }, { k: 'sub', label: 'SUB TEXT', full: true, ph: 'Origin: Kushinagar, UP' }]} />
        </>}
        {view === 'skills' && <>
          <Collection name="SkillGroups" tag="// skills" title="Skill Groups" label={i => `${i.ico} ${i.name}`} sub={i => i.pills}
            fields={[{ k: 'ico', label: 'EMOJI', ph: '🐍' }, { k: 'name', label: 'GROUP NAME *', ph: '// LANGUAGES' }, { k: 'pills', label: 'SKILLS (comma separated)', full: true, ph: 'Python, Java, C' }]} />
          <Collection name="SkillBars" tag="// skills" title="Proficiency Bars" label={i => i.name} sub={i => i.pct + '%'}
            fields={[{ k: 'name', label: 'SKILL NAME *', ph: 'Python' }, { k: 'pct', label: 'PERCENT (0-100)', type: 'number', ph: '90' }]} />
        </>}
        {view === 'experience' && <Collection name="Experience" tag="// career" title="Experience" label={i => i.role} sub={i => `${i.company} · ${i.date}`}
          fields={[{ k: 'date', label: 'DATE / PERIOD', ph: '2025 — PRESENT' }, { k: 'role', label: 'ROLE *', ph: 'Gen AI Intern' }, { k: 'company', label: 'COMPANY *', full: true, ph: 'Techpile Technology Pvt. Ltd.' },
            { k: 'desc', label: 'DESCRIPTION', area: true, full: true }, { k: 'tags', label: 'TAGS (comma separated)', full: true, ph: 'Python, Gen AI' }]} />}
        {view === 'education' && <Collection name="Education" tag="// academics" title="Education" label={i => i.degree} sub={i => `${i.institute} · ${i.date}`}
          presets={[['+ 10th', { degree: '10th (Secondary / High School)' }], ['+ 12th', { degree: '12th (Senior Secondary / Intermediate)' }]]}
          fields={[{ k: 'date', label: 'YEAR / PERIOD', ph: '2020 — 2021' }, { k: 'degree', label: 'DEGREE / CLASS *', ph: '10th' }, { k: 'institute', label: 'SCHOOL / COLLEGE + BOARD *', full: true, ph: 'School name · Board' },
            { k: 'desc', label: 'DETAILS (percentage, subjects…)', area: true, full: true }, { k: 'tags', label: 'TAGS (comma separated)', full: true, ph: 'Science, PCM' }]} />}
        {view === 'settings' && <Settings sheetOk={sheetOk} sec={sec} onReload={reload} loadSec={loadSec} />}
        {view === 'security' && <Security sec={sec} loadSec={loadSec} />}
      </main>
    </div>
  )
}

/* ───────── Dashboard ───────── */
function Dashboard({ projects, certs, sec, sheetOk, go }) {
  const last = sec?.log?.find(l => l.event === 'SUCCESS')
  return (
    <>
      <Title tag="// overview" h="Dashboard" />
      <div className="adm-stats">
        <Stat n={projects.length} l="Projects" onClick={() => go('projects')} />
        <Stat n={certs.length} l="Certificates" onClick={() => go('certs')} />
        <Stat n={sec ? (sec.locked ? 'LOCKED' : 'OPEN') : '…'} l="Login state" tone={sec?.locked ? 'bad' : 'ok'} onClick={() => go('security')} />
        <Stat n={sheetOk ? 'LIVE' : 'OFF'} l="Google Sheet" tone={sheetOk ? 'ok' : 'bad'} onClick={() => go('settings')} />
      </div>
      <div className="adm-card">
        <div className="adm-sec">// last successful login</div>
        <p className="adm-muted">{last ? when(last.time) : 'No record yet.'}</p>
      </div>
    </>
  )
}
const Stat = ({ n, l, tone, onClick }) => (
  <button className={'adm-stat ' + (tone || '')} onClick={onClick}><b>{n}</b><span>{l}</span></button>
)
const Title = ({ tag, h }) => (<div className="adm-title"><div className="adm-eyebrow">{tag}</div><h1 className="adm-h1">{h}</h1></div>)

/* ───────── shared bits ───────── */
const Field = ({ label, full, children }) => (<div className={'adm-field' + (full ? ' full' : '')}><label className="adm-label">{label}</label>{children}</div>)
const Inp = ({ v, on, ph, type = 'text', max }) => <input className="adm-input" type={type} value={v} onChange={e => on(e.target.value)} placeholder={ph} maxLength={max} />
const Msg = ({ m }) => m ? <div className={'adm-msg ' + m.type}>{m.text}</div> : null

function useFlash() {
  const [m, setM] = useState(null)
  const flash = (type, text) => { setM({ type, text }); setTimeout(() => setM(null), 3500) }
  return [m, flash]
}

/* ───────── Projects ───────── */
function Projects({ projects, reload }) {
  const [form, setForm] = useState(EMPTY_P)
  const [orig, setOrig] = useState(null)
  const [busy, setBusy] = useState(false)
  const [m, flash] = useFlash()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    if (!form.title || !form.desc || !form.githubUrl) return flash('err', '⚠ Title, description and GitHub URL are required')
    setBusy(true)
    const data = { ...form, num: form.num || String(projects.length + 1).padStart(2, '0'), ...(orig ? { originalTitle: orig } : {}) }
    const r = await post('/api/sheets', { action: orig ? 'updateProject' : 'addProject', data }).catch(() => ({ ok: false, message: 'Network error' }))
    setBusy(false)
    if (!r.ok) return flash('err', '⚠ ' + (r.message || 'Failed'))
    flash('ok', orig ? '✓ Project updated' : '✓ Project added'); setForm(EMPTY_P); setOrig(null); reload()
  }
  async function del(p) {
    if (!confirm(`Delete "${p.title}"?`)) return
    const r = await post('/api/sheets', { action: 'deleteProject', data: { title: p.title } }).catch(() => ({ ok: false }))
    if (!r.ok) return flash('err', '⚠ ' + (r.message || 'Delete failed'))
    flash('ok', '✓ Deleted'); reload()
  }
  const edit = p => { setForm({ ...EMPTY_P, ...p, num: String(p.num || '') }); setOrig(p.title); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <>
      <Title tag="// manage" h="Projects" />
      <div className="adm-card">
        <div className="adm-sec">{orig ? `// EDITING “${orig}”` : '// ADD NEW PROJECT'}</div>
        <div className="adm-form">
          <Field label="EMOJI"><Inp v={form.emoji} on={v => set('emoji', v)} ph="✍️" max={8} /></Field>
          <Field label="PROJECT NUMBER"><Inp v={form.num} on={v => set('num', v)} ph="09" max={6} /></Field>
          <Field label="TITLE *" full><Inp v={form.title} on={v => set('title', v)} ph="My Awesome Project" max={120} /></Field>
          <Field label="DESCRIPTION *" full><textarea className="adm-input" rows={3} maxLength={600} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="What does it do?" /></Field>
          <Field label="TECH STACK (comma separated)"><Inp v={form.stack} on={v => set('stack', v)} ph="Python, OpenCV, Flask" /></Field>
          <Field label="CATEGORY">
            <select className="adm-input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="cv">Computer Vision</option><option value="ai">AI / NLP</option><option value="web">Web / App</option><option value="util">Utilities</option>
            </select>
          </Field>
          <Field label="GITHUB URL *" full><Inp v={form.githubUrl} on={v => set('githubUrl', v)} ph="https://github.com/codertheashish/…" /></Field>
          <Field label="LIVE DEMO URL (optional)" full><Inp v={form.liveUrl} on={v => set('liveUrl', v)} ph="https://…" /></Field>
          <Field label="IMAGE PATH (optional)" full><Inp v={form.image} on={v => set('image', v)} ph="/projects/my_project.png" /></Field>
        </div>
        <div className="adm-row">
          <button className="adm-btn" disabled={busy} onClick={save}>{busy ? 'SAVING…' : orig ? '✓ SAVE CHANGES' : '+ ADD PROJECT'}</button>
          {orig && <button className="adm-btn ghost" onClick={() => { setForm(EMPTY_P); setOrig(null) }}>CANCEL</button>}
        </div>
        <Msg m={m} />
      </div>
      <div className="adm-sec" style={{ marginTop: '1.5rem' }}>// CURRENT PROJECTS ({projects.length})</div>
      {projects.map((p, i) => (
        <Item key={p.title + i} emoji={p.emoji || '📁'} name={p.title} sub={`#${p.num || i + 1} · ${p.category} · ${(p.stack || '').split(',').slice(0, 3).join(', ')}`}
          onEdit={() => edit(p)} onDelete={() => del(p)} />
      ))}
    </>
  )
}

/* ───────── Certificates ───────── */
function Certs({ certs, reload }) {
  const [form, setForm] = useState(EMPTY_C)
  const [orig, setOrig] = useState(null)
  const [busy, setBusy] = useState(false)
  const [m, flash] = useFlash()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    if (!form.name || !form.org) return flash('err', '⚠ Name and organization are required')
    setBusy(true)
    const r = await post('/api/sheets', { action: orig ? 'updateCert' : 'addCert', data: { ...form, ...(orig ? { originalName: orig } : {}) } }).catch(() => ({ ok: false, message: 'Network error' }))
    setBusy(false)
    if (!r.ok) return flash('err', '⚠ ' + (r.message || 'Failed'))
    flash('ok', orig ? '✓ Certificate updated' : '✓ Certificate added'); setForm(EMPTY_C); setOrig(null); reload()
  }
  async function del(c) {
    if (!confirm(`Delete "${c.name}"?`)) return
    const r = await post('/api/sheets', { action: 'deleteCert', data: { name: c.name } }).catch(() => ({ ok: false }))
    if (!r.ok) return flash('err', '⚠ ' + (r.message || 'Delete failed'))
    flash('ok', '✓ Deleted'); reload()
  }
  const edit = c => { setForm({ ...EMPTY_C, ...c }); setOrig(c.name); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <>
      <Title tag="// manage" h="Certificates" />
      <div className="adm-card">
        <div className="adm-sec">{orig ? `// EDITING “${orig}”` : '// ADD NEW CERTIFICATE'}</div>
        <div className="adm-form">
          <Field label="EMOJI"><Inp v={form.emoji} on={v => set('emoji', v)} ph="🏆" max={8} /></Field>
          <Field label="CERTIFICATE NAME *"><Inp v={form.name} on={v => set('name', v)} ph="Python for Data Science" max={160} /></Field>
          <Field label="ORGANIZATION *" full><Inp v={form.org} on={v => set('org', v)} ph="Coursera / IBM" max={120} /></Field>
          <Field label="LOCAL IMAGE PATH (preferred)"><Inp v={form.image} on={v => set('image', v)} ph="/certificates/my_cert.jpg" /></Field>
          <Field label="EXTERNAL CERT URL (optional)"><Inp v={form.certUrl} on={v => set('certUrl', v)} ph="https://…" /></Field>
        </div>
        <p className="adm-muted small">Put image files in <code>/public/certificates/</code> and commit them; the path above points to them.</p>
        <div className="adm-row">
          <button className="adm-btn" disabled={busy} onClick={save}>{busy ? 'SAVING…' : orig ? '✓ SAVE CHANGES' : '+ ADD CERTIFICATE'}</button>
          {orig && <button className="adm-btn ghost" onClick={() => { setForm(EMPTY_C); setOrig(null) }}>CANCEL</button>}
        </div>
        <Msg m={m} />
      </div>
      <div className="adm-sec" style={{ marginTop: '1.5rem' }}>// CURRENT CERTIFICATES ({certs.length})</div>
      {certs.map((c, i) => <Item key={c.name + i} emoji={c.emoji || '📜'} name={c.name} sub={c.org} onEdit={() => edit(c)} onDelete={() => del(c)} />)}
    </>
  )
}

const Item = ({ emoji, name, sub, onEdit, onDelete }) => (
  <div className="adm-item">
    <span className="adm-emoji">{emoji}</span>
    <div className="adm-item-t"><div>{name}</div><small>{sub}</small></div>
    <button className="adm-mini" onClick={onEdit}>EDIT</button>
    <button className="adm-mini danger" onClick={onDelete}>DELETE</button>
  </div>
)

/* ───────── Settings ───────── */
function Settings({ sheetOk, sec, onReload, loadSec }) {
  const c = sec?.config
  const row = (k, ok) => <li key={k}><code>{k}</code><span className={ok ? 'ok' : 'bad'}>{ok ? '✓ set' : '✗ missing'}</span></li>
  return (
    <>
      <Title tag="// configuration" h="Settings" />
      <div className="adm-card">
        <div className="adm-sec">// GOOGLE SHEETS</div>
        <p className="adm-muted">Status: <b className={sheetOk ? 'ok' : 'bad'}>{sheetOk ? '✓ CONNECTED' : '✗ NOT CONNECTED — showing default data'}</b></p>
        <button className="adm-btn ghost" onClick={() => { onReload(); loadSec() }}>↻ TEST CONNECTION</button>
      </div>
      <div className="adm-card">
        <div className="adm-sec">// SERVER ENVIRONMENT (values are never shown)</div>
        <ul className="adm-env">{c ? Object.entries(c).map(([k, v]) => row(k, v)) : <li>Loading…</li>}</ul>
        <p className="adm-muted small">Change these in Vercel → Project → Settings → Environment Variables, then redeploy. Passwords are changed under <b>Security</b>.</p>
      </div>
    </>
  )
}

/* ───────── Security ───────── */
const SCORE = pw => [pw.length >= 12, /[a-z]/.test(pw), /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length
function Security({ sec, loadSec }) {
  const [which, setWhich] = useState(1)
  const [f, setF] = useState({ current1: '', current2: '', newPassword: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const [m, flash] = useFlash()
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))
  const score = SCORE(f.newPassword)

  async function change() {
    if (f.newPassword.length < 12) return flash('err', '⚠ New password needs at least 12 characters')
    if (f.newPassword !== f.confirm) return flash('err', '⚠ Confirmation does not match')
    setBusy(true)
    const r = await post('/api/admin/password', { which, ...f }).catch(() => ({ ok: false, message: 'Network error' }))
    setBusy(false)
    setF({ current1: '', current2: '', newPassword: '', confirm: '' })
    if (r.ok) { flash('ok', '✓ Changed. Signing you out…'); setTimeout(() => (window.location.href = '/admin'), 1200) }
    else flash('err', '⚠ ' + (r.message || 'Failed') + (r.attemptsLeft != null ? ` (${r.attemptsLeft} attempts left)` : ''))
  }
  const label = { SUCCESS: 'SUCCESS', FAILED: 'FAILED', LOCKED: 'LOCKED', APPROVED: 'APPROVED', DENIED: 'DENIED', BLOCKED: 'BLOCKED', PW_CHANGED: 'PW CHANGED', LOGOUT: 'LOGOUT', EMAIL_FAILED: 'EMAIL FAILED' }
  const tone = e => (['SUCCESS', 'APPROVED'].includes(e) ? 'ok' : ['FAILED', 'LOCKED', 'BLOCKED', 'DENIED', 'EMAIL_FAILED'].includes(e) ? 'bad' : 'mid')

  return (
    <>
      <Title tag="// protection" h="Security" />
      <div className="adm-card">
        <div className="adm-sec">// LOGIN STATE</div>
        <p className="adm-muted">
          {sec ? (sec.locked ? <b className="bad">LOCKED until {new Date(sec.lockUntil).toLocaleString()}</b> : <b className="ok">OPEN</b>) : '…'}
          {sec && <> · failed attempts: <b>{sec.attempts}/{sec.maxAttempts}</b></>}
        </p>
      </div>

      <div className="adm-card">
        <div className="adm-sec">// CHANGE PASSWORD</div>
        <div className="adm-tabs">{[1, 2].map(n => <button key={n} className={which === n ? 'on' : ''} onClick={() => setWhich(n)}>PASSWORD {n}</button>)}</div>
        <div className="adm-form">
          <Field label="CURRENT PASSWORD 1"><Inp type="password" v={f.current1} on={v => set('current1', v)} ph="••••••••••••" /></Field>
          <Field label="CURRENT PASSWORD 2"><Inp type="password" v={f.current2} on={v => set('current2', v)} ph="••••••••••••" /></Field>
          <Field label={`NEW PASSWORD ${which}`}><Inp type="password" v={f.newPassword} on={v => set('newPassword', v)} ph="min 12 characters" /></Field>
          <Field label="CONFIRM NEW PASSWORD"><Inp type="password" v={f.confirm} on={v => set('confirm', v)} ph="repeat" /></Field>
        </div>
        <div className="adm-meter" aria-hidden><i style={{ width: score * 20 + '%' }} className={score >= 4 ? 'ok' : score >= 3 ? 'mid' : 'bad'} /></div>
        <p className="adm-muted small">Min 12 characters. Use upper &amp; lower case, a number and a symbol. Must differ from both current passwords. Changing signs out every session and sends you an e-mail.</p>
        <button className="adm-btn" disabled={busy} onClick={change}>{busy ? 'WORKING…' : 'CHANGE PASSWORD ' + which}</button>
        <Msg m={m} />
      </div>

      <div className="adm-sec" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>// RECENT LOGIN ATTEMPTS</span><button className="adm-mini" onClick={loadSec}>↻ REFRESH</button>
      </div>
      <div className="adm-log">
        {!sec?.log?.length && <div className="adm-muted">No events yet.</div>}
        {sec?.log?.map((l, i) => (
          <div key={i} className="adm-log-row">
            <span className={'adm-tag ' + tone(l.event)}>{label[l.event] || l.event}</span>
            <span className="adm-log-t">{when(l.time)}</span>
            <span className="adm-log-d">{l.detail}{l.ip ? ` · ${l.ip}` : ''}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ───────── Generic editor for sheet-backed lists (About / Skills / Experience / Education) ───────── */
function Collection({ name, tag, title, fields, label, sub, presets }) {
  const blank = Object.fromEntries(fields.map(f => [f.k, '']))
  const [items, setItems] = useState([])
  const [fromSheet, setFromSheet] = useState(null)
  const [form, setForm] = useState(blank)
  const [editId, setEditId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [m, flash] = useFlash()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const load = useCallback(async () => {
    try {
      const r = await api('/api/sheets?action=get' + name + '&fresh=1')
      if (r.status === 'ok' && r.data?.length) { setItems(r.data); setFromSheet(true) } else { setItems(DEFAULTS[name]); setFromSheet(false) }
    } catch { setItems(DEFAULTS[name]); setFromSheet(false) }
  }, [name])
  useEffect(() => { load() }, [load])

  const run = async (action, data, okMsg) => {
    setBusy(true)
    const r = await post('/api/sheets', { action: action + name, data }).catch(() => ({ ok: false, message: 'Network error' }))
    setBusy(false)
    if (!r.ok) { flash('err', '⚠ ' + (r.message || 'Failed')); return false }
    if (okMsg) flash('ok', okMsg)
    load(); return true
  }
  async function save() {
    const need = fields.filter(f => f.label.includes('*') && !String(form[f.k] || '').trim())
    if (need.length) return flash('err', '⚠ Fill the required fields (*)')
    if (await run(editId ? 'update' : 'add', { ...form, ...(editId ? { id: editId } : {}) }, editId ? '✓ Updated' : '✓ Added')) { setForm(blank); setEditId(null) }
  }
  const edit = it => { setForm({ ...blank, ...Object.fromEntries(fields.map(f => [f.k, it[f.k] ?? ''])) }); setEditId(it.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <Title tag={tag} h={title} />
      {fromSheet === false && (
        <div className="adm-card">
          <div className="adm-sec">// SHOWING BUILT-IN CONTENT</div>
          <p className="adm-muted">The website currently shows the built-in version of this section. Import it into your Google Sheet once, then you can edit, reorder, add and delete everything here.</p>
          <button className="adm-btn" disabled={busy} onClick={() => run('seed', {}, '✓ Imported')}>{busy ? 'IMPORTING…' : '⇩ IMPORT CURRENT CONTENT TO SHEET'}</button>
          <Msg m={m} />
        </div>
      )}
      {fromSheet && (
        <>
          <div className="adm-card">
            <div className="adm-sec">{editId ? '// EDITING ITEM' : '// ADD NEW'}</div>
            {presets && !editId && <div className="adm-row" style={{ marginBottom: 12 }}>{presets.map(([l, v]) => <button key={l} className="adm-mini" onClick={() => setForm({ ...blank, ...v })}>{l}</button>)}</div>}
            <div className="adm-form">
              {fields.map(f => (
                <Field key={f.k} label={f.label} full={f.full}>
                  {f.area
                    ? <textarea className="adm-input" rows={4} value={form[f.k]} placeholder={f.ph} onChange={e => set(f.k, e.target.value)} />
                    : <input className="adm-input" type={f.type || 'text'} value={form[f.k]} placeholder={f.ph} onChange={e => set(f.k, e.target.value)} />}
                </Field>
              ))}
            </div>
            <div className="adm-row">
              <button className="adm-btn" disabled={busy} onClick={save}>{busy ? 'SAVING…' : editId ? '✓ SAVE CHANGES' : '+ ADD'}</button>
              {editId && <button className="adm-btn ghost" onClick={() => { setForm(blank); setEditId(null) }}>CANCEL</button>}
            </div>
            <Msg m={m} />
          </div>
          <div className="adm-sec" style={{ marginTop: '1rem' }}>// ITEMS ({items.length}) — order here = order on website</div>
          {items.map((it, i) => (
            <div className="adm-item" key={it.id}>
              <div className="adm-item-t"><div>{label(it)}</div><small>{sub ? sub(it) : ''}</small></div>
              <button className="adm-mini" disabled={busy || i === 0} onClick={() => run('move', { id: it.id, dir: 'up' })} aria-label="Move up">▲</button>
              <button className="adm-mini" disabled={busy || i === items.length - 1} onClick={() => run('move', { id: it.id, dir: 'down' })} aria-label="Move down">▼</button>
              <button className="adm-mini" onClick={() => edit(it)}>EDIT</button>
              <button className="adm-mini danger" onClick={() => { if (confirm('Delete this item?')) run('delete', { id: it.id }, '✓ Deleted') }}>DELETE</button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
