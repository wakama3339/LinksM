# Links

Private links manager for Vercel, backed by Neon PostgreSQL.

## Deploy

1. Import this repository into Vercel.
2. In **Storage** → **Browse Marketplace**, add **Neon** and connect it to this project. Vercel creates `DATABASE_URL` automatically.
3. Add `SESSION_SECRET` in Project Settings → Environment Variables. Use a long random value.
4. Deploy. The first request creates the tables automatically.

Initial password: `admin`. Change it immediately in **Settings**.

For local development, create `.env.local` from `.env.example`, then use the `DATABASE_URL` from the linked Neon project and run `npm install` and `npm run dev`.
