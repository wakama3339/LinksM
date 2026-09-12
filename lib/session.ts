import crypto from 'crypto';
import { cookies } from 'next/headers';

const name = 'links_session';
function signature() { return crypto.createHmac('sha256', process.env.SESSION_SECRET || 'development-secret').update('links-manager').digest('hex'); }
export async function isLoggedIn() { return (await cookies()).get(name)?.value === signature(); }
export async function createSession() { (await cookies()).set(name, signature(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 30 }); }
export async function clearSession() { (await cookies()).delete(name); }
