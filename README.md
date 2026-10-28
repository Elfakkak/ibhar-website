# IBHAR — premium packaging & stationery website

Standalone Next.js application deployed on Vercel (project `ibhar-website`, repository root `./`), with a prepared server-only Supabase quote adapter. It was split out of the IBHAR Manager repository (`sites/ibhar-packaging`) and has its own dependencies, Git history and Vercel project; it shares no code, database or credentials with IBHAR Manager.

## First version

- French homepage, four collection pages and eight product proposal pages.
- Collections: boutiques & créateurs, beauté & parfumerie, cadeaux d’entreprise, papeterie de marque.
- Original IBHAR vector logo; indigo `#291e6e`, ivory and orange `#ff6000`.
- Cormorant Garamond headlines (Google Fonts stylesheet), self-hosted Figtree text.
- Three-step project brief, product preselection, validation and downloadable text brief.
- Online submission remains disabled until the dedicated backend and anti-bot verification are configured. No simulated success or silent data collection.
- Unique page metadata, canonical paths, sitemap and robots controls. The preview is non-indexable by default.

## Run

Use Node 24. Install the pinned dependencies with `npm ci`, then `npm run build` and `npm start` (port 3018). For ongoing local work, use `npm run dev`.

This repository root is the Vercel root directory. Do not reuse the IBHAR Manager Vercel project or any other business's database or keys.

## Content status

The product names and photos are illustrative collection proposals, not verified inventory. All generated photographs are labelled as inspiration. No prices, minimum quantities, lead times, customer logos, reviews or certifications have been invented. Confirm the real products, supplier capabilities, product photos and commercial terms before launching.

## Connections still required

The connected Supabase account exposed only an inactive Vyonix project, not the IBHAR database. No remote schema or existing company data was changed.

1. Select a dedicated Supabase project; review its existing schema. `database/schema.sql` is a proposal and has NOT been applied. Generate a proper migration with the Supabase CLI when the database is available.
2. Configure server-only `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in the new Vercel project. Never prefix the secret with `NEXT_PUBLIC_`.
3. Configure Cloudflare Turnstile for the final host using `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. The route verifies hostname and token before writing. Keep quote rows inaccessible to public roles.
4. Update the privacy notice and real business contact details before enabling online submissions. Set `QUOTE_SUBMISSIONS_ENABLED=true` only after testing real insert, error, duplicate and anti-bot paths in a test environment. The current privacy page describes download-only mode.
5. The catalogue currently lives in `src/lib/catalogue.ts`. The proposed Supabase product table is not yet connected. Add a server-side published-product query and Storage assets once the catalogue is confirmed.
6. Configure `NEXT_PUBLIC_SITE_URL`, confirm product copy, domain and indexability, then enable `SITE_INDEXABLE=true` for production only.

## Checks

`npm run typecheck`, `npm test`, `npm run build`. Browser verification should cover desktop/mobile, collections, product preselection, all brief steps, download and unknown URLs. The Supabase write path cannot be verified without the correct project and keys.

### Verification in this session

The production build and TypeScript checks passed. Four schema tests passed, and the compiled quote handler returned the expected responses for disabled submissions (503), cross-origin requests (403), invalid quantities (400) and oversized payloads (413). The parent manager TypeScript check passed after excluding the separate website directory.

The environment refused local HTTP server binding (`EPERM`), and the browser tool disallowed `file:` URLs. Browser and mobile visual checks could therefore not be completed. `review/index.html` is a file-based visual review generated from the production HTML with `npm run review`; it includes the static collection/product pages, working native disclosure controls, and an explicitly labelled placeholder for the interactive Next.js form. Open it manually in a browser to review. It is not a deployed website.

No checkout, payments, customer accounts, analytics, email sending or connection to IBHAR Manager is included in this first version.
