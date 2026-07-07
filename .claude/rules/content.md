---
paths:
  - "src/content/**"
  - "src/data/**"
  - "src/content.config.ts"
  - "tina/**"
---

# Content & CMS rules

This area is **CMS-owned**: the site owner edits it live via TinaCMS, which
auto-commits to `main`. Treat it as shared, mutable state.

- **Before editing any content file, `git fetch origin` and rebase** onto the
  latest branch tip — the owner may have committed edits. Prefer code changes to
  content edits when you have the choice.
- Frontmatter must satisfy the Zod schema in `src/content.config.ts`. If a build
  fails on content, fix the frontmatter — not the schema — unless the schema is wrong.
- **Any change to `tina/config.ts` (or a collection's shape) REQUIRES**
  regenerating and verifying `tina/tina-lock.json`; a stale lock breaks the live
  `/admin` (schema mismatch). Follow the `tina-schema-change` skill, and keep the
  Astro schema (`src/content.config.ts`) and Tina schema (`tina/config.ts`) in sync.
- A Tina `reference` list pointing at its **own** collection breaks codegen — use
  a slug `string` list and resolve at build time (see `docs/ai/architecture-map.md`).
- Never put secrets in content or data files.
