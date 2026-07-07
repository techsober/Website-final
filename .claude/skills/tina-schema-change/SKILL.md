---
name: tina-schema-change
description: Use whenever you change the TinaCMS schema — editing tina/config.ts, adding/removing/renaming a collection or field, or changing a collection's shape. Prevents the stale-lock bug that breaks the live /admin.
---

# Safe TinaCMS schema change

Changing the Tina schema without a matching `tina/tina-lock.json` makes the
deployed `/admin` fail with "GraphQL schema mismatch" — TinaCloud indexed one
schema while the build compiled another. Follow this exactly.

1. **Sync first.** Content is CMS-owned, so start from the real tip:
   `git fetch origin && git reset --hard origin/<branch>`. Ensure no stale Tina
   process is holding port 9000:
   `pkill -9 -f tinacms; pkill -9 -f tina-graphql; pkill -9 -f datalayer`.
2. **Edit both schemas together.** Keep `tina/config.ts` (editor fields) and
   `src/content.config.ts` (Zod schema) consistent.
3. **Regenerate the lock cleanly.** Remove `tina/__generated__` first, then with
   `PUBLIC_TINA_CLIENT_ID` set, run `npx tinacms dev` until
   `tina/tina-lock.json` is written, and stop it.
4. **VERIFY the lock reflects your change** — grep for the added/removed
   type/collection (e.g. a new collection `Foo` shows up as `FooConnection`).
   Do NOT assume it worked: a lingering process can overwrite the lock with a
   stale copy. This exact bug has broken production here before.
5. **Build gate:** `npm run build:nofind` must pass.
6. **Commit together:** `tina/config.ts`, `src/content.config.ts`, and
   `tina/tina-lock.json`. After the push, TinaCloud re-indexes the new schema; if
   the first deploy's `tinacms build` races indexing, one redeploy resolves it.

**Gotcha:** a Tina `reference` list to the *same* collection breaks codegen
(`...Connection ... can never be of type Document`). Use a slug `string` list and
resolve to entries at build time instead.
