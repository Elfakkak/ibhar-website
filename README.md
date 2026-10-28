# IBHAR — premium packaging & stationery website

Standalone Next.js application deployed on Vercel (project `ibhar-website`, repository root `./`), with a restricted server-only PostgreSQL quote adapter. It was split out of the IBHAR Manager repository (`sites/ibhar-packaging`) and has its own dependencies, Git history and Vercel project; it shares no code or credentials with IBHAR Manager. It shares the existing IBHAR ADS Supabase project through an isolated website schema and insert-only login.

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

This repository root is the Vercel root directory. Do not reuse the IBHAR Manager Vercel project or administrator keys. The shared database uses the isolated access design below.

## Content status

The product names and photos are illustrative collection proposals, not verified inventory. All generated photographs are labelled as inspiration. No prices, minimum quantities, lead times, customer logos, reviews or certifications have been invented. Confirm the real products, supplier capabilities, product photos and commercial terms before launching.

## Connections

Verified on 28 October 2026:

- GitHub: `Elfakkak/ibhar-website`.
- Vercel: `simos-projects-381039e7/ibhar-website`, project `prj_VC5BPDrKj0gSlJRrgz2uFHQ0i1pz`. The local CLI works; the connector still does not expose this project.
- Supabase: existing IBHAR ADS project `quuaxpnaugcmburokhko`, region `eu-west-1`. No additional paid project was created.
- Private schema `ibhar_website`, table `quote_requests`, and restricted login `ibhar_website_writer` have been created. The login has INSERT only, no manager role memberships, no RLS bypass, and short query timeouts. The schema is not exposed through the Data API.
- `WEBSITE_DATABASE_URL` is a production Secret on the website Vercel project only. Neither manager administrator credentials nor website database credentials are exposed to the browser. Preview deployments have no production database credential.
- The website uses parameterized PostgreSQL inserts through the verified transaction pooler with certificate and hostname verification, the bundled public Supabase CA certificate, and one pooled connection per process.

The SQL migration was applied explicitly through the Management API, with login credential provisioning performed separately. It was not applied through `db push`; do not replay it or push this standalone repository's migration history over the manager database. The migration intentionally defines a NOLOGIN role so credentials are never stored in source.

Validation: the actual restricted login successfully connected over verified TLS and inserted a synthetic quote inside a rolled-back transaction. Quote reads/deletes and manager reads were denied. Effective SELECT/INSERT/UPDATE/DELETE/TRUNCATE privileges on all 46 manager tables/views were absent. The manager policy fingerprint was unchanged before and after, and no test quotes remain. Shared storage, compute and connection capacity remain a common dependency.

### Remaining before accepting online quotes

1. Configure Cloudflare Turnstile for the final hostname using `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` on the website project.
2. Confirm real business contact details and update the privacy notice from download-only mode.
3. Verify the complete form flow (anti-bot success/failure, real save, duplicate request and database failure) before enabling `QUOTE_SUBMISSIONS_ENABLED=true`. It remains false.
4. Confirm products and commercial terms. The catalogue remains in `src/lib/catalogue.ts`; no extra catalogue table was created.
5. Configure `NEXT_PUBLIC_SITE_URL` and confirm indexability before enabling `SITE_INDEXABLE=true`.

## Checks

`npm run typecheck`, `npm test`, `npm run build`. Browser verification should cover desktop/mobile, collections, product preselection, all brief steps, download and unknown URLs. The Supabase write path cannot be verified without the correct project and keys.

### Verification in this session

The production build and TypeScript checks passed. Four schema tests passed, and the compiled quote handler returned the expected responses for disabled submissions (503), cross-origin requests (403), invalid quantities (400) and oversized payloads (413). The parent manager TypeScript check passed after excluding the separate website directory.

The environment refused local HTTP server binding (`EPERM`), and the browser tool disallowed `file:` URLs. Browser and mobile visual checks could therefore not be completed. `review/index.html` is a file-based visual review generated from the production HTML with `npm run review`; it includes the static collection/product pages, working native disclosure controls, and an explicitly labelled placeholder for the interactive Next.js form. Open it manually in a browser to review. It is not a deployed website.

No checkout, payments, customer accounts, analytics, email sending or connection to IBHAR Manager is included in this first version.
