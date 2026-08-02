'use client';
import { useState, useEffect } from 'react';
import { DEFAULT_PROJECTS, DEFAULT_CERTS } from '../lib/defaultData';

const PW_KEY = 'portfolio_admin_pw';
const DEFAULT_PW = 'ashish@admin2026';
const getStoredPw = () => typeof window !== 'undefined' ? (localStorage.getItem(PW_KEY) || DEFAULT_PW) : DEFAULT_PW;

export default function AdminPanel() {
  const [authed, setAuthed]     = useState(false);
  const [tab, setTab]           = useState('projects');
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [certs, setCerts]       = useState(DEFAULT_CERTS);
  const [sheetOk, setSheetOk]   = useState(false);

  useEffect(() => { if (authed) loadFromSheet(); }, [authed]);

  async function loadFromSheet() {
    try {
      const [pr, cr] = await Promise.all([
        fetch('/api/sheets?action=getProjects').then(r => r.json()),
        fetch('/api/sheets?action=getCerts').then(r => r.json()),
      ]);
      if (pr.status === 'ok' && pr.data?.length) { setProjects(pr.data); setSheetOk(true); }
      if (cr.status === 'ok' && cr.data?.length) { setCerts(cr.data); setSheetOk(true); }
    } catch { setSheetOk(false); }
  }

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;

  return (
    <div style={S.wrap}>
      <div style={S.hdr}>
        <div style={S.hdrTitle}>⚙ PORTFOLIO ADMIN PANEL</div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color: sheetOk ? '#00ff88' : '#f9826c', letterSpacing:'1px' }}>
            {sheetOk ? '● SHEET CONNECTED' : '● OFFLINE MODE'}
          </span>
          <a href="/" style={S.closeBtn}>← BACK TO PORTFOLIO</a>
        </div>
      </div>

      <div style={S.tabs}>
        {[['projects','📁 PROJECTS'],['certs','🏆 CERTIFICATES'],['settings','⚙ SETTINGS']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...S.tab, ...(tab===k ? S.tabActive : {}) }}>{l}</button>
        ))}
      </div>

      {tab === 'projects' && <ProjectsTab projects={projects} setProjects={setProjects} />}
      {tab === 'certs'    && <CertsTab certs={certs} setCerts={setCerts} />}
      {tab === 'settings' && <SettingsTab onReload={loadFromSheet} sheetOk={sheetOk} />}
    </div>
  );
}

function LoginScreen({ onAuth }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const attempt = () => {
    if (pw === getStoredPw()) onAuth();
    else { setErr('⚠ Incorrect password'); setPw(''); }
  };
  return (
    <div style={S.loginWrap}>
      <div style={S.loginBox}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', letterSpacing:'4px', color:'#00ff88', marginBottom:'.5rem' }}>// ADMIN ACCESS</div>
        <div style={{ fontSize:'1.4rem', fontWeight:700, color:'#e8f8ff', marginBottom:'.25rem' }}>Portfolio Admin</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'#4a7a8a', letterSpacing:'2px', marginBottom:'2rem' }}>ENTER PASSWORD TO CONTINUE</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&attempt()} placeholder="••••••••" style={S.input} />
        {err && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'#ff5f57', marginTop:'6px' }}>{err}</div>}
        <button onClick={attempt} style={{ ...S.btn, width:'100%', marginTop:'10px' }}>AUTHENTICATE →</button>
        <a href="/" style={{ display:'block', marginTop:'1rem', fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'#4a7a8a', textDecoration:'none', textAlign:'center' }}>← Cancel</a>
      </div>
    </div>
  );
}

