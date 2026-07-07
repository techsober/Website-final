# Testing & verification guide

This repo has **no unit-test framework, linter, or `astro check`** configured (as
of setup). Verification is build- and inspection-based — don't assume a test
suite exists.

## Gates (run the smallest relevant first)

1. **Astro build** — `npm run build:nofind` (= `astro build`). Catches content
   schema errors, broken imports, TS errors in rendered code, and route failures.
   This is the primary gate for any `src/**` change.
2. **Functions typecheck** — `npx tsc -p functions/tsconfig.json --noEmit`. Run
   whenever you touch `functions/**` (Workers runtime, own tsconfig).
3. **Full prod build** — `npm run build` (adds TinaCMS admin + Pagefind). Slower;
   run when changing the build pipeline, Tina, or search.

## Visual / behavioural checks

- `npm run dev` and open the affected route(s); verify at 375px and desktop.
- After a build, inspect `dist/` (e.g. grep the built HTML for the expected
  `<title>`, canonical, JSON-LD, and exactly one `<h1>`).
- Forms POST to `/api/*` Functions; those only execute under the Cloudflare
  runtime (`wrangler pages dev`) or on the deployed site — locally they degrade
  gracefully.

## Adding tests

If you introduce non-trivial pure logic (e.g. in `src/lib/`), prefer adding
**Vitest** plus a `test` script rather than leaving it uncovered — and record the
new command in `AGENTS.md`. Flag this rather than silently skipping tests.

## If a check can't run

State the exact command and the blocker (missing dependency, needs Cloudflare
runtime, etc.) in your handoff instead of claiming success.
