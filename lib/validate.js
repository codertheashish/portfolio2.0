// lib/validate.js — server-side validation for admin content writes
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const url = v => { v = str(v, 500); return v === '' || /^https?:\/\/[^\s]+$/i.test(v) ? v : null }
const img = v => { v = str(v, 500); return v === '' || /^\/[A-Za-z0-9_\-./ %]+$/.test(v) || /^https:\/\/[^\s]+$/i.test(v) ? v : null }
const CATS = ['cv', 'ai', 'web', 'util']

export function cleanProject(d = {}) {
  const o = {
    emoji: str(d.emoji, 8) || '📁', num: str(d.num, 6), title: str(d.title, 120), desc: str(d.desc, 600),
    stack: str(d.stack, 200), category: str(d.category, 10), githubUrl: url(d.githubUrl),
    liveUrl: url(d.liveUrl), image: img(d.image), originalTitle: str(d.originalTitle, 120),
  }
  if (!o.title || !o.desc) return { error: 'Title and description are required' }
  if (o.githubUrl === null || o.liveUrl === null) return { error: 'URLs must start with http:// or https://' }
  if (o.image === null) return { error: 'Image must be a /public path or https URL' }
  if (!o.githubUrl) return { error: 'GitHub URL is required' }
  if (!CATS.includes(o.category)) o.category = 'util'
  return { data: o }
}
export function cleanCert(d = {}) {
  const o = { emoji: str(d.emoji, 8) || '📜', name: str(d.name, 160), org: str(d.org, 120),
    certUrl: url(d.certUrl), image: img(d.image), originalName: str(d.originalName, 160) }
  if (!o.name || !o.org) return { error: 'Name and organization are required' }
  if (o.certUrl === null) return { error: 'Certificate URL must start with http:// or https://' }
  if (o.image === null) return { error: 'Image must be a /public path or https URL' }
  return { data: o }
}
export function cleanDelete(action, d = {}) {
  const k = action === 'deleteProject' ? str(d.title, 120) : str(d.name, 160)
  if (!k) return { error: 'Missing key' }
  return { data: action === 'deleteProject' ? { title: k } : { name: k } }
}
