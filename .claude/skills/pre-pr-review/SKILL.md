---
name: pre-pr-review
description: Use before handing off or opening a PR. Verifies the change is correct, safe, and complete against this repo's gates.
---

# Pre-handoff review

1. **Scope** — diff is minimal and on-topic; no unrelated edits, no reformatting
   of untouched files, no stray debug/`console` code.
2. **Build gate** — `npm run build:nofind` passes. If you touched `functions/`,
   `npx tsc -p functions/tsconfig.json --noEmit` passes. If a gate can't run,
   record the exact blocker + command.
3. **Correctness & edge cases** — normal, boundary, empty, invalid, loading,
   error, permission, and async/concurrency cases considered for changed logic.
4. **Accessibility** — one `<h1>`, semantic landmarks, keyboard focus, `alt` text.
5. **Performance/CLS** — images lazy + sized; no needless client JS.
6. **Security** — no secrets/keys committed; inputs validated at boundaries;
   Functions still degrade gracefully without env.
7. **Content/CMS safety** — if you edited `src/content/**`, `src/data/**`, or
   `tina/**`, you rebased on latest, and for schema changes you ran the
   `tina-schema-change` skill.
8. **Summarize** for the next agent: files changed, checks run + results, and
   remaining risks. Update `docs/ai/current-handoff.md` if useful.

Full checklist: `docs/ai/review-checklist.md`.
