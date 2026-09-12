import { NextRequest, NextResponse } from 'next/server';
import { initializeDb, sql, hashPassword } from '@/lib/db';
import { requireAuth } from '@/lib/api';

export async function PATCH(request: NextRequest) {
  const denied = await requireAuth(); if (denied) return denied; await initializeDb(); const { password, confirmPassword, theme } = await request.json();
  if (theme && !['white', 'black'].includes(theme)) return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
  if (password !== undefined) { if (typeof password !== 'string' || password.length < 4 || password !== confirmPassword) return NextResponse.json({ error: 'Passwords must match and be at least 4 characters' }, { status: 400 }); await sql`UPDATE app_settings SET password_hash = ${hashPassword(password)} WHERE id = 1`; }
  if (theme) await sql`UPDATE app_settings SET theme = ${theme} WHERE id = 1`;
  return NextResponse.json({ ok: true });
}
