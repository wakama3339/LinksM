import { NextRequest, NextResponse } from 'next/server';
import { initializeDb, sql } from '@/lib/db';
import { requireAuth } from '@/lib/api';

export async function POST(request: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied; await initializeDb();
  const { name } = await request.json();
  if (typeof name !== 'string' || !name.trim()) return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
  try { await sql`INSERT INTO link_groups (name) VALUES (${name.trim()})`; } catch { return NextResponse.json({ error: 'This group already exists' }, { status: 409 }); }
  return NextResponse.json({ ok: true }, { status: 201 });
}
