# EtsyToolshed

Free tools for Etsy sellers: a profit calculator, an AI disclosure
compliance checker, and an Etsy-to-Shopify listing converter. Built with
Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, and Lemon
Squeezy.

## Features

- **Etsy Profit Calculator** — enter sale price, costs, labor, packaging,
  and country; get Etsy fees, net profit, margin, break-even price, and the
  minimum price for a 30% margin.
- **Etsy AI Disclosure Checker** — paste title and description, toggle AI
  use and attribution; get a risk score, compliance issues, and
  suggestions (rules-based, no AI).
- **Etsy → Shopify Listing Converter** — turn Etsy title, tags, and
  description into Shopify-optimized title, meta title, meta description,
  alt text, Pinterest pin, and TikTok caption.
- **Accounts & rate limits** — anonymous 3 uses/day per tool; free
  accounts 10/day; Starter 100/day; Pro unlimited.
- **Subscriptions** — Lemon Squeezy checkout with webhook sync to the
  `users.plan` field.

## Tech stack

- Next.js 14 (App Router) + React 18
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres, RLS)
- zod (input validation)
- Lemon Squeezy (payments)

## Prerequisites

- Node.js 18+

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file and fill in values:

   ```bash
   cp .env.example .env.local
   ```

   Without Supabase configured the app still runs locally and falls back to
   an in-memory rate limiter. See [Environment variables](#environment-variables).

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Environment variables

All values are read from `process.env` at runtime. Never commit real keys.
Copy `.env.example` to `.env.local` for local development.

**Supabase** (from Dashboard → Project Settings → API)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server only, never exposed to the client

**Lemon Squeezy** (from Dashboard)

- `LEMON_SQUEEZY_API_KEY`
- `LEMON_SQUEEZY_WEBHOOK_SECRET`
- `LEMON_SQUEEZY_STORE_ID`
- `LEMON_SQUEEZY_STARTER_VARIANT_ID`
- `LEMON_SQUEEZY_PRO_VARIANT_ID`

**Site**

- `NEXT_PUBLIC_SITE_URL` — e.g. `https://etsytoolshed.com`

## Project structure

```
app/
  api/
    compliance/route.ts   # AI disclosure check (rules-based)
    convert/route.ts      # Etsy → Shopify copy conversion
    ls/
      checkout/route.ts   # create Lemon Squeezy checkout (auth required)
      webhook/route.ts    # verify signature + sync subscription
    profit/route.ts       # profit calculation
  blog/                   # SEO blog (3 posts + index)
  etsy-ai-disclosure-checker/page.tsx
  etsy-profit-calculator/page.tsx
  etsy-to-shopify-listing-converter/page.tsx
  login/page.tsx
  pricing/page.tsx
  robots.ts
  sitemap.ts
components/               # ProfitForm, ComplianceForm, ConverterForm,
                          # AuthForm, PricingPlans, Faq, JsonLd
lib/
  etsyFees.ts             # fee tables + profit formula (defaults)
  feeCache.ts             # reads active fee_rates with 1h cache
  feesSync.ts             # fetch/hash/parse Etsy fees page + alert
  complianceRules.ts      # compliance rule engine
  converterRules.ts       # listing conversion rules
  rateLimit.ts            # Supabase usage_logs + in-memory fallback
  lemonsqueezy.ts         # signature verify + checkout (server only)
  plans.ts                # plan config (client-safe)
  supabase/               # client, server, admin clients
supabase/schema.sql       # users, usage_logs, subscriptions, fee_rates,
                          # fee_sync_log + RLS — run in Supabase SQL Editor
```

## Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project**, import the GitHub repo.
3. Set the environment variables listed above in **Settings → Environment
   Variables** (Production and Preview).
4. Click **Deploy**.
5. After the first deploy, set `NEXT_PUBLIC_SITE_URL` to your production
   domain.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`. This creates:
   - `users` (with a trigger that auto-creates a row on sign-up, default
     plan `free`)
   - `usage_logs` (rate limiting)
   - `subscriptions` (Lemon Squeezy)
   - Row Level Security policies on all three tables.
3. In **Authentication → Providers → Email**, enable Email. For testing
   you can turn off **Confirm email**.
4. Copy the URL, anon key, and service role key into `.env.local` / Vercel
   env vars.

## Lemon Squeezy setup

1. Create a store and copy the **Store ID**.
2. Create two products with monthly variants: **Starter ($9/mo)** and
   **Pro ($19/mo)**. Copy each **variant ID**.
3. In **Settings → API**, generate an **API key**.
4. In **Settings → Webhooks**, add
   `https://your-domain.com/api/ls/webhook` and subscribe to the
   `subscription_created`, `subscription_updated`,
   `subscription_cancelled`, and `subscription_expired` events. Copy the
   webhook **signing secret**.
5. Add all six values to your environment variables.

## Fee rate auto-sync (semi-automatic)

Etsy fee rates are stored in the Supabase `fee_rates` table instead of
hard-coded. A Vercel Cron job checks the Etsy fees page daily.

**How it works**

1. Every day at 08:00 UTC, Vercel Cron calls `GET /api/fees/sync` with the
   `CRON_SECRET` bearer token.
2. The route fetches `https://www.etsy.com/legal/fees`, hashes the page, and
   compares the hash with the last sync log.
3. If the page is unchanged, it logs `unchanged` and exits.
4. If the page changed, it parses the global rates (transaction fee, listing
   fee, offsite ads rates), runs a sanity check, and inserts five `draft`
   rows into `fee_rates` (one per country). It then alerts the admin via the
   `FEES_ALERT_WEBHOOK_URL`.
5. If parsing fails the sanity check, it does **not** write any rates. It logs
   `parse_failed` and alerts the admin. The live `active` rates keep serving.
6. The admin reviews the `draft` rows in Supabase and changes their `status`
   to `active` (the partial unique index guarantees only one active row per
   country).

**Reading rates at runtime**

- `app/api/profit/route.ts` calls `getFeeConfig(country)` which reads the
  `active` rows from `fee_rates`, caches them in memory for 1 hour, and falls
  back to the hard-coded defaults in `lib/etsyFees.ts` if Supabase is
  unavailable or no active row exists.

**Setup**

1. Run the updated `supabase/schema.sql` (adds `fee_rates` and
   `fee_sync_log`).
2. Set `CRON_SECRET` (any long random string) in Vercel environment
   variables.
3. Optionally set `FEES_ALERT_WEBHOOK_URL` (a Discord/Slack/etc. webhook that
   accepts `{ text }`).
4. Deploy. Vercel picks up `vercel.json` and schedules the cron.

**Notes**

- The page is JS-rendered; if the initial HTML does not contain the fee text,
  parsing will fail and alert (safe default — never silently wrong).
- Only global rates (transaction, listing, offsite ads) are parsed.
  Per-country payment processing fees use the defaults; edit the `draft` row
  in Supabase if Etsy changes those.

## Compliance rules (semi-automatic)

The compliance checker's adjustable data (brand word blocklist, AI
disclosure keywords, title/description length thresholds) lives in the
Supabase `compliance_rules` table instead of hard-coded constants. The
judgment logic (e.g. "Made by" vs "Designed by") stays in
`lib/complianceRules.ts`, and every rule carries a `@source` comment
pointing to the official Etsy policy page.

