// ================================================================
// GOOGLE APPS SCRIPT — Portfolio2.0  (content + admin security)
// Extensions → Apps Script → paste this file → Deploy as Web App
//   Execute as: Me   |   Who has access: Anyone
//
// REQUIRED Script Properties (Project Settings → Script properties):
//   API_KEY       long random string; must equal Vercel APPS_SCRIPT_API_KEY
//   OWNER_EMAIL   Gmail address that receives security alerts
//   ADMIN_HASH_1  output of  node scripts/hash-passwords.mjs
//   ADMIN_HASH_2  output of  node scripts/hash-passwords.mjs
//
// Public reads (getProjects / getCerts) work without a key.
// EVERYTHING else (writes, auth, logs) needs API_KEY and only POST.
// Passwords never reach this script — only peppered scrypt hashes.
// ================================================================

const SHEET_ID = '1whpXGOdzVsajknk3vkVqxfb0oyJwt_B9WB2_V8NBijc';

const MAX_ATTEMPTS      = 3;
const LOCK_MS           = 24 * 60 * 60 * 1000;  // lock duration
const ATTEMPT_DECAY_MS  = 24 * 60 * 60 * 1000;  // stale failures are forgotten
const APPROVAL_TTL_MS   = 60 * 60 * 1000;       // approval link validity
const UNLOCK_WINDOW_MS  = 15 * 60 * 1000;       // login window after approval
const LOG_SHEET         = 'SecurityLog';
const LOG_KEEP          = 500;

