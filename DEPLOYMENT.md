# Deployment Guide (beginner walkthrough)

This walks through taking the project from source code to a live site: create a Supabase project → run the schema → collect keys → deploy to Vercel → set environment variables → verify. No prior Supabase/Vercel experience assumed.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, and click **New project**.
2. Pick an organization, name the project (e.g. `grainy-palace-farm`), set a strong database password (save it somewhere safe — you won't need it day-to-day, but keep it), and choose a region close to Ghana (e.g. an EU region) for lower latency.
3. Wait for the project to finish provisioning (a minute or two).

## 2. Run the database schema

1. In the Supabase dashboard, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `supabase/schema.sql` from this repo, copy its entire contents, paste into the SQL editor.
4. Click **Run**. It should complete without errors — it creates every table, enables Row-Level Security with the correct policies, sets up triggers, creates the `media` and `documents` storage buckets, and seeds starter data (products, articles, certifications, hero slides, events).
5. The script is idempotent — if you ever need to re-run it (e.g. after pulling a schema update), it's safe to paste and run again.

## 3. Copy your API keys

1. In Supabase, go to **Project Settings → API**.
2. Copy:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → this is `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep this secret — never put it in client code or commit it; it's only used server-side)

## 4. Set up Paystack (payments)

1. Create an account at [paystack.com](https://paystack.com) (supports Ghana — cards + MTN MoMo, Telecel Cash, AirtelTigo).
2. In the Paystack dashboard, go to **Settings → API Keys & Webhooks**.
3. Copy the **Public Key** → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and **Secret Key** → `PAYSTACK_SECRET_KEY`. Use the **Test** keys first; switch to **Live** keys once you're ready to accept real payments.
4. Once you have a deployed URL (step 6), come back here and add a webhook: **Settings → API Keys & Webhooks → Webhook URL** = `https://your-domain.com/api/paystack/webhook`. This is what confirms orders automatically after a successful payment.

If you skip Paystack entirely, checkout still works via **Cash on delivery** and **Bank transfer** — those don't need any keys.

## 5. (Optional) Set up Web Push notifications

Only needed if you want opt-in push notifications for order updates, restocks and new articles. Skip this section to launch without it — everything else works fine.

```bash
npx web-push generate-vapid-keys
```

Copy the output into:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

## 6. Deploy to Vercel

1. Push this repository to GitHub (if it isn't already).
2. Go to [vercel.com/new](https://vercel.com/new), sign in, and **Import** the GitHub repository.
3. Vercel auto-detects Next.js — leave the build settings as default.
4. Before deploying, add the environment variables (see next section).
5. Click **Deploy**. First deploys take a few minutes.

## 7. Set environment variables

In Vercel: **Project → Settings → Environment Variables**. Add every variable from `.env.example`:

| Variable | Where it comes from |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (server-only, mark it "Sensitive" in Vercel) |
| `NEXT_PUBLIC_SITE_URL` | Your live domain, e.g. `https://grainypalacefarm.com` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack → API Keys & Webhooks |
| `PAYSTACK_SECRET_KEY` | Paystack → API Keys & Webhooks (mark it "Sensitive") |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your business WhatsApp number, digits only, country code first, no `+` (e.g. `233201234567`) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Optional — see step 5 |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | `true` to enable Vercel Analytics, otherwise `false` |

After adding variables, trigger a redeploy (**Deployments → ⋯ → Redeploy**) so the build picks them up.

## 8. Create your first admin account

There's no public admin sign-up form (by design). To bootstrap the first staff account:

1. Visit your live site and go to `/signup`, create an account with your work email.
2. In Supabase → **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'your-email@example.com';
   ```
3. Sign in at `/admin/login` with that account. From there, use **Admin → Staff** to promote/invite other team members without touching SQL again.

## 9. Verify everything works

- [ ] Homepage loads, hero and featured products show real data (from the seeded catalogue)
- [ ] `/shop` filters, searches and paginates
- [ ] Add a product to cart → checkout → place a test order (use Paystack test card details, or Cash/Bank transfer)
- [ ] `/admin` login works and the order you just placed shows up under **Orders**
- [ ] `/articles` loads the seeded Knowledge Hub posts and category chips work
- [ ] The install prompt appears on mobile Chrome / the "Add to Home Screen" hint appears on iOS Safari
- [ ] `wa.me` links open WhatsApp with a pre-filled message

## Updating a live deployment

- Code changes: push to your connected GitHub branch — Vercel redeploys automatically.
- Schema changes: paste the updated `supabase/schema.sql` into the Supabase SQL Editor and run it again (idempotent, safe on top of existing data).
- New environment variables: add them in Vercel, then redeploy.
