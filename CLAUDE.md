@AGENTS.md

## Claude Code workflow

- Read the relevant files before editing. For multi-file or risky changes
  (anything touching `tina/`, `functions/`, or content), make a short plan first.
- Prefer minimal, reviewable diffs; don't reformat untouched code.
- Path-scoped rules in `.claude/rules/` load automatically by area — trust them.
- Use skills for repeated workflows instead of expanding this file:
  - **`tina-schema-change`** — required for any TinaCMS schema edit (prevents the stale-lock bug that breaks the live `/admin`).
  - **`pre-pr-review`** — final review + verification before handing off.
- Baseline gate before finishing: `npm run build:nofind` (+ `npx tsc -p functions/tsconfig.json --noEmit` if you touched `functions/`).
- End by summarizing files changed, checks run, and remaining risks. Update
  `docs/ai/current-handoff.md` only if it helps the next agent.
