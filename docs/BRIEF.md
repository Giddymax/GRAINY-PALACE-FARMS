# BUILD PROMPT — GRAINY PALACE FARM WEBSITE

> Paste this into Claude Code (or your dev agent). It assumes the `business-website-builder` skill and my standard stack. Build the full site + operational backend, production-ready, no placeholders.

---

## 0. Project brief

Build a complete, installable e-commerce + marketing website for **Grainy Palace Farm Limited**, a Ghanaian integrated agribusiness (crops, livestock, aquaculture, food-safety lab, organic processing). The site must let the Ghanaian public **browse and buy** products across the full agric value chain, and give staff an admin backend for catalogue, orders, inventory and quotes.

- **Stack (fixed):** Next.js App Router + TypeScript + React 19 + Tailwind CSS v4 (CSS-first `@theme`) + Supabase (Postgres, Auth, RLS, Storage). shadcn/Radix components, `lucide-react`, Server Actions for mutations, `react-hook-form` + `zod`. Deploy target: Vercel + hosted Supabase.
- **Installable PWA** (manifest, service worker, offline page, install prompt).
- **Real copy only** — write realistic copy from this brief. No lorem ipsum, no invented testimonials or fake statistics.

**Real details (make these CMS-editable, not hardcoded):**
- Name: Grainy Palace Farm Limited · Tagline: *Cultivating Excellence. Feeding the Future.*
- Domain: grainypalacefarm.com (+ .com.gh)
- Region: Greater Accra / Ashanti, Ghana · Currency: **GHS (₵)**
- Brand promise: *From our certified fields to your table — safe, natural, and traceable.*
- Leave phone/email/WhatsApp/address as clearly-labelled editable CMS fields with sensible Ghana defaults.

---

## 1. Brand & visual direction (Ghanaian niche)

- **Palette:** Forest Green (primary), Gold (accent), Cream White (surface), warm charcoal text. Define as design tokens in `@theme` in `globals.css` so reskinning is one file.
- **Logo concept:** stylised grain head merging with a crown motif on a green field.
- **Tone:** confident, warm, scientifically credible, community-driven.
- **Look & feel:** clean, trustworthy, food-fresh. Real farm/produce/market imagery over stock gradients and decorative blobs. Category cards with product photography. Ghanaian cues — cedi pricing, local market language ("crate", "olonka/bowl", "bag", "dozen"), MoMo payment, WhatsApp ordering.
- **Trust badges** surfaced on shop + product pages: `FDA-registered`, `Certified`, `HACCP`, `Cage-Free`, `Halal`, `QR-Traceable`, `Eco-Packaged`.
- **Hero:** headline = the offer ("Certified farm food, delivered across Ghana"), one real hero visual, primary CTA `Shop Now`, secondary `Request Bulk Quote`.

---

## 2. Site map (public)

| Route | Purpose |
|---|---|
| `/` | Hero, featured categories, best-sellers, trust/certification strip, sustainability teaser, WhatsApp CTA |
| `/shop` | **Full catalogue** — category grid, filters, search, sort (centrepiece — see §3) |
| `/shop/[category]` | Category listing with sub-category chips |
| `/product/[slug]` | Product detail: gallery, price/unit, tags, traceability note, quantity, add-to-cart, WhatsApp-order |
| `/cart` + `/checkout` | Cart, delivery info, payment (§4) |
| `/livestock` | Poultry, ruminants, pork, rabbit, halal info, live-animal & egg-subscription orders |
| `/fish` | Aquaculture: fresh/smoked/frozen tilapia & catfish, farm-to-table traceability |
| `/seedlings` | Tree & economic plant seedlings (agroforestry / plantation value chain) |
| `/lab-services` | Food-safety testing menu + sample-submission form + **results tracker** (lookup by reference) |
| `/wholesale` | B2B bulk supply for supermarkets, hotels, processors, exporters — bulk quote form |
| `/partners` | **B2B partner portal** (login): bulk pricing, order history, invoices, downloadable lab CoAs |
| `/articles` | **Knowledge Hub** — full CMS-authored article library (see §3B) |
| `/articles/[category]` | Category view (Nutrition, Food Safety, Environment, Sustainable Agriculture, …) |
| `/articles/[slug]` | Article detail: cover, author, date, body, related posts, share/WhatsApp |
| `/news` | News & Events — press releases, trade fairs, community events |
| `/about` | Story, mission/vision & core values, certifications, ownership/governance, farm gallery |
| `/sustainability` | Full environmental policy: agric, livestock, aquaculture, packaging & community sustainability |
| `/careers` | Recruitment (roles from HR plan), **outgrower-scheme sign-up**, youth/community hiring |
| `/traceability` | QR / batch lookup → shows product origin, certifications, CoA for a scanned pack |
| `/contact` | Map embed, WhatsApp button, enquiry form, hours, locations |

