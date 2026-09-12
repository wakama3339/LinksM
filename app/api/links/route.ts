import { NextRequest, NextResponse } from 'next/server';
import { initializeDb, sql } from '@/lib/db';
import { requireAuth } from '@/lib/api';

export async function GET() { const denied = await requireAuth(); if (denied) return denied; await initializeDb(); const links = await sql`SELECT id, name, url, group_name FROM links ORDER BY group_name, created_at DESC`; const groups = await sql`SELECT name FROM link_groups ORDER BY name`; const setting = await sql`SELECT groups_collapsed FROM app_settings WHERE id = 1`; return NextResponse.json({ links, groups, groupsCollapsed: setting[0].groups_collapsed }); }
export async function POST(request: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied; await initializeDb();
  const { name, url, group } = await request.json();
  if (![name, url].every((x) => typeof x === 'string' && x.trim())) return NextResponse.json({ error: 'Name and link are required' }, { status: 400 });
  const normalizedUrl = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
  try { new URL(normalizedUrl); } catch { return NextResponse.json({ error: 'Enter a valid link' }, { status: 400 }); }
  const groupName = typeof group === 'string' ? group.trim() : '';
  if (groupName) await sql`INSERT INTO link_groups (name) VALUES (${groupName}) ON CONFLICT (name) DO NOTHING`;
  await sql`INSERT INTO links (name, url, group_name) VALUES (${name.trim()}, ${normalizedUrl}, ${groupName})`;
  return NextResponse.json({ ok: true }, { status: 201 });
}
export async function DELETE(request: NextRequest) { const denied = await requireAuth(); if (denied) return denied; await initializeDb(); const { id } = await request.json(); await sql`DELETE FROM links WHERE id = ${id}`; return NextResponse.json({ ok: true }); }
