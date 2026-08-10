# Foldrise — Coming Soon

One-section coming-soon landing page for Foldrise, built with Next.js, TypeScript, and Tailwind CSS. Collects launch signups into Supabase.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com) (or use an existing one).

3. In the Supabase dashboard, open **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql) to create the `waitlist` table.

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

## Project structure

- `src/app/page.tsx` — the coming-soon page
- `src/components/EmailSignupForm.tsx` — signup form with validation, loading, error, and success states
- `src/components/PortraitCarousel.tsx` — the 3D portrait carousel (placeholder gradient cards — swap in real images later)
- `src/app/api/subscribe/route.ts` — server route that writes to Supabase
- `src/lib/supabase-admin.ts` — server-only Supabase client
- `supabase/schema.sql` — table definition to run in Supabase
