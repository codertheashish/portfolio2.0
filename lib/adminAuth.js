// lib/adminAuth.js — SERVER ONLY. Never import from a 'use client' file.
import crypto from 'crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'admin_session'
export const STAGE_COOKIE   = 'admin_stage'
export const SESSION_TTL_S  = 2 * 60 * 60      // 2 hours, absolute
export const STAGE_TTL_S    = 5 * 60           // time allowed between Password 1 and 2

const SITE_URL_DEFAULT = 'https://codertheashish.vercel.app'
export const siteUrl = () => (process.env.SITE_URL || SITE_URL_DEFAULT).replace(/\/+$/, '')

export function configStatus() {
  return {
    SHEET_URL:             !!process.env.SHEET_URL,
    APPS_SCRIPT_API_KEY:   !!process.env.APPS_SCRIPT_API_KEY,
    ADMIN_SECURITY_SECRET: (process.env.ADMIN_SECURITY_SECRET || '').length >= 32,
    SITE_URL:              !!process.env.SITE_URL,
  }
}
export const configured = () => {
  const c = configStatus()
  return c.SHEET_URL && c.APPS_SCRIPT_API_KEY && c.ADMIN_SECURITY_SECRET
}

// ── key derivation: one master secret, separate sub-keys per purpose ──
const subKey = label => crypto.createHmac('sha256', process.env.ADMIN_SECURITY_SECRET || '').update(label).digest()

/** Peppered scrypt. Output is what Apps Script stores/compares — never the password. */
export function hashPassword(password, which) {
  return crypto.scryptSync(String(password).normalize('NFKC'), subKey('pw-salt:' + which), 32,
    { N: 16384, r: 8, p: 1 }).toString('hex')
}

// ── signed, expiring tokens (cookies) ──
const b64 = b => Buffer.from(b).toString('base64url')
export function signToken(payload) {
  const body = b64(JSON.stringify(payload))
  const sig  = crypto.createHmac('sha256', subKey('cookie-sign')).update(body).digest('base64url')
  return body + '.' + sig
}
export function verifyToken(token, type) {
  try {
    if (!token || typeof token !== 'string') return null
    const [body, sig] = token.split('.')
    if (!body || !sig) return null
    const good = crypto.createHmac('sha256', subKey('cookie-sign')).update(body).digest('base64url')
    const a = Buffer.from(sig), b = Buffer.from(good)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
    const p = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (p.t !== type || !p.exp || Date.now() / 1000 > p.exp) return null
    return p
  } catch { return null }
}

export const cookieOpts = maxAge => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path:     '/',
  maxAge,
})

// ── Apps Script bridge (secret key travels only server → Apps Script) ──
export async function callScript(action, payload = {}) {
  const url = process.env.SHEET_URL, key = process.env.APPS_SCRIPT_API_KEY
  if (!url || !key) throw new Error('not_configured')
  const res = await fetch(url, {
    method: 'POST', redirect: 'follow', cache: 'no-store',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ key, action, ...payload }),
  })
  const text = await res.text()
  try { return JSON.parse(text) } catch { throw new Error('bad_script_response') }
}

// ── session verification (signature + expiry + server-side version) ──
const verCache = { v: 0, at: 0 }
async function currentVersion() {
  if (Date.now() - verCache.at < 15000 && verCache.v) return verCache.v
  const r = await callScript('sessionVersion')
  if (r.status !== 'ok') throw new Error('ver')
  verCache.v = r.ver; verCache.at = Date.now()
  return r.ver
}
export function invalidateVersionCache() { verCache.at = 0 }

/** Returns the session payload, or null. Fails CLOSED on any error. */
export async function getSession() {
  try {
    if (!configured()) return null
    const p = verifyToken(cookies().get(SESSION_COOKIE)?.value, 's')
    if (!p) return null
    return (await currentVersion()) === p.v ? p : null
  } catch { return null }
}

export const jsonError = (status, message, extra = {}) =>
  Response.json({ status: 'error', message, ...extra }, { status, headers: { 'Cache-Control': 'no-store' } })

/** CSRF defence in depth (cookies are also SameSite=Strict). */
export function sameOrigin(request) {
  const origin = request.headers.get('origin'), host = request.headers.get('host')
  if (!origin || !host) return false
  try { return new URL(origin).host === host } catch { return false }
}

/** Standard guard for admin mutations. Returns a Response on failure, or null. */
export async function guardAdmin(request, { mutation = true, allowDefault = false } = {}) {
  if (mutation && !sameOrigin(request)) return jsonError(403, 'forbidden_origin')
  const s = await getSession()
  if (!s) return jsonError(401, 'unauthorized')
  if (s.mc && !allowDefault) return jsonError(403, 'change_default_passwords')
  return null
}

function maskIp(ip) {
  if (!ip) return 'unknown'
  if (ip.includes(':')) return ip.split(':').slice(0, 3).join(':') + '::'
  const o = ip.split('.'); return o.length === 4 ? `${o[0]}.${o[1]}.${o[2]}.x` : 'unknown'
}
export function clientInfo(request) {
  const fwd = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
  return { ip: maskIp(fwd.split(',')[0].trim()), ua: (request.headers.get('user-agent') || 'unknown').slice(0, 80) }
}

// First-run defaults, used ONLY for a slot whose hash has never been stored in Apps Script.
// The repo is public, so these are not secret: the admin panel forces both to be changed on first login.
const FIRST_RUN = { 1: 'codertheashish', 2: '16012005' }
export const defaultHashes = () => ({ defaultHash1: hashPassword(FIRST_RUN[1], 1), defaultHash2: hashPassword(FIRST_RUN[2], 2) })

export const randomToken = () => crypto.randomBytes(32).toString('hex')

export function validNewPassword(pw) {
  if (typeof pw !== 'string' || pw.length < 12) return 'Minimum 12 characters'
  if (pw.length > 200) return 'Too long'
  return null
}
