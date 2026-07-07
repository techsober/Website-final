---
paths:
  - "src/**/*.astro"
  - "src/styles/**"
  - "src/lib/**"
---

# Frontend rules

- Reuse existing components (`src/components/`) and design tokens
  (`src/styles/tokens.css`) before adding new ones. The tokens are the visual
  source of truth — no ad-hoc colours/spacing and no CSS framework.
- Astro is HTML-first: keep pages static; add a `<script>` only when
  interactivity requires it, and respect `prefers-reduced-motion`.
- Accessibility: exactly one `<h1>` per page; semantic landmarks
  (`header/nav/main/article/footer`); keyboard focus; `alt` on images.
- For data-driven UI, handle loading/empty/error/success. Lazy-load below-the-fold
  images with explicit `width`/`height` (no CLS).
- SEO is centralized in `Seo.astro` + the layouts (canonical, OG/Twitter, JSON-LD,
  sitemap). Route new pages through `BaseLayout` and keep those tags intact.
- Build-time vs client: read non-public env via `process.env` in build code; only
  `PUBLIC_*` is safe client-side.
