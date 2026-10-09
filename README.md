# Marketplace Profit Clarity

A secure product-level profit dashboard that helps independent online sellers see what each product earns after fees, shipping, labor, advertising, and other per-unit costs.

## What it does

Marketplace Profit Clarity is for independent sellers using Etsy, Shopify, eBay, Amazon, and other marketplaces. Add a product, enter the sale revenue and real costs, then review net profit, margin, markup, break-even price, and target prices. Fee presets are editable examples and are not official marketplace rates.

### Main flow

1. Create an account with email and password.
2. Add a product, choose a marketplace preset and currency, and enter revenue and per-unit costs.
3. Review the live calculation preview, adjust assumptions, and save.
4. Compare products by margin or (when all compared products share a currency) profit; export your own records as CSV.

## Features

- Supabase email/password authentication with server-managed sessions.
- Owner-scoped product create, read, update, delete, and CSV export.
- PostgreSQL Row Level Security (RLS) on both application tables.
- Editable sample fee presets for Etsy, Shopify, eBay, Amazon, and Custom / Other.
- Live profit, margin, markup, break-even, and target-price calculations.
- Optional labor calculation from minutes and hourly rate.
- Optional tax inclusion; tax is excluded unless enabled.
- Search, sorting, responsive product table, product details, and private profile page.

## Supported currencies and limitations

USD, EUR, GBP, CAD, and AUD are supported. Each product uses one currency for all money inputs and results. Currency conversion and exchange rates are not implemented. Do not aggregate or directly compare money across products with different currencies. Profit sorting is disabled for mixed-currency lists; margin percentages remain comparable.

## Technology

- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- Supabase Auth, Postgres, and RLS using the official SSR client
- Zod server-side form validation
- Vercel-ready Next.js deployment

## Project structure

```text
src/app/                 App Router pages, route handlers, and server actions
src/components/          Forms, tables, navigation, and status UI
src/lib/                 Supabase clients, data types, calculations, and validation
supabase/migrations/     Database schema, triggers, and RLS policies
```

## Prerequisites

- Node.js 20 or later and npm
- A Supabase project
- A Vercel account for hosting (optional during local development)

## Local setup

1. Clone this repository and install dependencies:

   ```bash
git clone https://github.com/multilingual-alignment/marketplace-profit-clarity.git
cd marketplace-profit-clarity
npm install
```

2. Copy .env.example to .env.local and set the Supabase project URL and anon/publishable key. Set NEXT_PUBLIC_SITE_URL to http://localhost:3000 for email confirmation callbacks.
3. Apply supabase/migrations/202610090001_initial_schema.sql in the Supabase SQL Editor, or use the Supabase CLI (supabase db push) after linking the project.
4. In Supabase Authentication URL Configuration, allow http://localhost:3000/auth/callback and the production callback URL. Set the site URL to the matching origin.
5. Start the app:

   ```bash
npm run dev
```

Open http://localhost:3000. Create an account, confirm the email if confirmation is enabled, and add a product. There is no shared demo account or public sample data.

## Environment variables

| Variable | Required for V1 | Use |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Public anon/publishable key; records remain protected by Auth and RLS |
| NEXT_PUBLIC_SITE_URL | Recommended | Absolute site origin used for auth confirmation callbacks |
| SUPABASE_SERVICE_ROLE_KEY | No | Blank server-only placeholder; V1 deliberately does not use it. Never expose it to browser code or commit its value. |

This app uses user-scoped sessions and RLS for every product operation, so a service-role key is not needed to run V1. If a future server-only admin task needs one, store it in local/Vercel secrets and read it only in server code.

## Database and security

The migration creates profiles and products, constrains platform and currency values, adds owner/date indexes, maintains updated_at, and creates a profile for each new Auth user. RLS is enabled on both tables. Product SELECT, INSERT, UPDATE, and DELETE policies require auth.uid() = user_id. Server queries and mutations also scope records to the authenticated user. Inputs are checked with Zod on the server. The CSV route requires a session and filters to that user's products; cells are quoted and formula-leading user text is escaped.

Use the anon key only in public Supabase clients. Never put a service-role key in a NEXT_PUBLIC_ variable. Do not disable RLS.

## Calculation methodology

Calculations use unrounded inputs; currency results display two decimal places.

- Total revenue = selling price + shipping charged to customer.
- Platform fee = selling price × platform fee percentage + platform fixed fee.
- Payment fee = selling price × processing fee percentage + processing fixed fee.
- Returns allowance = total revenue × allowance percentage + allowance fixed amount.
- Labor uses (minutes / 60) × hourly rate when both are greater than zero; otherwise it uses direct labor cost. The methods are never added together.
- Tax = total revenue × tax rate, and is included in costs only when Include tax in profit calculation is enabled.
- Total costs = product + packaging + labor + seller-paid shipping + platform fee + processing fee + listing fee + advertising + returns allowance + enabled tax.
- Net profit = total revenue − total costs.
- Margin = net profit / total revenue × 100; N/A when revenue is zero.
- Markup = net profit / total costs × 100; N/A when costs are zero.
- Break-even selling price = total costs − customer-paid shipping.
- Target price for desired profit = total costs − customer-paid shipping + desired profit.
- Target price for desired margin = total costs / (1 − desired margin as a decimal); N/A at margins of 100% or more.

Break-even status uses a half-cent tolerance. Fee presets are illustrative starting points; confirm current platform and payment processor fees before making decisions. Results are per-unit estimates, not accounting or tax advice.

## Vercel deployment

1. Import this GitHub repository into Vercel.
2. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_SITE_URL to the Vercel project's environment variables. V1 does not need a service-role secret.
3. Add the production callback URL (https://your-domain.example/auth/callback) to Supabase Auth's allowed redirect URLs and set the Supabase site URL to the production origin.
4. Deploy with the default Next.js build settings.

## Troubleshooting

- Supabase environment error: verify the URL and anon key in .env.local / Vercel, then restart or redeploy.
- Products fail to save or load: apply the migration, confirm Auth is enabled, and verify the RLS policies. Never work around this by disabling RLS.
- Email links use the wrong host: set NEXT_PUBLIC_SITE_URL and allow the exact callback URL in Supabase Auth.
- No confirmation email: inspect the Supabase Auth email provider and spam folder; only disable confirmation in a non-production project.
- Preset amounts do not fit a product: presets are editable estimates in the selected currency; replace them with current fee assumptions.

## Known V1 limitations

No marketplace API integrations or order imports; no currency conversion or live exchange rates; no inventory, invoicing, teams, admin console, AI, billing, checkout, or complex analytics. Inputs are stored and calculations derived when needed. No demo user or shared sample products are seeded.

## Roadmap ideas

Possible future work includes saved fee profiles, marketplace report imports, multi-unit scenarios, and opt-in order integrations. None are included in V1.

## License and ownership

No open-source license is included. This repository is intended as a privately owned commercial codebase. Add a license only if the owner chooses to publish one.
