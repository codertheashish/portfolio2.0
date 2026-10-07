// Owner approval endpoint. Reachable by anyone, but useless without the
// random single-use token that was e-mailed to the owner. Approving only
// opens a login window — it never logs anybody in.
import { NextResponse } from 'next/server'
import { callScript, clientInfo, sameOrigin, jsonError, configured } from '../../../../lib/adminAuth'
export const dynamic = 'force-dynamic'
const okToken = t => typeof t === 'string' && /^[a-f0-9]{64}$/.test(t)

export async function GET(request) {
  if (!configured()) return jsonError(500, 'server_not_configured')
  const t = new URL(request.url).searchParams.get('t')
  if (!okToken(t)) return NextResponse.json({ valid: false })
  try {
    const r = await callScript('approvalPeek', { token: t })
    return NextResponse.json({ valid: !!r.valid }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return jsonError(502, 'security_backend_unavailable') }
}

export async function POST(request) {
  if (!sameOrigin(request)) return jsonError(403, 'forbidden_origin')
  let b
  try { b = await request.json() } catch { return jsonError(400, 'bad_json') }
  if (!okToken(b?.token) || !['approve', 'deny'].includes(b?.decision)) return jsonError(400, 'bad_request')
  try {
    const r = await callScript('approval', { token: b.token, decision: b.decision, ...clientInfo(request) })
    if (r.status !== 'ok') return jsonError(410, 'This link is invalid, expired or already used')
    return NextResponse.json({ status: 'ok', decision: r.decision, windowMinutes: r.windowMinutes }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return jsonError(502, 'security_backend_unavailable') }
}