function ProjectsTab({ projects, setProjects }) {
  const [form, setForm] = useState({ emoji:'', num:'', title:'', desc:'', stack:'', category:'cv', githubUrl:'', image:'' });
  const [status, setStatus] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const add = async () => {
    if (!form.title||!form.desc||!form.githubUrl) { setStatus({type:'err',msg:'⚠ Title, Description and GitHub URL required'}); return; }
    const newP = {...form, num:form.num||String(projects.length+1).padStart(2,'0'), emoji:form.emoji||'📁'};
    setProjects([...projects, newP]);
    setForm({emoji:'',num:'',title:'',desc:'',stack:'',category:'cv',githubUrl:'',image:''});
    setStatus({type:'ok',msg:'✓ Project added!'});
    try { await fetch('/api/sheets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'addProject',data:newP})}); } catch {}
    setTimeout(()=>setStatus(null),3000);
  };

  const del = async (idx) => {
    if (!confirm(`Delete "${projects[idx].title}"?`)) return;
    const removed = projects[idx];
    setProjects(projects.filter((_,i)=>i!==idx));
    try { await fetch('/api/sheets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'deleteProject',data:{title:removed.title}})}); } catch {}
    setStatus({type:'ok',msg:'✓ Deleted.'});
    setTimeout(()=>setStatus(null),2000);
  };

  return (
    <div style={S.panel}>
      <Note text={<><b>PROJECTS SHEET COLUMNS:</b> emoji | title | desc | stack | category | githubUrl | num | image</>} />
      <SectionTitle>// ADD NEW PROJECT</SectionTitle>
      <div style={S.grid2}>
        <Field label="EMOJI"><Inp value={form.emoji} onChange={v=>set('emoji',v)} ph="✍️" /></Field>
        <Field label="NUMBER"><Inp value={form.num} onChange={v=>set('num',v)} ph="09" /></Field>
        <Field label="TITLE *" full><Inp value={form.title} onChange={v=>set('title',v)} ph="My Awesome Project" /></Field>
        <Field label="DESCRIPTION *" full><Inp value={form.desc} onChange={v=>set('desc',v)} ph="What does this project do?" /></Field>
        <Field label="TECH STACK (comma separated)"><Inp value={form.stack} onChange={v=>set('stack',v)} ph="Python, OpenCV, Flask" /></Field>
        <Field label="CATEGORY">
          <select value={form.category} onChange={e=>set('category',e.target.value)} style={S.input}>
            <option value="cv">Computer Vision</option>
            <option value="ai">AI / NLP</option>
            <option value="web">Web / App</option>
            <option value="util">Utilities</option>
          </select>
        </Field>
        <Field label="GITHUB URL *" full><Inp value={form.githubUrl} onChange={v=>set('githubUrl',v)} ph="https://github.com/codertheashish/..." /></Field>
        <Field label="IMAGE PATH (optional)" full><Inp value={form.image} onChange={v=>set('image',v)} ph="/projects/my_project.png" /></Field>
      </div>
      <button onClick={add} style={S.btn}>+ ADD PROJECT</button>
      {status && <StatusMsg type={status.type}>{status.msg}</StatusMsg>}
      <SectionTitle style={{marginTop:'2rem'}}>// CURRENT PROJECTS ({projects.length})</SectionTitle>
      {projects.map((p,i)=>(
        <AdminItem key={p.title+i} emoji={p.emoji||'📁'} name={p.title} sub={`${p.category} · ${(p.stack||'').split(',').slice(0,2).join(', ')}`} onDelete={()=>del(i)} />
      ))}
    </div>
  );
}

function CertsTab({ certs, setCerts }) {
  const [form, setForm] = useState({ emoji:'', name:'', org:'', certUrl:'', image:'' });
  const [status, setStatus] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const add = async () => {
    if (!form.name||!form.org) { setStatus({type:'err',msg:'⚠ Name and Organization required'}); return; }
    const newC = {...form, emoji:form.emoji||'📜'};
    setCerts([...certs, newC]);
    setForm({emoji:'',name:'',org:'',certUrl:'',image:''});
    setStatus({type:'ok',msg:'✓ Certificate added!'});
    try { await fetch('/api/sheets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'addCert',data:newC})}); } catch {}
    setTimeout(()=>setStatus(null),3000);
  };

  const del = async (idx) => {
    if (!confirm(`Delete "${certs[idx].name}"?`)) return;
    const removed = certs[idx];
    setCerts(certs.filter((_,i)=>i!==idx));
    try { await fetch('/api/sheets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'deleteCert',data:{name:removed.name}})}); } catch {}
    setStatus({type:'ok',msg:'✓ Deleted.'});
    setTimeout(()=>setStatus(null),2000);
  };

  return (
    <div style={S.panel}>
      <Note text={<><b>CERTIFICATES SHEET COLUMNS:</b> emoji | name | org | certUrl | image<br/><b>image</b> = local path like /certificates/my_cert.jpg (put file in /public/certificates/)<br/><b>certUrl</b> = external link (optional, leave blank if using local image)</>} />
      <SectionTitle>// ADD NEW CERTIFICATE</SectionTitle>
      <div style={S.grid2}>
        <Field label="EMOJI"><Inp value={form.emoji} onChange={v=>set('emoji',v)} ph="🏆" /></Field>
        <Field label="CERTIFICATE NAME *"><Inp value={form.name} onChange={v=>set('name',v)} ph="Python for Data Science" /></Field>
        <Field label="ORGANIZATION *"><Inp value={form.org} onChange={v=>set('org',v)} ph="Coursera / IBM" /></Field>
        <Field label="LOCAL IMAGE PATH (preferred)"><Inp value={form.image} onChange={v=>set('image',v)} ph="/certificates/my_cert.jpg" /></Field>
        <Field label="EXTERNAL CERT URL (optional)"><Inp value={form.certUrl} onChange={v=>set('certUrl',v)} ph="https://coursera.org/verify/..." /></Field>
      </div>
      <button onClick={add} style={S.btn}>+ ADD CERTIFICATE</button>
      {status && <StatusMsg type={status.type}>{status.msg}</StatusMsg>}
      <SectionTitle style={{marginTop:'2rem'}}>// CURRENT CERTIFICATES ({certs.length})</SectionTitle>
      {certs.map((c,i)=>(
        <AdminItem key={c.name+i} emoji={c.emoji||'📜'} name={c.name} sub={c.org} onDelete={()=>del(i)} />
      ))}
    </div>
  );
}

function SettingsTab({ onReload, sheetOk }) {
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwStatus, setPwStatus] = useState(null);

  const changePw = () => {
    if (curPw !== getStoredPw()) { setPwStatus({type:'err',msg:'⚠ Current password incorrect'}); return; }
    if (newPw.length < 6) { setPwStatus({type:'err',msg:'⚠ Min 6 characters required'}); return; }
    localStorage.setItem(PW_KEY, newPw);
    setCurPw(''); setNewPw('');
    setPwStatus({type:'ok',msg:'✓ Password changed!'});
    setTimeout(()=>setPwStatus(null),3000);
  };

  return (
    <div style={S.panel}>
      <SectionTitle>// GOOGLE SHEETS CONNECTION STATUS</SectionTitle>
      <Note text={
        <>
          Status: <span style={{color: sheetOk?'#00ff88':'#f9826c'}}>{sheetOk?'✓ CONNECTED':'✗ NOT CONNECTED — using default data'}</span><br/><br/>
          <b>To connect Google Sheets:</b><br/>
          1. Create a Google Sheet → add "Projects" and "Certificates" tabs<br/>
          2. Extensions → Apps Script → paste <b>google-apps-script.gs</b> code → deploy as Web App (Anyone access)<br/>
          3. Create <b>.env.local</b> in project root:<br/>
          &nbsp;&nbsp;<b style={{color:'#00d4ff'}}>SHEET_URL=https://script.google.com/macros/s/YOUR_ID/exec</b><br/>
          4. Restart: <b style={{color:'#00d4ff'}}>npm run dev</b><br/>
          5. On Vercel: Settings → Environment Variables → add <b>SHEET_URL</b> → Redeploy
        </>
      } />
      <button onClick={onReload} style={{...S.btn, background:'transparent', border:'1px solid rgba(0,255,136,.25)', color:'#00ff88'}}>↻ TEST CONNECTION</button>

      <SectionTitle style={{marginTop:'2rem'}}>// CHANGE ADMIN PASSWORD</SectionTitle>
      <Note text={<>Current default: <b style={{color:'#00d4ff'}}>ashish@admin2026</b> — change karo jaldi!</>} />
      <div style={S.grid2}>
        <Field label="CURRENT PASSWORD"><Inp type="password" value={curPw} onChange={v=>setCurPw(v)} ph="••••••••" /></Field>
        <Field label="NEW PASSWORD"><Inp type="password" value={newPw} onChange={v=>setNewPw(v)} ph="••••••••" /></Field>
      </div>
      <button onClick={changePw} style={S.btn}>CHANGE PASSWORD</button>
      {pwStatus && <StatusMsg type={pwStatus.type}>{pwStatus.msg}</StatusMsg>}
    </div>
  );
}

// ── Micro components ──────────────────────────────────────────────
const SectionTitle = ({children,style}) => (
  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',letterSpacing:'3px',color:'#00ff88',marginBottom:'1rem',paddingBottom:'8px',borderBottom:'1px solid rgba(0,255,136,.1)',...style}}>{children}</div>
);
const Note = ({text}) => (
  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#4a7a8a',padding:'10px 14px',border:'1px solid rgba(0,255,136,.1)',background:'rgba(0,255,136,.03)',marginBottom:'1rem',lineHeight:1.7}}>{text}</div>
);
const Field = ({label,children,full}) => (
  <div style={{gridColumn:full?'1/-1':undefined}}>
    <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',letterSpacing:'2px',color:'#4a7a8a',display:'block',marginBottom:'4px'}}>{label}</label>
    {children}
  </div>
);
const Inp = ({value,onChange,ph,type='text'}) => (
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={S.input}/>
);
const AdminItem = ({emoji,name,sub,onDelete}) => (
  <div style={S.adminItem}>
    <span style={{fontSize:'20px',minWidth:'28px',textAlign:'center'}}>{emoji}</span>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:'13px',fontWeight:500,color:'#e8f8ff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{name}</div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#4a7a8a',marginTop:'2px'}}>{sub}</div>
    </div>
    <button onClick={onDelete}
      style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',letterSpacing:'1px',padding:'6px 12px',cursor:'pointer',background:'transparent',border:'1px solid rgba(255,95,87,.3)',color:'#ff5f57',flexShrink:0}}
      onMouseEnter={e=>e.target.style.background='rgba(255,95,87,.1)'}
      onMouseLeave={e=>e.target.style.background='transparent'}>
      DELETE
    </button>
  </div>
);
const StatusMsg = ({type,children}) => (
  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',padding:'8px 14px',marginTop:'10px',letterSpacing:'1px',color:type==='ok'?'#00ff88':'#ff5f57',background:type==='ok'?'rgba(0,255,136,.07)':'rgba(255,95,87,.07)',border:`1px solid ${type==='ok'?'rgba(0,255,136,.2)':'rgba(255,95,87,.2)'}`}}>{children}</div>
);

const S = {
  wrap:      {minHeight:'100vh',background:'#020a0f',fontFamily:"'Space Grotesk',sans-serif"},
  hdr:       {background:'#041018',borderBottom:'1px solid rgba(0,255,136,.1)',padding:'1rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10},
  hdrTitle:  {fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',letterSpacing:'3px',color:'#00ff88'},
  tabs:      {display:'flex',borderBottom:'1px solid rgba(0,255,136,.1)'},
  tab:       {fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',letterSpacing:'2px',padding:'12px 24px',cursor:'pointer',background:'transparent',border:'none',color:'#4a7a8a',borderBottom:'2px solid transparent',marginBottom:'-1px',transition:'all .2s'},
  tabActive: {color:'#00ff88',borderBottomColor:'#00ff88'},
  panel:     {padding:'1.5rem',maxWidth:'900px'},
  grid2:     {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'},
  input:     {background:'#041018',border:'1px solid rgba(0,255,136,.1)',color:'#e8f8ff',padding:'10px 13px',fontSize:'12px',fontFamily:"'JetBrains Mono',monospace",outline:'none',width:'100%',transition:'border-color .2s'},
  btn:       {fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',letterSpacing:'2px',padding:'10px 20px',cursor:'pointer',background:'#00ff88',color:'#000',border:'none',fontWeight:600,transition:'all .2s'},
  adminItem: {background:'#041018',border:'1px solid rgba(0,255,136,.1)',padding:'12px 14px',display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'},
  loginWrap: {minHeight:'100vh',background:'#020a0f',display:'flex',alignItems:'center',justifyContent:'center'},
  loginBox:  {background:'#041018',border:'1px solid rgba(0,255,136,.25)',padding:'2.5rem',width:'min(420px,90vw)',textAlign:'center'},
  closeBtn:  {fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#4a7a8a',border:'1px solid rgba(0,255,136,.1)',padding:'6px 14px',textDecoration:'none'},
};
