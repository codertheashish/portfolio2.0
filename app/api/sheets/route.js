// app/api/sheets/route.js
// GET  (public)  → getProjects / getCerts, cached 60s, revalidated after admin edits
// POST (ADMIN)   → add/update/delete; requires a valid server-side admin session
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { callScript, guardAdmin, jsonError } from '../../../lib/adminAuth'
import { cleanProject, cleanCert, cleanDelete } from '../../../lib/validate'
import { ACTION_RE, NAMES, cleanCollAction } from '../../../lib/collections'

const SHEET_URL = () => process.env.SHEET_URL || ''
const READ = ['getProjects', 'getCerts']
const WRITE = ['addProject', 'updateProject', 'deleteProject', 'addCert', 'updateCert', 'deleteCert']

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const readOk = READ.includes(action) || (/^get/.test(action || '') && NAMES.includes(action.slice(3)))
  if (!readOk) return NextResponse.json({ status: 'error', message: 'Unknown action' }, { status: 400 })
  if (!SHEET_URL()) return NextResponse.json({ status: 'error', message: 'SHEET_URL not configured' }, { status: 500 })
  try {
    const fresh = searchParams.get('fresh') === '1'
    const res = await fetch(`${SHEET_URL()}?action=${action}`,
      fresh ? { cache: 'no-store' } : { next: { revalidate: 60, tags: ['sheet'] } })
    return NextResponse.json(await res.json())
  } catch (err) {
    return NextResponse.json({ status: 'error', message: 'Sheet unavailable' }, { status: 502 })
  }
}

export async function POST(request) {
  const denied = await guardAdmin(request)
  if (denied) return denied
  let body
  try { body = await request.json() } catch { return jsonError(400, 'bad_json') }
  const { action, data } = body || {}
  let clean
  if (typeof action === 'string' && ACTION_RE.test(action)) {
    const c = cleanCollAction(action, data)
    if (c.error) return jsonError(400, c.error)
    clean = { data: c.payload }
  } else {
    if (!WRITE.includes(action)) return jsonError(400, 'Unknown action')
    if (action.startsWith('delete')) clean = cleanDelete(action, data)
    else clean = action.endsWith('Project') ? cleanProject(data) : cleanCert(data)
    if (clean.error) return jsonError(400, clean.error)
  }

  try {
    const r = await callScript(action, { data: clean.data })
    if (r.status === 'ok') revalidateTag('sheet')
    return NextResponse.json(r, { status: r.status === 'ok' ? 200 : 400, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return jsonError(502, 'Sheet unavailable')
  }
}