---

## 3. THE SHOP — product taxonomy (priority feature)

Public must see and purchase every product in **well-defined categories across all food classes, animal products, tree plants and the wider agric value chain.** Build this taxonomy as seed data; all fields editable in admin.

### Top-level categories → sub-items

1. **Grains & Cereals** — Maize (grain), Milled Maize, Rice (paddy & milled), Millet, Sorghum
2. **Legumes & Nuts** — Cowpea (beans), Soybean, Groundnut
3. **Vegetables** — Tomatoes, Okra, Garden Eggs, Pepper *(fresh & crated)*
4. **Roots & Tubers** — Cassava, Yam, Cocoyam
5. **Cash & Industrial Crops** — Sesame (Beniseed), Shea
6. **Poultry & Eggs** — Dressed chicken, Frozen chicken portions, Live broilers, Table eggs *(cage-free, by crate/dozen)*, Guinea fowl
7. **Meat & Livestock** — Chevon (goat), Mutton (sheep), Pork, Rabbit, Live animals; Halal beef *(Phase 2 — show as "Coming soon")*
8. **Fish & Seafood** — Fresh Tilapia, Fresh Catfish, Smoked Catfish, Frozen Tilapia Fillets
9. **Tree & Economic Plants (Seedlings)** — Oil palm, Cocoa, Cashew, Mango, Citrus, Moringa, Shea, Teak, Plantain suckers, mixed agroforestry seedlings
10. **Processed & Value-Added Foods** — Organic flours (maize/cassava/soybean), Porridge & weaning mixes, Cold-pressed groundnut & sesame oil, Dried vegetable packs, Branded grain gift baskets
11. **Farm Inputs & Feed** — Branded livestock/poultry feed, Organic compost fertiliser, Certified seeds & fingerlings

> **Services (separate, enquiry-based — not add-to-cart):** Food-Safety Lab Testing, Co-packing, B2B Bulk Supply. Route these to the quote/enquiry pipeline, not checkout.

---

## 3B. KNOWLEDGE HUB — admin-authored articles (priority feature)

A full CMS where staff write, edit and publish articles directly from the admin — no redeploy, no markdown files. This is the farm's content engine for SEO and consumer trust.

**Topic categories (seed these, editable/extendable in admin):**
Nutrition · Food Safety · Environmental Protection · Sustainable Agriculture · Livestock & Animal Welfare · Aquaculture & Fish Farming · Farming Tips & Guides · Recipes · Company News & Events.

**Article model:** `title, slug (auto from title, editable), category, tags[], excerpt, cover_image, body (rich text), author (from profiles), status (draft / published), featured (bool), published_at, reading_time (auto), views (counter)`.

**Admin authoring UX (`/admin/articles`):**
- List with search + filter by category/status, and quick draft/publish toggle.
- Editor: **rich-text/markdown** body (headings, bold/italic, lists, links, blockquotes, inline images), cover-image upload to Supabase Storage, category select, tag input, excerpt, SEO title/description override, featured toggle, save-as-draft vs publish, live preview.
- On publish: set `published_at`, `revalidatePath('/articles')` + the slug so the public page updates instantly. Auto-compute reading time.
- Confirm on delete; toast on every save.

**Public `/articles` UX:** featured article banner, category filter chips, search, card grid (cover, category, title, excerpt, date, reading time), pagination. Detail page renders body safely (sanitised), shows author + date, related articles by category, and share buttons incl. WhatsApp. Per-article SEO metadata + `Article` JSON-LD + OG image via `next/og`.

---

## 3C. FULL BUSINESS-PLAN COVERAGE — extra modules

Build these so the site reflects the whole plan, not just the shop:

