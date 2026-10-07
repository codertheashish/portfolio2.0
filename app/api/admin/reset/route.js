import { NextResponse } from 'next/server'
import { callScript, hashPassword, validNewPassword, clientInfo, sameOrigin, jsonError, configured } from '../../../../lib/adminAuth'
export const dynamic = 'force-dynamic'
const okToken = t => typeof t === 'string' && /^[a-f0-9]{64}$/.test(t)

export async function GET(request) {
  if (!configured()) return jsonError(500, 'server_not_configured')
  const t = new URL(request.url).searchParams.get('t')
  if (!okToken(t)) return NextResponse.json({ valid: false })
  try { const r = await callScript('resetPeek', { token: t }); return NextResponse.json({ valid: !!r.valid }, { headers: { 'Cache-Control': 'no-store' } }) }
  catch { return jsonError(502, 'security_backend_unavailable') }
}

export async function POST(request) {
  if (!sameOrigin(request)) return jsonError(403, 'forbidden_origin')
  let b
  try { b = await request.json() } catch { return jsonError(400, 'bad_json') }
  if (!okToken(b?.token)) return jsonError(400, 'bad_request')
  for (const k of ['p1', 'p2']) if (typeof b[k] !== 'string') return jsonError(400, 'All fields are required')
  const weak = validNewPassword(b.p1) || validNewPassword(b.p2)
  if (weak) return jsonError(400, weak)
  if (b.p1 === b.p2) return jsonError(400, 'Password 1 and Password 2 must be different')
  try {
    const r = await callScript('resetApply', { token: b.token, hash1: hashPassword(b.p1, 1), hash2: hashPassword(b.p2, 2), ...clientInfo(request) })
    if (r.status !== 'ok') return jsonError(410, 'This reset link is invalid, expired or already used')
    return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return jsonError(502, 'security_backend_unavailable') }
}
