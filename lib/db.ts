import { neon } from '@neondatabase/serverless';

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  const connectionString = process.env.NEON_DATABASE_DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Neon database URL is missing. Connect Neon in Vercel Marketplace.');
  return neon(connectionString)(strings, ...values);
}) as any;

let initialized: Promise<void> | undefined;
export function initializeDb() {
  if (!initialized) initialized = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS app_settings (id SMALLINT PRIMARY KEY, password_hash TEXT NOT NULL, theme TEXT NOT NULL DEFAULT 'white', groups_collapsed BOOLEAN NOT NULL DEFAULT FALSE)`;
    await sql`ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS groups_collapsed BOOLEAN NOT NULL DEFAULT FALSE`;
    await sql`CREATE TABLE IF NOT EXISTS links (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, url TEXT NOT NULL, group_name TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS link_groups (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    const rows = await sql`SELECT id FROM app_settings WHERE id = 1`;
    if (!rows.length) await sql`INSERT INTO app_settings (id, password_hash, theme, groups_collapsed) VALUES (1, ${hashPassword('admin')}, 'white', FALSE)`;
    const existingLinks = await sql`SELECT id FROM links LIMIT 1`;
    if (!existingLinks.length) {
      const defaults: Array<[string, string, string]> = [
        ['впн', 'https://www.cloudflare.com/ru-ru/', 'Public'],
        ['открыть порты1', 'https://localtonet.com/', 'Public'],
        ['делать фоны2', 'https://graphic.so/#tools', 'Public'],
        ['разные фоны', 'https://haikei.app/', 'Public'],
        ['видео паков смешных', 'https://www.youtube.com/watch?v=LkLAlPnXED4&pp=ygUt0L_QsNC6INC_0YDQuNC60L7Qu9C-0LIg0LTQu9GPINGA0LDRgtC90LjQutCw', 'Public'],
        ['Дс1', 'https://discord.gg/XSBVdTPWG', 'Public'],
        ['скорость програм', 'https://github.com/sharkdp/hyperfine', 'Public'],
        ['скорость програм', 'https://github.com/sharkdp/hyperfine', 'Public'],
        ['HEX', 'https://github.com/sharkdp/hexyl', 'Public'],
        ['библиотеки Go', 'https://github.com/avelino/awesome-go', 'Public'],
        ['пдф работать', 'https://stirling.com/download', 'Public'],
        ['самолетик', 'https://www.youtube.com/shorts/yNxGbQlVKII', 'Public'],
        ['музыка2', 'https://vt.tiktok.com/ZS4BA28TT/', 'Public'],
        ['мод1', 'https://vt.tiktok.com/ZS4mTETEM/', 'Public'],
        ['winj', 'https://github.com/yogilad/WinLocker', 'Public'],
        ['Работа с PDF', 'https://github.com/Stirling-Tools/Stirling-PDF', 'Public'],
        ['Визуально делать сайты', 'https://github.com/webstudio-is/webstudio', 'Public'],
        ['Что-то сделать самому', 'https://github.com/codecrafters-io/build-your-own-x', 'Public'],
        ['Книжки по программированию', 'https://github.com/EbookFoundation/free-programming-books', 'Public'],
        ['Записывать экран', 'https://github.com/webadderallorg/recordly', 'Public'],
        ['Иконки Material Design', 'https://github.com/google/material-design-icons', 'Public'],
        ['Иконки Simple Icons', 'https://github.com/simple-icons/simple-icons', 'Public'],
        ['VSCodium', 'https://github.com/VSCodium/vscodium/releases', 'Public'],
        ['ytmdl', 'https://pypi.org/project/ytmdl/', 'Public'],
        ['Скачивать медиа', 'https://chromewebstore.google.com/detail/cat-catch/jfedfbgedapdagkghmgibemcoggfppbb?hl=ru&pli=1', 'Public'],
        ['FileExp', 'https://github.com/conaticus/fileexplorer', 'Public'],
        ['Отключить телеметрию Windows', 'https://github.com/raphire/win11debloat', 'Public'],
        ['Скриншоты', 'https://getsharex.com/', 'Public'],
        ['Интересное 1', 'https://www.tiktok.com/@mastertrapaholic/video/7662446898162175252?_r=1&_t=ZS-98U4YkkydRi', 'Public'],
        ['Переводчик', 'https://github.com/MoonMonet/Translator', 'Public'],
        ['Winl', 'https://github.com/ayuhik/WinLocker-Builder/releases', 'name'],
        ['FPSbar', 'https://github.com/flightlessmango/MangoHud', 'name'],
        ['API', 'https://github.com/public-apis/public-apis', 'name'],
        ['Быстрый поиск по файлам', 'https://github.com/sharkdp/fd', 'name'],
      ];
      for (const [name, url, group] of defaults) {
        await sql`INSERT INTO link_groups (name) VALUES (${group}) ON CONFLICT (name) DO NOTHING`;
        await sql`INSERT INTO links (name, url, group_name) VALUES (${name}, ${url}, ${group})`;
      }
    }
  })();
  return initialized;
}

export function hashPassword(value: string) {
  const crypto = require('crypto') as typeof import('crypto');
  return crypto.createHash('sha256').update(value).digest('hex');
}
