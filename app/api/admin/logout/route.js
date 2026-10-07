import { NextResponse } from 'next/server'
import { SESSION_COOKIE, STAGE_COOKIE, cookieOpts, sameOrigin, getSession, callScript, clientInfo, jsonError } from '../../../../lib/adminAuth'
export const dynamic = 'force-dynamic'

export async function POST(request) {
  if (!sameOrigin(request)) return jsonError(403, 'forbidden_origin')
  if (await getSession()) { try { await callScript('logout', clientInfo(request)) } catch {} }
  const out = NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  out.cookies.set(SESSION_COOKIE, '', cookieOpts(0))
  out.cookies.set(STAGE_COOKIE, '', cookieOpts(0))
  return out
}
