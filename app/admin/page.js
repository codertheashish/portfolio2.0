// app/admin/page.js — SERVER component. Authentication is enforced here,
// on the server, before any dashboard code is sent to the browser.
import AdminPanel from '../../components/AdminPanel'
import AdminLogin from '../../components/AdminLogin'
import { getSession, callScript, configured } from '../../lib/adminAuth'
import './admin.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — codertheashish', robots: { index: false, follow: false } }

export default async function AdminPage() {
  const session = await getSession()
  if (session) return <AdminPanel mustChange={!!session.mc} />
  let lock = { locked: false, until: 0 }
  const ok = configured()
  if (ok) {
    try { const r = await callScript('lockStatus'); if (r.status === 'ok') lock = { locked: r.locked, until: r.until } } catch {}
  }
  return <AdminLogin initialLock={lock} configured={ok} />
}