// ── entry points ─────────────────────────────────────────────────
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  try {
    if (action === 'getProjects') return out_(getProjects_());
    if (action === 'getCerts')    return out_(getCerts_());
    const g = /^get(\w+)$/.exec(action || '');
    if (g && COLLECTIONS[g[1]]) return out_(getColl_(g[1]));
    return out_({ status: 'error', message: 'Public GET only supports read actions' });
  } catch (err) { return out_({ status: 'error', message: String(err) }); }
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ status: 'error', message: 'bad_request' }); }
  const key = PropertiesService.getScriptProperties().getProperty('API_KEY');
  if (!key || key.length < 24 || !safeEqual_(String(body.key || ''), key)) {
    return out_({ status: 'error', message: 'unauthorized' });
  }
  const action = body.action;
  if (action === 'getProjects') return out_(getProjects_());
  if (action === 'getCerts')    return out_(getCerts_());
  const gm = /^get(\w+)$/.exec(action || '');
  if (gm && COLLECTIONS[gm[1]]) return out_(getColl_(gm[1]));

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    return out_(route_(action, body));
  } catch (err) {
    return out_({ status: 'error', message: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function route_(action, p) {
  switch (action) {
    case 'auth':            return auth_(p);
    case 'lockStatus':      return lockStatus_();
    case 'sessionVersion':  return { status: 'ok', ver: getState_().sessVer || 1 };
    case 'securityInfo':    return securityInfo_();
    case 'changePassword':  return changePassword_(p);
    case 'resetRequest':    return resetRequest_(p);
    case 'resetPeek':       return resetPeek_(p.token);
    case 'resetApply':      return resetApply_(p);
    case 'approvalPeek':    return approvalPeek_(p.token);
    case 'approval':        return approval_(p);
    case 'logout':          log_('LOGOUT', '', p); return { status: 'ok' };
    case 'addProject': case 'updateProject': case 'deleteProject':
    case 'addCert':    case 'updateCert':    case 'deleteCert':
      return content_(action, p.data || {});
    default:
      if (/^(add|update|delete|seed|move)(\w+)$/.test(action)) return coll_(action, p.data || {});
      return { status: 'error', message: 'Unknown action' };
  }
}

// ── helpers ──────────────────────────────────────────────────────
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function props_() { return PropertiesService.getScriptProperties(); }
function safeEqual_(a, b) {
  a = String(a); b = String(b);
  let d = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) d |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return d === 0;
}
function sha256hex_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(function (b) { return ((b < 0 ? b + 256 : b)).toString(16).padStart(2, '0'); }).join('');
}
function getState_() { try { return JSON.parse(props_().getProperty('SEC_STATE') || '{}'); } catch (e) { return {}; } }
function saveState_(s) { props_().setProperty('SEC_STATE', JSON.stringify(s)); }
function fmt_(ms) { return Utilities.formatDate(new Date(ms), Session.getScriptTimeZone(), 'MMM d, yyyy h:mm a z'); }
function ownerEmail_() { return props_().getProperty('OWNER_EMAIL') || Session.getEffectiveUser().getEmail(); }
function esc_(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

// ── security log (separate sheet, no secrets) ───────────────────
function logSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(LOG_SHEET);
  if (!sh) { sh = ss.insertSheet(LOG_SHEET); sh.appendRow(['time', 'event', 'detail', 'ip', 'agent']); }
  return sh;
}
function log_(event, detail, p) {
  try {
    const sh = logSheet_();
    sh.appendRow([new Date().toISOString(), event, detail || '', (p && p.ip) || '', String((p && p.ua) || '').slice(0, 80)]);
    const n = sh.getLastRow();
    if (n > LOG_KEEP + 100) sh.deleteRows(2, n - LOG_KEEP - 1);
  } catch (e) {}
}

// ── authentication ──────────────────────────────────────────────
function isLocked_(st, now) {
  const unlocked = st.unlockUntil && now < st.unlockUntil;
  return !!(st.lockUntil && now < st.lockUntil && !unlocked);
}
function normalize_(st, now) {
  if (st.attempts > 0 && st.lastFail && now - st.lastFail > ATTEMPT_DECAY_MS) st.attempts = 0;
  if (st.lockUntil && now >= st.lockUntil) { st.lockUntil = 0; st.unlockUntil = 0; st.attempts = 0; }
  if (st.unlockUntil && now >= st.unlockUntil) st.unlockUntil = 0;
}
function lockStatus_() {
  const st = getState_(), now = Date.now(); normalize_(st, now);
  return { status: 'ok', locked: isLocked_(st, now), until: st.lockUntil || 0 };
}
function blockedReply_(st, now, p) {
  if (!st.lastBlockedLog || now - st.lastBlockedLog > 60000) { st.lastBlockedLog = now; log_('BLOCKED', 'attempt while locked', p); }
  saveState_(st);
  return { status: 'locked', until: st.lockUntil };
}
// returns a reply for a failed credential check (and locks on the 3rd)
function registerFailure_(st, now, p, label) {
  st.attempts = (st.attempts || 0) + 1; st.lastFail = now;
  log_('FAILED', label + ' (' + st.attempts + '/' + MAX_ATTEMPTS + ')', p);
  if (st.attempts >= MAX_ATTEMPTS) {
    st.lockUntil = now + LOCK_MS; st.unlockUntil = 0;
    const token = String(p.approvalToken || '');
    if (token.length >= 32) { st.approvalHash = sha256hex_(token); st.approvalExp = now + APPROVAL_TTL_MS; }
    else { st.approvalHash = ''; st.approvalExp = 0; }
    log_('LOCKED', 'locked for 24h', p);
    saveState_(st);
    sendAlert_(st, token, p, now);
    return { status: 'locked', until: st.lockUntil, justLocked: true };
  }
  saveState_(st);
  return { status: 'bad', attemptsLeft: MAX_ATTEMPTS - st.attempts };
}
// Until a password is changed, Next.js supplies the built-in first-run default hash for that slot.
function storedHash_(n, p) { return props_().getProperty('ADMIN_HASH_' + n) || String(p['defaultHash' + n] || p.defaultHash || ''); }
function usingDefault_() { return !props_().getProperty('ADMIN_HASH_1') || !props_().getProperty('ADMIN_HASH_2'); }
function auth_(p) {
  const now = Date.now(), st = getState_(); normalize_(st, now);
  if (isLocked_(st, now)) return blockedReply_(st, now, p);
  const step = Number(p.step);
  if (step !== 1 && step !== 2) return { status: 'error', message: 'bad_step' };
  const stored = storedHash_(step, p);
  if (!stored) return { status: 'error', message: 'not_configured' };
  if (safeEqual_(stored, String(p.hash || ''))) {
    if (step === 1) { saveState_(st); return { status: 'ok', step: 1 }; }
    st.attempts = 0; st.lastFail = 0; st.lockUntil = 0; st.unlockUntil = 0; st.approvalHash = ''; st.approvalExp = 0;
    saveState_(st);
    log_('SUCCESS', 'admin login', p);
    return { status: 'ok', step: 2, ver: st.sessVer || 1, usingDefault: usingDefault_() };
  }
  return registerFailure_(st, now, p, 'password ' + step);
}

// ── owner e-mail + approval ─────────────────────────────────────
function sendAlert_(st, token, p, now) {
  try {
    const site = String(p.siteUrl || '').replace(/\/+$/, '');
    const base = site + '/admin/approve?t=' + encodeURIComponent(token);
    const hasLink = token.length >= 32 && site;
    const when = fmt_(now), until = fmt_(st.lockUntil);
    const btn = function (href, label, bg, fg) {
      return '<a href="' + href + '" style="display:inline-block;padding:12px 26px;margin:6px 8px 6px 0;background:' + bg +
        ';color:' + fg + ';font-weight:700;letter-spacing:2px;text-decoration:none;font-family:monospace;font-size:13px">' + label + '</a>';
    };
    const html =
      '<div style="background:#020a0f;padding:28px;font-family:Arial,sans-serif;color:#cfe8f0">' +
      '<div style="font-family:monospace;color:#00ff88;letter-spacing:3px;font-size:12px">// SECURITY ALERT</div>' +
      '<h2 style="color:#e8f8ff;margin:10px 0">Portfolio Admin Security Alert</h2>' +
      '<p>Someone attempted to access the Portfolio Admin Panel.</p>' +
      '<p><b>3 failed authentication attempts</b> were detected.<br>The Admin Panel has been <b>locked for 24 hours</b>.</p>' +
      '<table style="font-family:monospace;font-size:12px;color:#8aabb8">' +
      '<tr><td>Time</td><td style="padding-left:14px">' + esc_(when) + '</td></tr>' +
      '<tr><td>Failed attempts</td><td style="padding-left:14px">' + MAX_ATTEMPTS + '</td></tr>' +
      '<tr><td>Lock status</td><td style="padding-left:14px">LOCKED until ' + esc_(until) + '</td></tr>' +
      '<tr><td>Request (approx.)</td><td style="padding-left:14px">' + esc_(p.ip || 'unknown') + ' · ' + esc_(String(p.ua || 'unknown').slice(0, 70)) + '</td></tr></table>' +
      (hasLink
        ? '<p style="margin-top:18px">' + btn(base + '&d=approve', 'APPROVE ACCESS', '#00ff88', '#000') + btn(base + '&d=deny', 'DENY ACCESS', '#ff5f57', '#fff') + '</p>' +
          '<p style="font-size:12px;color:#8aabb8">Links are single-use and expire in ' + (APPROVAL_TTL_MS / 60000) + ' minutes. Approving opens a ' +
          (UNLOCK_WINDOW_MS / 60000) + '-minute window with 3 new attempts; <b>both passwords are still required</b>. Denying keeps the lock.</p>'
        : '<p>No approval link could be generated. The lock expires automatically.</p>') +
      '<p style="font-size:11px;color:#4a7a8a">No passwords are ever included in this e-mail. If this was not you, press DENY.</p></div>';
    MailApp.sendEmail({
      to: ownerEmail_(), subject: 'Portfolio Admin Security Alert', htmlBody: html,
      body: 'Portfolio Admin Security Alert\n\n3 failed attempts at ' + when + '. Admin locked until ' + until + '.\n' +
        (hasLink ? 'Approve: ' + base + '&d=approve\nDeny: ' + base + '&d=deny\n' : '')
    });
  } catch (e) { log_('EMAIL_FAILED', String(e).slice(0, 100), p); }
}
function notify_(subject, text) {
  try { MailApp.sendEmail({ to: ownerEmail_(), subject: subject, body: text }); } catch (e) {}
}
function approvalValid_(st, token, now) {
  return !!(st.approvalHash && now < st.approvalExp && token && safeEqual_(sha256hex_(String(token)), st.approvalHash));
}
function approvalPeek_(token) {
  const st = getState_(), now = Date.now();
  return { status: 'ok', valid: approvalValid_(st, token, now) };
}
function approval_(p) {
  const st = getState_(), now = Date.now();
  if (!approvalValid_(st, p.token, now)) return { status: 'error', message: 'invalid_or_expired' };
  st.approvalHash = ''; st.approvalExp = 0;            // single use, for either decision
  if (p.decision === 'approve') {
    st.attempts = 0; st.lastFail = 0;
    if (st.lockUntil && now < st.lockUntil) st.unlockUntil = now + UNLOCK_WINDOW_MS;
    saveState_(st);
    log_('APPROVED', 'owner approved; ' + (UNLOCK_WINDOW_MS / 60000) + ' min window', p);
    return { status: 'ok', decision: 'approve', windowMinutes: UNLOCK_WINDOW_MS / 60000 };
  }
  saveState_(st);
  log_('DENIED', 'owner denied; lock stays', p);
  return { status: 'ok', decision: 'deny' };
}

// ── security info + password change ─────────────────────────────
function securityInfo_() {
  const st = getState_(), now = Date.now(); normalize_(st, now);
  let rows = [];
  try {
    const sh = logSheet_(), n = sh.getLastRow();
    if (n > 1) {
      const start = Math.max(2, n - 39);
      rows = sh.getRange(start, 1, n - start + 1, 5).getValues().reverse().map(function (r) {
        return { time: r[0], event: r[1], detail: r[2], ip: r[3] };
      });
    }
  } catch (e) {}
  return {
    status: 'ok', locked: isLocked_(st, now), lockUntil: st.lockUntil || 0, unlockUntil: st.unlockUntil || 0,
    attempts: st.attempts || 0, maxAttempts: MAX_ATTEMPTS, log: rows,
  };
}
function changePassword_(p) {
  const now = Date.now(), st = getState_(); normalize_(st, now);
  if (isLocked_(st, now)) return blockedReply_(st, now, p);
  const h1 = storedHash_(1, p), h2 = storedHash_(2, p);
  if (!h1 || !h2) return { status: 'error', message: 'not_configured' };
  const which = Number(p.which);
  if (which !== 1 && which !== 2) return { status: 'error', message: 'bad_which' };
  const ok1 = safeEqual_(h1, String(p.cur1 || '')), ok2 = safeEqual_(h2, String(p.cur2 || ''));
  if (!(ok1 && ok2)) return registerFailure_(st, now, p, 'password change');
  const nh = String(p.newHash || '');
  if (nh.length < 32) return { status: 'error', message: 'bad_new' };
  // Password 1 and 2 must stay independent: reject reuse of the current value in this slot
  // and of the other slot's password (Next.js sends the new password hashed with BOTH salts).
  const same = which === 1 ? h1 : h2, other = which === 1 ? h2 : h1;
  if (safeEqual_(nh, same) || safeEqual_(String(p.newHashOther || ''), other)) return { status: 'error', message: 'same_as_existing' };
  props_().setProperty(which === 1 ? 'ADMIN_HASH_1' : 'ADMIN_HASH_2', nh);
  st.sessVer = (st.sessVer || 1) + 1;                  // invalidates every existing session
  st.attempts = 0; saveState_(st);
  log_('PW_CHANGED', 'password ' + which + ' changed', p);
  notify_('Portfolio Admin: password ' + which + ' changed',
    'Password ' + which + ' of the Portfolio Admin Panel was changed at ' + fmt_(now) + '. All sessions were signed out.\nIf this was not you, edit ADMIN_HASH_' + which + ' in Script Properties immediately.');
  return { status: 'ok', ver: st.sessVer };
}

// ── content (Projects / Certificates) ───────────────────────────
function clean_(v) {
  v = (v === undefined || v === null) ? '' : String(v);
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;          // block formula injection
}
function ensureCols_(sh, n, headers) {
  if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns());
  headers.forEach(function (h, i) { if (!sh.getRange(1, i + 1).getValue()) sh.getRange(1, i + 1).setValue(h); });
}
function getProjects_() {
  const data = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Projects').getDataRange().getValues();
  // Columns: emoji | title | desc | stack | category | githubUrl | num | image | liveUrl (optional)
  return { status: 'ok', data: data.slice(1).filter(function (r) { return r[1]; }).map(function (r) {
    return { emoji: r[0] || '📁', title: r[1], desc: r[2], stack: r[3], category: r[4] || 'util',
      githubUrl: r[5], num: r[6] || '', image: r[7] || '', liveUrl: r[8] || '' };
  }) };
}
function getCerts_() {
  const data = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Certificates').getDataRange().getValues();
  // Columns: emoji | name | org | certUrl | image
  return { status: 'ok', data: data.slice(1).filter(function (r) { return r[1]; }).map(function (r) {
    return { emoji: r[0] || '📜', name: r[1], org: r[2], certUrl: r[3] || '', image: r[4] || '' };
  }) };
}
function findRow_(sh, keyCol, value) {
  const d = sh.getDataRange().getValues();
  for (let i = 1; i < d.length; i++) if (String(d[i][keyCol]) === String(value)) return i + 1;
  return 0;
}
function content_(action, d) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (/Project$/.test(action)) {
    const sh = ss.getSheetByName('Projects');
    const row = [clean_(d.emoji), clean_(d.title), clean_(d.desc), clean_(d.stack), clean_(d.category), clean_(d.githubUrl), clean_(d.num), clean_(d.image), clean_(d.liveUrl)];
    if (action === 'addProject') {
      ensureCols_(sh, 9, ['emoji', 'title', 'desc', 'stack', 'category', 'githubUrl', 'num', 'image', 'liveUrl']);
      sh.appendRow(row); return { status: 'ok', message: 'Project added' };
    }
    const r = findRow_(sh, 1, d.originalTitle || d.title);
    if (!r) return { status: 'error', message: 'Project not found' };
    if (action === 'deleteProject') { sh.deleteRow(r); return { status: 'ok', message: 'Deleted' }; }
    ensureCols_(sh, 9, ['emoji', 'title', 'desc', 'stack', 'category', 'githubUrl', 'num', 'image', 'liveUrl']);
    sh.getRange(r, 1, 1, 9).setValues([row]); return { status: 'ok', message: 'Project updated' };
  }
  const sh = ss.getSheetByName('Certificates');
  const row = [clean_(d.emoji), clean_(d.name), clean_(d.org), clean_(d.certUrl), clean_(d.image)];
  if (action === 'addCert') { sh.appendRow(row); return { status: 'ok', message: 'Certificate added' }; }
  const r = findRow_(sh, 1, d.originalName || d.name);
  if (!r) return { status: 'error', message: 'Certificate not found' };
  if (action === 'deleteCert') { sh.deleteRow(r); return { status: 'ok', message: 'Deleted' }; }
  sh.getRange(r, 1, 1, 5).setValues([row]); return { status: 'ok', message: 'Certificate updated' };
}

