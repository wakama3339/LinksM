import { neon } from '@neondatabase/serverless';

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is missing. Connect Neon in Vercel Marketplace.');
  return neon(connectionString)(strings, ...values);
}) as any;

let initialized: Promise<void> | undefined;
export function initializeDb() {
  if (!initialized) initialized = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS app_settings (id SMALLINT PRIMARY KEY, password_hash TEXT NOT NULL, theme TEXT NOT NULL DEFAULT 'white')`;
    await sql`CREATE TABLE IF NOT EXISTS links (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, url TEXT NOT NULL, group_name TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    const rows = await sql`SELECT id FROM app_settings WHERE id = 1`;
    if (!rows.length) await sql`INSERT INTO app_settings (id, password_hash, theme) VALUES (1, ${hashPassword('admin')}, 'white')`;
  })();
  return initialized;
}

export function hashPassword(value: string) {
  const crypto = require('crypto') as typeof import('crypto');
  return crypto.createHash('sha256').update(value).digest('hex');
}