- **Livestock page** — poultry (broilers, cage-free eggs), goats/sheep, pork, rabbit, guinea fowl; halal & antibiotic-stewardship notes; **egg subscription** sign-up (weekly/monthly crates) and **live-animal order** enquiry (festive-season surge).
- **Fish & Aquaculture page** — tilapia & catfish (fresh/smoked/frozen fillet), farm-to-table traceability, wholesale enquiry; note the integrated fish-crop circular system.
- **Lab Services** — testing menu (chemical residue, microbiological, nutritional, water quality, shelf-life), pricing, sample-submission form (with file upload), and a **results tracker** (public lookup by reference → CoA download once ready).
- **Partner (B2B) portal** — Supabase-auth login for approved partners (supermarkets, hotels, processors, exporters): tiered bulk pricing, order history, invoices, downloadable Certificates of Analysis. Admin approves partner accounts.
- **Careers & Outgrower** — open roles from the HR plan; equal-opportunity + youth/community hiring copy; **outgrower-scheme application** form (contract farming: certified seeds, training, fair-price offtake).
- **Sustainability** — the four pillars from the plan (agricultural, livestock, aquaculture, packaging & community), circular zero-waste model, Ghana 2021 Plastics Levy alignment, community 2%-of-profit commitment.
- **About & Certifications** — mission/vision/core values, ownership & governance summary, and a certifications strip (FDA, MOFA, VSD, Fisheries Commission, EPA, HACCP, ISO 22000 (Phase 2), Halal, Organic) rendered from CMS so badges update as certifications are earned.
- **News & Events** — press releases, trade-fair appearances, community events (can reuse the articles engine with the "Company News & Events" category, or a lightweight `events` table with date/location).
- **Traceability** — `/traceability?code=…` (and QR on packaging) resolves a batch → product, origin, certifications, and CoA link.

### Product model (each item)
`name, slug, category, subcategory, description, image_url (+gallery), price (GHS), unit (kg / bag / crate / dozen / pack / each / seedling / litre), tags[] (Organic, Cage-Free, Halal, Smoked, Frozen, Fresh, Certified, Traceable), is_available, sort_order`. Include a short **traceability line** per product ("Farm-to-fork QR traceable").

### `/shop` UX
- Category grid at top → click drills into `/shop/[category]` with sub-category chips.
- **Filters:** category, sub-category, price range (GHS slider), availability, tags. **Search** by name. **Sort:** newest / price ↑↓ / name.
- Product card: photo, name, unit, GHS price, tag badges, `Add to cart`, quick `Order on WhatsApp`.
- Mobile-first grid that steps 4→3→2→1 columns; never jump straight to 1.
- Every listing has loading / empty / error states.

---

## 4. Ghana commerce integrations

- **Payments:** integrate **Paystack or Flutterwave** (both support Ghana Mobile Money — MTN MoMo, Telecel Cash, AirtelTigo — plus cards). Also offer **Cash/Pay-on-delivery** and **Bank transfer** options at checkout. Keep provider keys in env; abstract behind one payment module so the provider can be switched.
- **WhatsApp ordering (critical):** on every product and at checkout, a `wa.me/{number}?text=...` handoff pre-filled with item(s), quantity, unit and GHS total (bold labels via `*text*`). After any order/quote submission, show a success card with a "Continue on WhatsApp" button. WhatsApp number editable from CMS.
- **Delivery:** checkout captures delivery zone (Accra intra-city vs nationwide courier — e.g. partner couriers). Flat/zone-based delivery fee configurable in admin. Farm-gate pickup option.
- **Bulk / wholesale:** `/wholesale` and a "Request bulk price" CTA on high-volume categories (grains, live animals, fish) route to `quote_requests`, not the cart.
- Prices seed with **realistic GHS values** for the Ghana market, all editable in admin. Show ₵ formatting everywhere.

---

## 5. Database schema (`supabase/schema.sql` — idempotent, RLS, seed data)

