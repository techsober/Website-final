# TechSober

Honest, hype-free tech & AI. A six-page static site for **Ashwin Chettiar**
(@techsober) — premium, minimal, calm.

Built with **Astro** (static output), vanilla CSS design tokens, Astro Content
Collections for the blog, and **Cloudflare Pages** (static build + Pages
Functions for the dynamic bits). Every integration is feature-flagged via env,
so the site builds, deploys, and works — with graceful degradation — **before
any API keys are added**.

---

## Quick start

```bash
npm install        # install dependencies
npm run dev        # http://localhost:4321
npm run build      # static build to /dist + Pagefind search index
npm run preview    # preview the production build locally
```

Requirements: **Node 18+** (built on Node 22). No database, no SSR.

Copy `.env.example` to `.env` and fill in only the keys you want to switch on —
everything is optional.

```bash
cp .env.example .env
```

---

## Project structure

```
src/
  layouts/      BaseLayout · BlogPost · ProjectPage
  components/   Header, Footer, BrandEnquiry, EmailCapture, Button, Card, Chip,
                MetricPill, Stat, Eyebrow, SectionHead, Seo, Giscus, Search,
                Pagination, BlogArchive, YouTubeRail, Icon
  pages/        index, portfolio, about, resources, contact,
                blog/ (index, [page], [slug], category/[cat]),
                projects/ (index, [slug])
  content/      blog/*.md (TinaCMS edits these) · projects/*.md
  styles/       tokens.css (design tokens) · global.css
  lib/          site.ts (config + flags) · content.ts · icons.ts · youtube.ts
  data/         products.ts (Resources + Stripe Payment Links)
functions/api/  contact.ts · subscribe.ts · stripe-webhook.ts · download.ts
public/         robots.txt, favicon, og-default image
tina/           config.ts (TinaCMS schema)
astro.config.mjs · .env.example
```

### Design tokens — "change one variable, restyle the site"

All colour, type, radius and shadow live as CSS custom properties in
**`src/styles/tokens.css`**, ported verbatim from the approved homepage mock.
`global.css` and every component read from them, so editing a token restyles
the whole site. Lavender is an accent (~80% of any screen is white/off-white/
slate); gold is reserved for honesty notes and result pills.

---

## Writing & publishing blog posts (TinaCMS)

Posts are Markdown files in `src/content/blog/` with typed frontmatter. You can
edit them by hand, or visually with **TinaCMS** — no terminal needed once it's
running.

**Local visual editing (no account required):**

```bash
npm run tina:dev
```

Then open **http://localhost:4321/admin/index.html**. Edit posts in a rich
editor; saving writes back to the Markdown files (git-backed). Commit + push to
publish.

