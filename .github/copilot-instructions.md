# Copilot instructions — TechSober

**`AGENTS.md` (repo root) is the canonical guide — read it.** This file lists only
the must-not-break rules, because Copilot may not deeply traverse linked files.

- **Stack:** static Astro 5 (no SSR) + Cloudflare Pages Functions, TypeScript,
  vanilla CSS design tokens (`src/styles/tokens.css`), content via TinaCMS. npm.
- **Verify before done:** `npm run build:nofind`. If you touched `functions/`, also
  `npx tsc -p functions/tsconfig.json --noEmit`. No ESLint/test suite exists.
- **Branches:** `main` = production (TinaCloud-indexed), `dev` = preview. Prefer `dev`.
- **⚠️ TinaCMS:** editing `tina/config.ts` requires regenerating + verifying
  `tina/tina-lock.json`, or the live `/admin` breaks (see `AGENTS.md`).
- **Content** (`src/content/**`, `src/data/**`) is CMS-owned on `main` — `git fetch`
  and rebase before editing; prefer code changes.
- **Functions** run in Workers (not Node); guard on env, degrade gracefully, no secrets.
- Small diffs; reuse components/tokens; no new deps without reason; accessibility
  (one `<h1>`, semantic landmarks, `alt` text); never commit secrets/keys.