// ── editable collections: About / Skills / Experience / Education ──
// Each tab is auto-created. Column A is an id (uuid); rows without one still work (id = "r<row>").
const COLLECTIONS = {
  Experience:  { sheet: 'Experience',  cols: ['date', 'role', 'company', 'desc', 'tags'] },
  Education:   { sheet: 'Education',   cols: ['date', 'degree', 'institute', 'desc', 'tags'] },
  SkillGroups: { sheet: 'SkillGroups', cols: ['ico', 'name', 'pills'] },
  SkillBars:   { sheet: 'SkillBars',   cols: ['name', 'pct'] },
  AboutText:   { sheet: 'AboutText',   cols: ['text'] },
  AboutInfo:   { sheet: 'AboutInfo',   cols: ['ico', 'main', 'sub'] },
};
function collSheet_(name, create) {
  const ss = SpreadsheetApp.openById(SHEET_ID), c = COLLECTIONS[name];
  let sh = ss.getSheetByName(c.sheet);
  if (!sh && create) { sh = ss.insertSheet(c.sheet); sh.appendRow(['id'].concat(c.cols)); }
  return sh;
}
function collVal_(c, col, v) { return col === 'pct' ? Math.max(0, Math.min(100, Number(v) || 0)) : clean_(v); }
function getColl_(name) {
  const sh = collSheet_(name, false), c = COLLECTIONS[name];
  if (!sh) return { status: 'ok', data: [] };
  const d = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < d.length; i++) {
    const r = d[i];
    if (!r.slice(1).some(function (x) { return x !== '' && x !== null; })) continue;
    const o = { id: String(r[0] || 'r' + (i + 1)) };
    c.cols.forEach(function (col, j) { o[col] = col === 'pct' ? Number(r[j + 1]) || 0 : String(r[j + 1] === undefined ? '' : r[j + 1]); });
    out.push(o);
  }
  return { status: 'ok', data: out };
}
function collRow_(sh, id) {
  const d = sh.getDataRange().getValues();
  for (let i = 1; i < d.length; i++) if (String(d[i][0] || 'r' + (i + 1)) === String(id)) return i + 1;
  return 0;
}
function coll_(action, d) {
  const m = /^(add|update|delete|seed|move)(\w+)$/.exec(action);
  const verb = m[1], name = m[2], c = COLLECTIONS[name];
  if (!c) return { status: 'error', message: 'Unknown collection' };
  const sh = collSheet_(name, true), n = c.cols.length + 1;
  const rowOf = function (item, id) { return [id].concat(c.cols.map(function (col) { return collVal_(c, col, item[col]); })); };
  if (verb === 'add') { sh.appendRow(rowOf(d, Utilities.getUuid())); return { status: 'ok', message: 'Added' }; }
  if (verb === 'seed') {
    if (sh.getLastRow() > 1) return { status: 'error', message: 'Tab already has content' };
    (d.items || []).forEach(function (it) { sh.appendRow(rowOf(it, Utilities.getUuid())); });
    return { status: 'ok', message: 'Imported' };
  }
  const r = collRow_(sh, d.id);
  if (!r) return { status: 'error', message: 'Item not found' };
  if (verb === 'delete') { sh.deleteRow(r); return { status: 'ok', message: 'Deleted' }; }
  if (verb === 'update') { sh.getRange(r, 1, 1, n).setValues([rowOf(d, String(d.id).charAt(0) === 'r' && /^r\d+$/.test(d.id) ? Utilities.getUuid() : d.id)]); return { status: 'ok', message: 'Updated' }; }
  if (verb === 'move') {
    const t = d.dir === 'up' ? r - 1 : r + 1;
    if (t < 2 || t > sh.getLastRow()) return { status: 'ok', message: 'No change' };
    const a = sh.getRange(r, 1, 1, n).getValues(), b = sh.getRange(t, 1, 1, n).getValues();
    sh.getRange(r, 1, 1, n).setValues(b); sh.getRange(t, 1, 1, n).setValues(a);
    return { status: 'ok', message: 'Moved' };
  }
  return { status: 'error', message: 'Unknown action' };
}

