# Foldrise — Coming Soon

One-section waitlist landing page for Foldrise, built with Next.js, TypeScript, and Tailwind CSS. Collects launch signups into Supabase.

The page is a direct implementation of the `Launch Web` frame in the **Foldrise AI** Figma file. Design tokens (both the `Base colors` and `Tokens` variable collections) and the file's text styles are mirrored as CSS custom properties in [`src/app/globals.css`](src/app/globals.css), so colour and type changes in Figma map onto named variables here.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com) (or use an existing one).

3. In the Supabase dashboard, open **SQL Editor** and run:
   - [`supabase/schema.sql`](supabase/schema.sql) — creates the `waitlist` table
   - [`supabase/cms-schema.sql`](supabase/cms-schema.sql) — creates the `ticker_images` / `site_content` tables and the public `ticker-images` storage bucket used by `/admin` (see below)

4. Copy the environment variable template and fill in your project's values (found in **Project Settings → API**):

   ```bash
   cp .env.local.example .env.local
   ```

   - `SUPABASE_URL` — your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — the **service role** key (kept server-side only, used by the `/api/subscribe` route to insert signups; never exposed to the browser)

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## How signups work

- The form on the page posts to `POST /api/subscribe` ([`src/app/api/subscribe/route.ts`](src/app/api/subscribe/route.ts)).
- The route validates the email server-side, then inserts it into the `waitlist` table using the Supabase service role key.
- Duplicate emails are treated as a successful signup (no error shown to the user).
- View collected signups anytime in the Supabase dashboard under **Table Editor → waitlist**.

## Admin (local only)

[http://localhost:3000/admin](http://localhost:3000/admin) — `npm run dev` only. There's no password: the whole `/admin` surface (the page and every `/api/admin/*` route) checks `NODE_ENV` and returns a 404 in any production build, so it's harmless even if this code ships to Vercel. Confirmed by running `next build && next start` and hitting both routes.

- **Images** — upload, delete, and drag-to-reorder the photos in the ticker. Uploads go to a public Supabase Storage bucket (`ticker-images`); order and file references live in the `ticker_images` table.
- **Content** — edit the headline, body copy, button label, and footer note (the `site_content` table, a single row).

The public page (`src/app/page.tsx`) fetches both on every request (`export const dynamic = "force-dynamic"`) — changes made in `/admin` appear on reload with no redeploy needed. If Supabase is unreachable or the tables are empty, it falls back to the original hardcoded copy and photo set (`DEFAULT_SITE_CONTENT` / `DEFAULT_TICKER_IMAGES` in [`src/lib/cms.ts`](src/lib/cms.ts)), so a Supabase outage degrades the page instead of breaking it.

## Project structure

- `src/app/page.tsx` — the waitlist page (fetches content/images from Supabase via `src/lib/cms.ts`)
- `src/app/globals.css` — design tokens and text styles ported from Figma
- `src/components/SiteHeader.tsx` — logo lockup and social links
- `src/components/WaitlistForm.tsx` — signup form with validation, loading, error, and success states
- `src/components/SimpleTicker.tsx` — the auto-scrolling strip of model photos
- `src/app/api/subscribe/route.ts` — server route that writes to Supabase
- `src/app/admin/` — the local-only CMS page
- `src/app/api/admin/` — CMS API routes (images upload/delete/reorder, content read/update) — dev-only, 404 in production
- `src/lib/cms.ts` — data layer for `ticker_images` / `site_content`, with hardcoded fallbacks
- `src/lib/dev-only.ts` — the `NODE_ENV` gate shared by every admin page/route
- `src/lib/supabase-admin.ts` — server-only Supabase client
- `supabase/schema.sql` — `waitlist` table
- `supabase/cms-schema.sql` — `ticker_images` / `site_content` tables + storage bucket
- `public/images/` — fallback model photos exported from Figma (WebP)
- `public/icons/` — logo mark and social icons exported from Figma (SVG)
