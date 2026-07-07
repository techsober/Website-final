# TechSober — Agent Guide

Canonical instructions for **all** AI coding agents (Claude Code, Codex, Cursor,
GitHub Copilot, Google Antigravity, Hermes). Tool-specific files are thin
adapters that point here — **this file is the source of truth.** Keep it short.

## Project

TechSober is a six-page static marketing/content site for a UK tech & AI creator
(honest, hype-free reviews + AI tools). Static Astro site on Cloudflare Pages
(static assets + Pages Functions); content is managed in Git via TinaCMS.

## Stack (verified)

- **Astro 5**, `output: 'static'` (no SSR adapter) — `astro.config.mjs`
- **TypeScript** (strict) + `.astro` components
- **Vanilla CSS** design tokens (`src/styles/tokens.css` + `global.css`) — no Tailwind/CSS-in-JS
- **Astro Content Collections** (blog/projects/products/pages) + `src/data/*.json`
- **TinaCMS + TinaCloud** for editing (`tina/config.ts`, `/admin`)
- **Cloudflare Pages Functions** (`functions/api/*.ts`) — Workers runtime, not Node
- **npm**. Search: Pagefind · Comments: Giscus · RSS: `@astrojs/rss`

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` (http://localhost:4321) |
| Build (full, prod) | `npm run build` (Tina admin + Astro + Pagefind) |
| **Build (fast correctness gate)** | `npm run build:nofind` |
| Preview prod build | `npm run preview` |
| Typecheck Functions | `npx tsc -p functions/tsconfig.json --noEmit` |
| CMS locally | `npm run tina:dev` → `/admin/index.html` |

No ESLint / Prettier / test suite / `astro check` are configured. See
`docs/ai/testing-guide.md` for how verification actually works here.

## Architecture map

- `src/pages/**` — routes (file-based: `[slug]`, `[page]`, `category/[cat]`, `rss.xml.ts`, `404.astro`)
- `src/layouts/**` — `BaseLayout`, `BlogPost`, `ProjectPage`
- `src/components/**` — reusable `.astro` (Header, Footer, Card, Seo, …)
- `src/content/**` + `src/content.config.ts` — Markdown collections + Zod schemas
- `src/data/*.json` — page singletons (home, portfolio)
- `src/lib/**` — `site.ts` (config/flags/AUTHOR), `content.ts` (helpers), `icons.ts`, `youtube.ts`
- `src/styles/**` — design tokens + global CSS
- `functions/api/**` — Cloudflare Pages Functions (+ `functions/_utils.ts`, own `functions/tsconfig.json`)
- `tina/config.ts` + `tina/tina-lock.json` — CMS schema (+ generated lock)
- `scripts/build.mjs` — prod build wrapper · `scripts/gen-assets.mjs` — OG/icon generator

Deeper reference: `docs/ai/architecture-map.md` (read on demand, not always).

## ⚠️ Repo-specific rules (get these wrong and you break production)

1. **TinaCMS schema changes are dangerous.** After editing `tina/config.ts` (or a
   collection's shape) you MUST regenerate `tina/tina-lock.json` **and verify it
   matches**, or the live `/admin` breaks with a schema mismatch. Follow
   `.claude/skills/tina-schema-change/SKILL.md`. Keep `tina/config.ts` in sync
   with `src/content.config.ts`.
2. **Content is CMS-owned on `main`.** The owner edits `src/content/**` and
   `src/data/*.json` live via TinaCMS (auto-commits to `main`). Before touching
   content, `git fetch` and rebase; prefer code changes over content edits.
3. **Branches:** `main` = production (Cloudflare Pages + TinaCloud-indexed),
   `dev` = preview test site. Do code work on `dev`; merge to `main` to ship.
4. **Functions ≠ Astro.** `functions/**` runs in Cloudflare Workers (Web/Fetch
   APIs, not Node); own tsconfig; excluded from the Astro build. Every
   integration must guard on env presence and **degrade gracefully** (site builds
   with no keys). Read secrets from the `env` param, never hardcode them.
5. **Env:** `import.meta.env.PUBLIC_*` = client/build-safe; everything else is
   server/build-only (`process.env`). All features are feature-flagged
   (`.env.example`). **Never commit secrets, keys, or private URLs.**
6. **Visuals:** `src/styles/tokens.css` is the design source of truth. Don't
   restyle arbitrarily — reuse tokens and existing components.

## General engineering rules

- Small, reviewable diffs. Don't rewrite unrelated code or reformat files you aren't changing.
- Preserve existing patterns; no new abstractions/dependencies without a clear, stated reason.
- Validate inputs at boundaries (Functions, forms). Handle loading, empty, error, and success states.
- Accessibility: exactly one `<h1>` per page, semantic landmarks, keyboard focus, `alt` text, honour `prefers-reduced-motion`.
- Performance/CLS: lazy-load below-the-fold images with explicit `width`/`height`; keep client JS minimal.
- SEO invariants (canonical, OG/Twitter, JSON-LD, sitemap) are wired via `Seo.astro` + the layouts — keep them intact.

## Testing / verification

- Run the smallest relevant check first. Baseline gate: `npm run build:nofind`
  (catches schema/type/render errors). Typecheck Functions with the `tsc` command above.
- No unit-test framework exists yet. If you add non-trivial logic, propose adding
  tests (Vitest) rather than assuming a suite. If a check can't run, state the exact blocker + command.
- Details + how to verify visually: `docs/ai/testing-guide.md`.

## Docs maintenance

Update these agent docs only for **durable** knowledge (new command, architectural
pattern, new dependency, recurring gotcha, security/deploy constraint, testing
convention) — not one-off implementation details. Keep `AGENTS.md` short.

## Before you finish

Run the review checklist (`docs/ai/review-checklist.md`): correctness, edge
cases, accessibility, performance, security, maintainability, no unrelated diffs.
Update `docs/ai/current-handoff.md` if the next agent needs the context.
