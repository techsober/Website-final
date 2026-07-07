---
paths:
  - "functions/**"
---

# Cloudflare Pages Functions rules

`functions/api/*.ts` run in the **Cloudflare Workers runtime** (Web/Fetch APIs,
`crypto.subtle`, R2 bindings) — NOT Node. They are excluded from the Astro build
and typechecked via `functions/tsconfig.json`.

- Typecheck with `npx tsc -p functions/tsconfig.json --noEmit` before finishing.
- Every integration must **guard on env presence and degrade gracefully** — the
  site must build and deploy with no keys set. Mirror the existing handlers.
- Validate and length-limit all input; keep the honeypot spam checks. Reuse
  `functions/_utils.ts` (`json`, `readBody`, `isEmail`, `hmacSha256Hex`,
  `timingSafeEqual`, `clamp`).
- Read secrets from the `env` param (`PagesFunction<Env>`), never `import.meta.env`;
  never hardcode keys/URLs. Return typed JSON `{ ok, message }` from form endpoints.
- Don't add heavy dependencies — prefer Web-standard APIs (as the Stripe webhook does).
