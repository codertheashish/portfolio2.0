import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  hashPassword, defaultHashes, callScript, signToken, verifyToken, cookieOpts, randomToken, clientInfo, sameOrigin,
  jsonError, configured, siteUrl, SESSION_COOKIE, STAGE_COOKIE, SESSION_TTL_S, STAGE_TTL_S,
} from '../../../../lib/adminAuth'

export const dynamic = 'force-dynamic'
const send = (data, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  if (!sameOrigin(request)) return jsonError(403, 'forbidden_origin')
  if (!configured()) return jsonError(500, 'server_not_configured')
  let body
  try { body = await request.json() } catch { return jsonError(400, 'bad_json') }
  const step = Number(body?.step), password = body?.password
  if ((step !== 1 && step !== 2) || typeof password !== 'string' || !password || password.length > 200) {
    return jsonError(400, 'bad_request')
  }
  // Step 2 is only reachable with a fresh, signed proof that step 1 passed.
  if (step === 2 && !verifyToken(cookies().get(STAGE_COOKIE)?.value, 'g')) {
    return jsonError(401, 'start_over')
  }

  let r
  try {
    r = await callScript('auth', {
      step, hash: hashPassword(password, step), approvalToken: randomToken(),
      siteUrl: siteUrl(), ...defaultHashes(), ...clientInfo(request),
    })
  } catch (e) {
    console.error('[admin-login] Apps Script call failed:', e?.message)
    return jsonError(502, e?.message === 'bad_script_response' ? 'script_not_updated' : 'security_backend_unavailable')
  }
  if (r.status === 'error') console.error('[admin-login] Apps Script replied:', r.message)

  if (r.status === 'locked') {
    const out = send({ status: 'locked', until: r.until, justLocked: !!r.justLocked }, 423)
    out.cookies.set(STAGE_COOKIE, '', cookieOpts(0))
    return out
  }
  if (r.status === 'bad') {
    const out = send({ status: 'bad', attemptsLeft: r.attemptsLeft }, 401)
    out.cookies.set(STAGE_COOKIE, '', cookieOpts(0))
    return out
  }
  if (r.status === 'ok' && step === 1) {
    const out = send({ status: 'ok', next: 2 })
    out.cookies.set(STAGE_COOKIE,
      signToken({ t: 'g', exp: Math.floor(Date.now() / 1000) + STAGE_TTL_S, n: randomToken().slice(0, 16) }),
      cookieOpts(STAGE_TTL_S))
    return out
  }
  if (r.status === 'ok' && step === 2) {
    const now = Math.floor(Date.now() / 1000)
    const out = send({ status: 'ok' })
    out.cookies.set(SESSION_COOKIE, signToken({ t: 's', iat: now, exp: now + SESSION_TTL_S, v: r.ver, mc: r.usingDefault ? 1 : 0 }), cookieOpts(SESSION_TTL_S))
    out.cookies.set(STAGE_COOKIE, '', cookieOpts(0))
    return out
  }
  return jsonError(500, r.message || 'auth_error')
}
