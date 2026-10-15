# AI ADDA Agency portfolio — deployment setup

## What's changed
- Vite image references are now bundled/imported so they survive production builds.
- The existing inquiry form sends real submissions to `POST /api/leads`.
- Lead fields: name, email, optional phone, Instagram, GitHub, website type, and optional message.
- Leads are stored in Supabase table `public.agency_leads`. Browser roles have no table access; only the server-side service role can insert.

## Vercel environment variables
In the Vercel project for this portfolio, open **Settings → Environment Variables** and add:
- `SUPABASE_URL` = `https://ftrumwojxmizpljykceq.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase project's **service_role / secret key**, copied from Supabase API keys.

Apply them to Production and Preview as appropriate, then redeploy. Never put the service key in React code, a `VITE_*` variable, or GitHub.

## Database
The migration is in `supabase/agency-leads.sql`. It has already been applied to the connected Supabase project. If deploying to a different Supabase project, run the SQL in that project's SQL Editor.

## Image check
This project keeps photos in `src/assets/images`. Vite imports from `src/data/portfolioData.ts` and `src/components/CinematicPaperIntro.tsx`; CSS uses relative `./assets/images/...` URLs from `src/index.css`.

## Test before going live
1. Ensure Vercel is connected to this repository and deploy the repair branch as a Preview.
2. Confirm hero, about photo, project cards, intro, and background textures appear on desktop and mobile.
3. Submit a test inquiry and confirm a row appears in Supabase `public.agency_leads`.
4. Check a missing environment variable gives an error rather than a false success.
5. Once Preview is good, merge the pull request to `main` to publish to Production.
