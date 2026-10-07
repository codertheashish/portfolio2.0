// lib/collections.js — SERVER: validation for the editable content collections
import { DEFAULTS } from './defaultData'

const T = (max) => ({ max })
export const COLLS = {
  Experience:  { fields: { date: T(40), role: T(120), company: T(160), desc: T(900), tags: T(200) }, required: ['role', 'company'] },
  Education:   { fields: { date: T(40), degree: T(120), institute: T(160), desc: T(900), tags: T(200) }, required: ['degree', 'institute'] },
  SkillGroups: { fields: { ico: T(8), name: T(60), pills: T(500) }, required: ['name'] },
  SkillBars:   { fields: { name: T(80), pct: { pct: true } }, required: ['name'] },
  AboutText:   { fields: { text: T(1500) }, required: ['text'] },
  AboutInfo:   { fields: { ico: T(8), main: T(120), sub: T(160) }, required: ['main'] },
}
export const NAMES = Object.keys(COLLS)
export const ACTION_RE = new RegExp('^(add|update|delete|seed|move)(' + NAMES.join('|') + ')$')
const ID = /^[A-Za-z0-9_-]{1,64}$/

function cleanItem(c, d = {}) {
  const o = {}
  for (const [k, spec] of Object.entries(c.fields)) {
    if (spec.pct) { const n = Math.round(Number(d[k])); o[k] = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0 }
    else o[k] = typeof d[k] === 'string' ? d[k].trim().slice(0, spec.max) : ''
  }
  for (const r of c.required) if (!o[r]) return null
  return o
}

/** returns { payload } or { error } for an action such as "updateExperience" */
export function cleanCollAction(action, data = {}) {
  const [, verb, name] = ACTION_RE.exec(action)
  const c = COLLS[name]
  if (verb === 'seed') {
    const items = (DEFAULTS[name] || []).map(i => cleanItem(c, i)).filter(Boolean)
    return { payload: { items } }
  }
  if (verb === 'delete') return ID.test(data.id || '') ? { payload: { id: data.id } } : { error: 'Invalid id' }
  if (verb === 'move') {
    return ID.test(data.id || '') && ['up', 'down'].includes(data.dir) ? { payload: { id: data.id, dir: data.dir } } : { error: 'Invalid move' }
  }
  const item = cleanItem(c, data)
  if (!item) return { error: 'Please fill the required fields' }
  if (verb === 'update') { if (!ID.test(data.id || '')) return { error: 'Invalid id' }; item.id = data.id }
  return { payload: item }
}
