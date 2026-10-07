// Public repository count straight from GitHub (cached 1 hour on the server).
// Optional env: GITHUB_USERNAME (default codertheashish), GITHUB_TOKEN (only to avoid rate limits).
import { NextResponse } from 'next/server'

export async function GET() {
  const user = process.env.GITHUB_USERNAME || 'codertheashish'
  try {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site' }
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`, { headers, next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json({ repos: null }, { status: 502 })
    const j = await res.json()
    const repos = Number(j.public_repos)
    return NextResponse.json({ repos: Number.isFinite(repos) ? repos : null })
  } catch {
    return NextResponse.json({ repos: null }, { status: 502 })
  }
}