**Policy sources (monitored for changes)**

- AI disclosure + attribution + original design:
  `https://www.etsy.com/legal/creativity/`
- Prohibited items / trademark infringement:
  `https://www.etsy.com/legal/prohibited/`

**How it works**

1. A Vercel Cron calls `GET /api/policy/sync` daily (09:00 UTC).
2. The route fetches both policy pages, hashes them, and compares each hash
   with the latest row in `policy_sync_log`.
3. If a page changed, it logs `changed` and alerts the admin via
   `FEES_ALERT_WEBHOOK_URL` (same webhook as fee sync). It does **not**
   modify any rules automatically — policy is legal prose and cannot be
   reliably parsed into `if/else`.
4. The admin reviews the updated policy page and edits the
   `compliance_rules` table in Supabase if needed (add/remove brand words,
   adjust thresholds). No redeploy required.

**Reading rules at runtime**

- `app/api/compliance/route.ts` calls `getComplianceRules()`, which reads
  `active` rows from `compliance_rules`, caches them in memory for 1 hour,
  and falls back to the hard-coded defaults in `lib/complianceRules.ts` if
  Supabase is unavailable.

**Setup**

1. Run the updated `supabase/schema.sql` (adds `compliance_rules` and
   `policy_sync_log`, with seed data).
2. Ensure `CRON_SECRET` and `FEES_ALERT_WEBHOOK_URL` are set.
3. Deploy. Vercel schedules the cron from `vercel.json`.

**Notes**

- Brand word blocklist has no official Etsy source — it must be maintained
  manually based on your target niche and Etsy's Prohibited Items policy.
- The `compliance_rules` table is seeded with the same defaults that were
  previously hard-coded, so behavior is unchanged until you edit it.

## Google Search Console

1. Add and verify your domain in Google Search Console.
2. Submit `https://your-domain.com/sitemap.xml`.
3. The `robots.txt` (served at `/robots.txt`) points crawlers to the
   sitemap and allows all pages except `/api/*`.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npx tsc --noEmit` — type-check

## Notes

- This is not legal advice. The compliance checker is based on Etsy's
  public Seller Handbook.
- Fee rates are mock structures for development; verify against Etsy's
  current fee schedule before relying on them.