// ── forgot password: reset by e-mail link (owner's Gmail is the root of trust) ──
const RESET_TTL_MS = 30 * 60 * 1000;        // reset link validity
const RESET_COOLDOWN_MS = 5 * 60 * 1000;    // at most one reset e-mail per 5 minutes

// Always answers "ok" to the website so an attacker learns nothing.
function resetRequest_(p) {
  const now = Date.now(), st = getState_();
  if (st.lastResetReq && now - st.lastResetReq < RESET_COOLDOWN_MS) return { status: 'ok' };
  const token = String(p.resetToken || ''), site = String(p.siteUrl || '').replace(/\/+$/, '');
  if (token.length < 32 || !site) return { status: 'ok' };
  st.lastResetReq = now; st.resetHash = sha256hex_(token); st.resetExp = now + RESET_TTL_MS;
  saveState_(st);
  log_('RESET_REQUESTED', 'password reset e-mail requested', p);
  try {
    const link = site + '/admin/reset?t=' + encodeURIComponent(token);
    MailApp.sendEmail({
      to: ownerEmail_(), subject: 'Portfolio Admin — Reset password',
      htmlBody: '<div style="background:#020a0f;padding:28px;font-family:Arial,sans-serif;color:#cfe8f0">' +
        '<div style="font-family:monospace;color:#00ff88;letter-spacing:3px;font-size:12px">// PASSWORD RESET</div>' +
        '<h2 style="color:#e8f8ff">Reset your Admin passwords</h2>' +
        '<p>A password reset was requested for the Portfolio Admin Panel at <b>' + esc_(fmt_(now)) + '</b>.</p>' +
        '<p><a href="' + link + '" style="display:inline-block;padding:12px 26px;background:#00ff88;color:#000;font-weight:700;letter-spacing:2px;text-decoration:none;font-family:monospace;font-size:13px">RESET PASSWORDS</a></p>' +
        '<p style="font-size:12px;color:#8aabb8">The link works once and expires in ' + (RESET_TTL_MS / 60000) + ' minutes. You will choose a new Password 1 and Password 2; ' +
        'every old session is signed out and any lock is cleared. If this was not you, ignore this e-mail — nothing changes.</p></div>',
      body: 'Reset your Portfolio Admin passwords (valid ' + (RESET_TTL_MS / 60000) + ' min, one use):\n' + link + '\nIf this was not you, ignore this e-mail.'
    });
  } catch (e) { log_('EMAIL_FAILED', 'reset mail: ' + String(e).slice(0, 80), p); }
  return { status: 'ok' };
}
function resetValid_(st, token, now) {
  return !!(st.resetHash && now < st.resetExp && token && safeEqual_(sha256hex_(String(token)), st.resetHash));
}
function resetPeek_(token) {
  return { status: 'ok', valid: resetValid_(getState_(), token, Date.now()) };
}
function resetApply_(p) {
  const now = Date.now(), st = getState_();
  if (!resetValid_(st, p.token, now)) return { status: 'error', message: 'invalid_or_expired' };
  const h1 = String(p.hash1 || ''), h2 = String(p.hash2 || '');
  if (h1.length < 32 || h2.length < 32 || safeEqual_(h1, h2)) return { status: 'error', message: 'bad_new' };
  props_().setProperty('ADMIN_HASH_1', h1); props_().setProperty('ADMIN_HASH_2', h2);
  st.resetHash = ''; st.resetExp = 0; st.approvalHash = ''; st.approvalExp = 0;
  st.attempts = 0; st.lastFail = 0; st.lockUntil = 0; st.unlockUntil = 0;
  st.sessVer = (st.sessVer || 1) + 1;                  // sign out every existing session
  saveState_(st);
  log_('PASSWORD_RESET', 'both passwords reset via e-mail link', p);
  notify_('Portfolio Admin: passwords were reset',
    'Both admin passwords were reset at ' + fmt_(now) + ' using the e-mail link. All sessions were signed out and any lock was cleared.');
  return { status: 'ok' };
}