- `profiles` — id, email, full_name, role (`admin`/`staff`), is_active; auto-create via signup trigger.
- `site_content` — key/value CMS by section (header, footer, about, contact, sustainability, delivery).
- `hero_slides`, `page_heroes`, `gallery_items`, `social_links`.
- `products` — public catalogue per §3 (keep separate from inventory).
- `inventory_items` — name, category, image_url, price, cost_price (nullable), unit, stock_quantity, low_stock_threshold, is_active. Margin calc falls back to cost = price when cost_price empty.
- `orders` + `order_items` — ref `GPF{YYMMDD}-{RAND}`, customer info, delivery zone/address, payment method, payment status, totals, status (new → confirmed → dispatched → delivered / cancelled).
- `quote_requests` — B2B / bulk / lab-service enquiries: contact, product/service, quantity, timeline, notes, status (new → contacted → quoted → closed). **Anonymous insert allowed; no anonymous read.**
- `articles` — Knowledge Hub content per §3B: title, slug, category, tags[], excerpt, cover_image, body, author_id, status, featured, published_at, reading_time, views.
- `article_categories` — name, slug, description, sort_order (seed the nine topics; editable).
- `certifications` — name, badge_image, issuing_body, status (active/pending), sort_order — drives the About/shop badge strip.
- `events` — title, slug, body, cover, event_date, location, is_published (News & Events).
- `subscriptions` — egg/produce subscription sign-ups: customer, plan (weekly/monthly), item, quantity, status. Anonymous insert.
- `outgrower_applications` — farmer name, contact, location, crop, land size, notes, status. Anonymous insert.
- `job_openings` (title, dept, description, is_open) + `job_applications` (opening_id, applicant, contact, cv_url, status; anonymous insert).
- `partners` — approved B2B accounts linked to a `profiles` row with role `partner`: business name, tier, approved_by. Powers the `/partners` portal.
- `lab_samples` — reference, client, sample_type, tests[], status (received → testing → complete), coa_url. Public read of **status + CoA by reference only** (results tracker); full table staff-only.
- **RLS:** public read on `products`, published `articles`/`events`, content & `certifications` tables; staff/admin only on inventory, orders, quotes, lab_samples (except the reference lookup), applications; anonymous insert on `orders`, `quote_requests`, `subscriptions`, `outgrower_applications`, `job_applications`; `partner`-role read on their own orders/invoices/CoAs. `set_updated_at()` trigger on every table with `updated_at`. Index FKs used in RLS.
- Seed: all §3 categories/products with realistic GHS prices and images; nine article categories + 4–5 real starter articles (one each on nutrition, food safety, environmental protection, sustainable agriculture); hero slides; certifications; a couple of events.

---

## 6. Admin portal (`/admin`, auth-guarded via `proxy.ts`)

Sidebar shell (off-canvas drawer on mobile), role-filtered nav. Modules:
- **Dashboard** — stat cards (revenue, orders, pending quotes, low-stock count), revenue chart, recent orders.
- **Point of Sale** — item picker + running cart; checkout writes sale, decrements stock, prints receipt (`window.print()`).
- **Catalogue** — CRUD on `products` (image upload to Supabase Storage, category/subcategory, tags, unit, price, availability, sort).
- **Inventory** — CRUD with live margin preview; clearable numeric inputs (`value={field || ''}`).
- **Orders** — status-filtered table, detail view, mark dispatched/delivered/cancelled, print.
- **Articles (Knowledge Hub)** — full authoring per §3B: rich-text editor, cover upload, category/tags, draft↔publish, featured toggle, SEO fields, live preview. Category CRUD.
- **News & Events** — CRUD for `events`.
- **Certifications** — CRUD (badge upload, active/pending) feeding the public badge strip.
- **Enquiries hub** — one place for quotes/wholesale, lab samples (with CoA upload + status), subscriptions, outgrower & job applications — each a status-workflow list + detail.
- **Partners** — approve/reject B2B accounts, set pricing tier, view partner activity.
- **Content CMS** — grouped key-value editor over `site_content`; hero/gallery CRUD.
- **Staff** — role assignment (`admin`/`staff`/`partner`) via Supabase Admin API in a server action (never expose service-role key).

Every destructive action confirms first; every save/error fires a `sonner` toast.

---

## 7. PWA + core standards

- Manifest (`id`, standalone, green `theme_color`, 192/512 + maskable icons), service worker (precache shell; network-first navigations, cache-first static), branded offline page, dismissible install prompt (+ iOS "Add to Home Screen" hint).
- Mobile-first responsive 360→1440px per skill §10 (sticky header, hamburger, 16px form inputs, tables scroll in their own container, safe-area insets, `clamp()` headings).
- **SEO:** per-route metadata, OG images via `next/og`, JSON-LD (`Organization` + `LocalBusiness` sitewide, `Product` on product pages, `Article` on Knowledge Hub posts), `sitemap.ts` (include published articles), `robots.ts`.
- **A11y:** keyboard nav, labelled inputs, alt text, visible focus, sufficient contrast.
- **States:** `loading.tsx` / `error.tsx` per route group, `global-error.tsx`, custom 404.
- **Perf:** `next/image` with correct `sizes`, `next/font`, no layout shift.
- **Security:** RLS on every table, service-role key server-only, zod-validate every form on client **and** server, `.env.example` listing all vars.

