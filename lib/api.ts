import { NextResponse } from 'next/server';
import { isLoggedIn } from './session';

export async function requireAuth() {
  if (!(await isLoggedIn())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}
