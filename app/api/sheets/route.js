// app/api/sheets/route.js
// ================================================================
// Next.js API Route — Google Sheets se Projects + Certs fetch karo
// Yeh file Next.js server pe run hoti hai — SHEET_URL safe rehta hai
// ================================================================

import { NextResponse } from 'next/server';

// .env.local mein daalo: SHEET_URL=https://script.google.com/...
const SHEET_URL = process.env.SHEET_URL || '';

// ── GET /api/sheets?action=getProjects | getCerts ──────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (!SHEET_URL) {
    return NextResponse.json(
      { status: 'error', message: 'SHEET_URL not configured in .env.local' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${SHEET_URL}?action=${action}`, {
      next: { revalidate: 60 }, // 60s cache
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}

// ── POST /api/sheets  body: { action, data } ──────────────────
export async function POST(request) {
  const body = await request.json();
  const { action, data } = body;

  if (!SHEET_URL) {
    return NextResponse.json(
      { status: 'error', message: 'SHEET_URL not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `${SHEET_URL}?action=${action}&data=${encodeURIComponent(JSON.stringify(data))}`
    );
    const result = await res.json();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}