---

## 8. Modern platform layer (add all of this)

- **Latest Next.js** — App Router, Turbopack, Cache Components / PPR with `"use cache"` on shared views and `<Suspense>` streaming for dynamic parts (cart, dashboard). Server Actions for all mutations; `revalidateTag`/`revalidatePath` after writes.
- **View Transitions** — smooth page/route and product-image transitions via the View Transitions API (gracefully ignored where unsupported), gated behind `prefers-reduced-motion`.
- **Theming** — light/dark/system via `next-themes` with no flash (inline theme script); brand tokens drive both modes.
- **Motion** — subtle, purposeful micro-interactions (hover, add-to-cart, skeleton→content) with CSS/`framer-motion`; everything respects `prefers-reduced-motion: reduce`.
- **Instant UX** — optimistic add-to-cart (`useOptimistic`), skeleton loaders, debounced instant search over products + articles, toast feedback (`sonner`).
- **PWA, fully modern** — installable, offline-tolerant, **Web Share API**, and **web push notifications** (order updates, restock/new-article alerts) for users who opt in.
- **Images/fonts** — `next/image` serving AVIF/WebP with blur placeholders; `next/font` self-hosted, zero layout shift.
- **Consent & analytics** — privacy-first cookie/consent banner (choose the most privacy-preserving default), plus Vercel Analytics + a lightweight privacy-friendly product analytics hook.
- **Trust & conversion** — sticky mini-cart, recently-viewed, related products, low-stock nudges, delivery-zone estimator, and a floating WhatsApp button on every page.

## 9. Inclusive & easy access — for every public visitor

Built for the real Ghanaian audience: entry-level Android phones, patchy/expensive data, mixed literacy, and no forced sign-up.

- **No account required** — full browse **and guest checkout**; account is optional (order tracking / faster reorder). Ordering also possible entirely via WhatsApp.
- **Multilingual** — English default with a language switcher for **Twi (Akan), Ga, Ewe and Hausa** using `next-intl` (locale-routed, translatable UI strings + key content). Keep copy plain and short so it translates and reads easily.
- **Low-data / low-end friendly** — small JS bundles, lazy-loaded images, a **"Lite / data-saver" toggle** (defers heavy imagery), fast Time-to-Interactive on 3G, and offline access to already-viewed pages via the service worker.
- **WCAG 2.2 AA** — semantic landmarks, logical heading order, full keyboard operability, visible focus rings, skip-to-content link, ARIA only where needed, labelled inputs with inline errors, alt text on all meaningful images, ≥4.5:1 text contrast, 44×44px touch targets, no colour-only meaning, captions/transcripts for any video.
- **Readability & assistive tech** — respects OS text-scaling up to 200% without breakage, `prefers-reduced-motion`, screen-reader-tested flows (nav, shop, checkout, article); high-contrast-friendly palette.
- **Reach on any device** — mobile-first 360→1440px, works on older Android WebViews; **SMS/WhatsApp order confirmation** so users without email still get a receipt.
- **Findability** — clear top nav + search, breadcrumb trails, human-readable slugs, an on-site help/FAQ, and prominent contact (call, WhatsApp, map).

---

## 10. Build order & deliverables

1. Scaffold (Next.js + TS + Tailwind v4 + ESLint) → 2. `supabase/schema.sql` → 3. Auth + `proxy.ts` guard → 4. Public pages (shop first) → 5. Server Actions, cart/checkout, payments, WhatsApp, admin, Knowledge Hub → 6. Modern layer (§8), i18n + inclusive access (§9), PWA, SEO, a11y, responsiveness → 7. `npm run build` passes with zero TS/ESLint errors; run Lighthouse — target ≥95 Performance/Accessibility/Best-Practices/SEO on mobile.

**Ship:** full working source · `supabase/schema.sql` (RLS + seed) · `README.md` · `DEPLOYMENT.md` (beginner walkthrough: create Supabase → run schema → copy keys → import to Vercel → set env → deploy). No TODOs or placeholders in shipped code.
