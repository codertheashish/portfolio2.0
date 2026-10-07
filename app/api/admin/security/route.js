import { NextResponse } from 'next/server'
import { guardAdmin, callScript, configStatus, jsonError } from '../../../../lib/adminAuth'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const denied = await guardAdmin(request, { mutation: false, allowDefault: true })
  if (denied) return denied
  try {
    const r = await callScript('securityInfo')
    return NextResponse.json({ ...r, config: configStatus() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return jsonError(502, 'security_backend_unavailable') }
}
