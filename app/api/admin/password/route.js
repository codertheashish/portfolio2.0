import { NextResponse } from 'next/server'
import {
  guardAdmin, callScript, hashPassword, defaultHashes, validNewPassword, clientInfo, randomToken, jsonError,
  SESSION_COOKIE, cookieOpts, invalidateVersionCache,
} from '../../../../lib/adminAuth'
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const denied = await guardAdmin(request, { allowDefault: true })
  if (denied) return denied
  let b
  try { b = await request.json() } catch { return jsonError(400, 'bad_json') }
  const which = Number(b?.which)
  if (which !== 1 && which !== 2) return jsonError(400, 'Choose password 1 or 2')
  for (const k of ['current1', 'current2', 'newPassword', 'confirm']) {
    if (typeof b[k] !== 'string' || !b[k]) return jsonError(400, 'All fields are required')
  }
  if (b.newPassword !== b.confirm) return jsonError(400, 'New password and confirmation do not match')
  const weak = validNewPassword(b.newPassword)
  if (weak) return jsonError(400, weak)

  let r
  try {
    r = await callScript('changePassword', {
      which, cur1: hashPassword(b.current1, 1), cur2: hashPassword(b.current2, 2),
      newHash: hashPassword(b.newPassword, which), newHashOther: hashPassword(b.newPassword, which === 1 ? 2 : 1), approvalToken: randomToken(), ...defaultHashes(), ...clientInfo(request),
    })
  } catch { return jsonError(502, 'security_backend_unavailable') }

  if (r.status === 'locked') return jsonError(423, 'locked', { until: r.until })
  if (r.status === 'bad') return jsonError(401, 'Current password(s) incorrect', { attemptsLeft: r.attemptsLeft })
  if (r.status !== 'ok') {
    const m = { same_as_existing: 'New password must differ from both current passwords' }[r.message]
    return jsonError(400, m || 'Password change failed')
  }
  invalidateVersionCache()
  const out = NextResponse.json({ status: 'ok', relogin: true }, { headers: { 'Cache-Control': 'no-store' } })
  out.cookies.set(SESSION_COOKIE, '', cookieOpts(0))
  return out
}
