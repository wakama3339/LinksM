import { NextRequest, NextResponse } from 'next/server';
import { initializeDb, sql, hashPassword } from '@/lib/db';
import { clearSession, createSession, isLoggedIn } from '@/lib/session';

export async function GET() { await initializeDb(); const setting = await sql`SELECT theme, groups_collapsed FROM app_settings WHERE id = 1`; return NextResponse.json({ authenticated: await isLoggedIn(), theme: setting[0].theme, groupsCollapsed: setting[0].groups_collapsed }); }
export async function POST(request: NextRequest) {
  await initializeDb(); const { password } = await request.json();
  if (typeof password !== 'string') return NextResponse.json({ error: 'Password required' }, { status: 400 });
  const rows = await sql`SELECT password_hash FROM app_settings WHERE id = 1`;
  if (hashPassword(password) !== rows[0].password_hash) return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  await createSession(); return NextResponse.json({ ok: true });
}
export async function DELETE() { await clearSession(); return NextResponse.json({ ok: true }); }
