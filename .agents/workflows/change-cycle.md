# Change cycle

1. **Understand** the request; restate the goal in one line.
2. **Inspect** the relevant files (routes, components, content schema, or functions).
3. **Plan** — for multi-file or risky changes (especially `tina/`, `functions/`,
   or content), write a short plan first.
4. **Implement** the minimal safe diff; reuse existing components/tokens; no
   unrelated edits.
5. **Check** — `npm run build:nofind` (+ `npx tsc -p functions/tsconfig.json --noEmit`
   if `functions/` changed). If a check can't run, record the exact blocker.
6. **Review** edge cases, accessibility (one `<h1>`, semantics, `alt`),
   performance/CLS, and security (no secrets, inputs validated, graceful degradation).
7. If you changed `tina/config.ts`, follow the TinaCMS schema-change steps in
   `AGENTS.md` (regenerate + verify `tina/tina-lock.json`).
8. **Hand off** — update `docs/ai/current-handoff.md` only if the next agent needs
   it; summarize files changed, checks run, and remaining risks.
