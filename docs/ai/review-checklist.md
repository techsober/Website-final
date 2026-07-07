# Review checklist

Run before handing off or opening a PR. Be honest — note anything skipped.

- **Correctness** — does what's asked; no regressions in touched files.
- **Edge cases** — normal, boundary, empty, invalid, loading, error, permission,
  async/concurrency handled where relevant.
- **Accessibility** — one `<h1>` per page; semantic landmarks; keyboard focus;
  `alt` text; `prefers-reduced-motion` respected.
- **Responsive UI** — verify at 375px and desktop; no horizontal overflow.
- **Performance** — below-fold images lazy + sized (no CLS); minimal client JS; no needless deps.
- **Security / privacy** — no secrets/keys/private URLs committed; inputs validated
  + length-limited at boundaries; Functions still degrade without env.
- **Error handling** — user-facing failures handled (forms, Functions).
- **Test coverage** — added/updated where logic changed; smallest relevant check
  run first (`build:nofind`, Functions `tsc`); blockers documented.
- **Maintainability** — reuses existing components/tokens/patterns; readable.
- **No unrelated diffs** — no reformatting or drive-by edits to untouched files.
- **Content / CMS** — content edits rebased on latest; schema changes regenerated
  the Tina lock (see `tina-schema-change`).