**Publish from anywhere (TinaCMS Cloud, optional):** create a project at
[app.tina.io](https://app.tina.io), then set `PUBLIC_TINA_CLIENT_ID` and
`TINA_TOKEN`. Editors visit `/admin`, log in, and changes are committed to the
repo automatically — Cloudflare redeploys on push.

**Frontmatter** (matches the schema in `src/content.config.ts`):

```yaml
---
title: "Your headline"
description: "140–160 char meta description, front-loaded with the answer."
category: "AI" # AI | Tech | Review | Gadgets
date: 2026-06-01
cover: "/uploads/your-cover.jpg" # optional
coverAlt: "Descriptive alt text" # optional
draft: false # true hides it from the live site
---
```

New posts appear automatically on `/blog`, the right `/blog/category/...` page,
the homepage's latest-three, and the search index. Drafts are visible in `npm
run dev` but excluded from production builds.

---

## Adding a product / Stripe Payment Link

1. **Create the product** in Stripe → make a **Payment Link**.
2. Open **`src/data/products.ts`** and add (or edit) an entry. Paste the
   Payment Link into `paymentLink`, or wire it to an env var:

   ```ts
   {
     id: "ai-workflow-vault",
     title: "The AI Workflow Vault",
     description: "…",
     format: "PDF · 24 pages",
     price: 12,
     currency: "GBP",
     paymentLink: import.meta.env.PUBLIC_STRIPE_LINK_VAULT ?? "#",
     learn: ["…", "…", "…"],
     coverLabel: "The AI Workflow Vault",
   }
   ```

3. **Free lead magnets:** set `free: true` (omit `price`). The card swaps the
   buy button for the MailerLite email-capture flow automatically.

Paid items also emit `Product` JSON-LD for rich results. **Payment Links work
on day one — no backend required.**

> **Merch** is intentionally out of v1. There's a clean, commented placeholder
> at the bottom of `src/pages/resources.astro` to drop a merch grid into later.

---

## Deploying to Cloudflare Pages (git-connected)

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Node version:** 18+ (set `NODE_VERSION=20` if needed)
4. Add environment variables (Settings → Environment variables) for any
   integrations you're switching on — see `.env.example`. Set `SITE` to your
   production URL so canonical URLs and the sitemap are correct.
5. Deploy. The `/functions` directory is auto-discovered as Pages Functions
   (`/api/contact`, `/api/subscribe`, `/api/stripe-webhook`, `/api/download`).

> **Pick the "Pages" flow, not "Workers."** A correct Pages setup asks for a
> *Build command* + *Build output directory* and never a "Deploy command." If
> the build log shows `npx wrangler deploy`, the project was created as a Worker
> — delete it and recreate via **Create → Pages → Connect to Git**.

Pagefind runs as a postbuild step, so search "just works" on the deployed site.

### After your first deploy — SEO checklist

- Submit **`/sitemap-index.xml`** to
  [Google Search Console](https://search.google.com/search-console) and
  [Bing Webmaster Tools](https://www.bing.com/webmasters) (manual, one-time).
- `robots.txt`, canonical URLs, OG/Twitter tags and per-page JSON-LD are
  already in place.

---

## Integrations & feature flags

Each is dormant until its env keys exist. Nothing here can break a build.

| Feature | Switch on with | Notes |
|---|---|---|
| **Contact form** | `RESEND_API_KEY` (or `ENABLE_MAILCHANNELS=true`) | Posts to `/api/contact`; emails `contact@thetechsober.com`. Honeypot + validation. Without a provider it accepts + logs so previews work. |
| **Email capture** | `PUBLIC_MAILERLITE_ENABLED=true` + `MAILERLITE_API_KEY` | Footer + free resources. `/api/subscribe`. Disabled with a note in dev when unset. |
| **Cloudflare Analytics** | `PUBLIC_CF_ANALYTICS_TOKEN` | Cookieless beacon in `<head>`. No banner needed. |
| **Giscus comments** | `PUBLIC_GISCUS_REPO` + `PUBLIC_GISCUS_REPO_ID` (+ category ids) | Blog posts. From [giscus.app](https://giscus.app). |
| **Pagefind search** | _none_ | Built automatically by `npm run build`. |
| **Stripe selling** | Payment Links in `products.ts` | Works today, no keys needed. |
| **Stripe gated delivery** | `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` + R2 | Future-ready, inert until set (below). |
| **YouTube rail** | `YT_API_KEY` + `YT_CHANNEL_ID` | Build-time fetch of 3 newest uploads; skipped entirely if unset (below). |

---

## Switching on Stripe gated delivery (when you're ready)

Payment Links cover selling today. For **automatic protected delivery** of the
file after purchase:

1. **Create an R2 bucket** and upload your product files (they live only in R2,
   never at a public URL). Bind it to the Pages project as `DOWNLOADS`:
   dashboard → your Pages project → **Settings → Functions → R2 bucket bindings**
   → add `DOWNLOADS` → your bucket. (For local `wrangler pages dev`, add an
   `[[r2_buckets]]` binding named `DOWNLOADS` to a `wrangler.toml`.)
2. Set secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `DOWNLOAD_SIGNING_SECRET` (any long random string), and `RESEND_API_KEY`
   (to email the link).
3. In Stripe, add a webhook to **`https://yourdomain/api/stripe-webhook`** for
   the `checkout.session.completed` event. On each Payment Link / Price, set
   metadata **`file_key`** = the R2 object key to deliver.

On purchase, the webhook verifies Stripe's signature (Web Crypto, no SDK),
mints a **signed, 30-minute** link to `/api/download`, and emails it. The
download endpoint validates the token and streams the file straight from R2.
Until all of the above exists, the webhook returns `200 disabled` and nothing
happens.

## Switching on the YouTube feed (when you're ready)

Set `YT_API_KEY` and `YT_CHANNEL_ID`. On the next build, the "Latest from
YouTube" rail on `/blog` fills with your 3 newest uploads (fetched at build
time and cached). Leave them unset and the rail renders **nothing** — it can
never break a build. Mind the YouTube Data API daily quota (search.list = 100
units/call; build-time-only keeps usage tiny).

---

## Accessibility & performance

- Semantic landmarks (`header/nav/main/article/footer`), exactly one `<h1>` per
  page, skip link, visible focus rings, `aria-current` on active nav.
- `prefers-reduced-motion` honoured (animations + smooth scroll disabled).
- `font-display: swap` with a system-sans fallback; lazy-loaded below-the-fold
  images with explicit `width`/`height` (no layout shift).
- Minimal JS: sticky-header shadow, mobile menu, form fetch, scroll reveals.

---

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Astro dev server |
| `npm run build` | Static build + Pagefind index |
| `npm run preview` | Preview the production build |
| `npm run tina:dev` | Astro dev with the TinaCMS admin at `/admin` |
| `npm run tina:build` | Tina + Astro + Pagefind build |
| `node scripts/gen-assets.mjs` | Regenerate the OG image + touch icon |

---

© TechSober · Built on Cloudflare Pages.
