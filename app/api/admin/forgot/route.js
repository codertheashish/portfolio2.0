// Sends a password-reset link to the OWNER'S Gmail. The response never depends on whether anything was sent.
import { NextResponse } from 'next/server'
import { callScript, randomToken, siteUrl, clientInfo, sameOrigin, jsonError, configured } from '../../../../lib/adminAuth'
export const dynamic = 'force-dynamic'

export async function POST(request) {
  if (!sameOrigin(request)) return jsonError(403, 'forbidden_origin')
  if (!configured()) return jsonError(500, 'server_not_configured')
  try { await callScript('resetRequest', { resetToken: randomToken(), siteUrl: siteUrl(), ...clientInfo(request) }) }
  catch (e) {
    console.error('[admin-forgot]', e?.message)
    return jsonError(502, e?.message === 'bad_script_response' ? 'script_not_updated' : 'security_backend_unavailable')
  }
  return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
}
