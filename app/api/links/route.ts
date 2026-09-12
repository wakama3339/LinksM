import { NextRequest, NextResponse } from 'next/server';
import { initializeDb, sql } from '@/lib/db';
import { requireAuth } from '@/lib/api';

export async function GET() { const denied = await requireAuth(); if (denied) return denied; await initializeDb(); const links = await sql`SELECT id, name, url, group_name FROM links ORDER BY group_name, created_at DESC`; return NextResponse.json(links); }
export async function POST(request: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied; await initializeDb();
  const { name, url, group } = await request.json();
  if (![name, url].every((x) => typeof x === 'string' && x.trim())) return NextResponse.json({ error: 'Name and link are required' }, { status: 400 });
  try { new URL(url); } catch { return NextResponse.json({ error: 'Enter a valid link' }, { status: 400 }); }
  await sql`INSERT INTO links (name, url, group_name) VALUES (${name.trim()}, ${url.trim()}, ${typeof group === 'string' ? group.trim() : ''})`;
  return NextResponse.json({ ok: true }, { status: 201 });
}
export async function DELETE(request: NextRequest) { const denied = await requireAuth(); if (denied) return denied; await initializeDb(); const { id } = await request.json(); await sql`DELETE FROM links WHERE id = ${id}`; return NextResponse.json({ ok: true }); }