// Run this once from the Apps Script editor (function dropdown → testEmail → Run).
// It authorises Gmail sending and tells you whether alerts can reach OWNER_EMAIL.
function testEmail() {
  const to = ownerEmail_();
  MailApp.sendEmail({ to: to, subject: 'Portfolio Admin — test e-mail', body: 'If you can read this, security alerts and password-reset mails will reach you.' });
  Logger.log('Test e-mail sent to ' + to + '. Check Inbox AND Spam. Remaining daily quota: ' + MailApp.getRemainingDailyQuota());
}

// ── EMERGENCY / RESET TO FIRST-RUN PASSWORDS ──
// Run from the Apps Script editor (function dropdown → resetToDefaults → Run).
// Removes the stored password hashes, so the website's built-in first-run passwords work again,
// clears any lock / pending approval / reset links, and signs out every session.
// After logging in with the first-run passwords the panel forces you to choose new ones.
function resetToDefaults() {
  props_().deleteProperty('ADMIN_HASH_1');
  props_().deleteProperty('ADMIN_HASH_2');
  const st = getState_();
  st.attempts = 0; st.lastFail = 0; st.lockUntil = 0; st.unlockUntil = 0;
  st.approvalHash = ''; st.approvalExp = 0; st.resetHash = ''; st.resetExp = 0;
  st.sessVer = (st.sessVer || 1) + 1;
  saveState_(st);
  log_('RESET_DEFAULTS', 'passwords reset to first-run defaults from the script editor', {});
  Logger.log('Done. Both passwords are back to the first-run defaults and any lock is cleared.');
}
