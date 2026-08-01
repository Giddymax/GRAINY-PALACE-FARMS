# Grainy Palace Farms

E-commerce + marketing website and operational backend for **Grainy Palace Farms Limited**, a Ghanaian integrated agribusiness (crops, livestock, aquaculture, food-safety lab, organic processing). Built as an installable, offline-tolerant PWA.

## Stack

- **Next.js** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** (CSS-first `@theme` tokens in `app/globals.css`)
- **Supabase** — Postgres, Auth, Row-Level Security, Storage
- shadcn/Radix components, `lucide-react` icons, `sonner` toasts
- **Server Actions** for all mutations, `react-hook-form` + `zod` for validation
- **Paystack** for payments (cards + Ghana Mobile Money), Cash-on-delivery and Bank Transfer as fallbacks
- `next-intl` for a language switcher (English, Twi, Ga, Ewe, Hausa — UI chrome strings)
- Web Push (`web-push`) for opt-in order/restock/new-article notifications
- Deploy target: **Vercel** + hosted **Supabase**

## Getting started (local development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll need a Supabase project and a handful of env vars before most pages work (they read from the database). See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full setup walkthrough — it covers creating the Supabase project, running the schema, copying keys into `.env.local`, and deploying to Vercel.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | ESLint |

## Project structure

```
app/                    Routes (App Router)
  admin/(dashboard)/     Staff/admin portal — catalogue, inventory, orders, articles, etc.
  api/paystack/webhook/  Payment webhook handler
  [public routes]         Shop, product, cart, checkout, livestock, fish, seedlings,
                          lab-services, wholesale, partners, articles (Knowledge Hub),
                          news, about, sustainability, careers, traceability, contact
components/             UI components (shadcn-based `ui/`, feature folders per domain)
lib/
  actions/               Server Actions (public + lib/actions/admin/ for staff-only)
  data/                  Read-only Supabase query helpers (server components)
  supabase/              Supabase client factories + generated `database.types.ts`
  validations/           zod schemas shared by client + server
  push/                  Web Push sending helpers
  payments/               Paystack integration
supabase/schema.sql     Full DB schema — tables, RLS policies, triggers, seed data
public/sw.js            Service worker (offline cache + push)
docs/                   Business brief and supporting docs
```

## Key features

- **Shop** — full product taxonomy (grains, legumes, vegetables, roots & tubers, poultry & eggs, meat & livestock, fish, seedlings, processed foods, farm inputs), filterable/searchable/sortable, GHS pricing.
- **Knowledge Hub** (`/articles`) — admin-authored CMS articles (nutrition, food safety, sustainability, livestock, aquaculture, farming tips, recipes, news), rich-text editor, categories, SEO fields.
- **Ghana commerce** — Paystack (cards + MTN MoMo/Telecel Cash/AirtelTigo), Cash-on-delivery, Bank Transfer, and a WhatsApp order handoff (`wa.me/...`) on every product and after checkout.
- **B2B** — `/wholesale` bulk-quote requests and a `/partners` portal (Supabase-auth-gated) with tiered pricing, order history and CoA downloads for approved partners.
- **Lab services** — sample submission + a public results tracker (lookup by reference).
- **Traceability** — `/traceability?code=...` resolves a batch to origin, certifications and CoA.
- **Admin portal** (`/admin`) — dashboard, POS, catalogue, inventory, orders, articles, news/events, certifications, an enquiries hub (quotes/lab/subscriptions/outgrower/jobs), partners, content CMS, staff roles.
- **PWA** — installable, offline-tolerant (`public/sw.js` + `/offline`), opt-in Web Push for order updates / restocks / new articles.
- **i18n** — client-side language switcher (English/Twi/Ga/Ewe/Hausa) for header/footer/common UI chrome.

## Environment variables

See `.env.example` for the full list (Supabase keys, site URL, Paystack keys, WhatsApp number, VAPID push keys, analytics flag). Never commit a populated `.env.local`.

## Database

`supabase/schema.sql` is idempotent — safe to re-run against the same project. It creates every table, enables RLS with policies matching each table's public/staff/anonymous-insert access model, wires `updated_at` triggers, and seeds realistic starter data (products, articles, certifications, hero slides, events). Re-running it after a schema change just updates policies/functions and leaves existing rows alone.

## Deployment

Full beginner walkthrough (Supabase project → schema → env vars → Vercel) is in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.
