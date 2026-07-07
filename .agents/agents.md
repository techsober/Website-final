# TechSober — Antigravity agents

Project context and rules are canonical in **`AGENTS.md`** (repo root). Read it
first; this directory only adds the change workflow below.

Practical roles (use as needed — no personas):

- **Implementer** — makes the minimal safe diff following `AGENTS.md`.
- **Reviewer** — runs `docs/ai/review-checklist.md`.
- **QA / edge-case** — enumerates normal / boundary / empty / invalid / error / async cases.
- **Security & performance** — checks secrets, input validation, graceful
  degradation, CLS/bundle size.

Standard flow: `.agents/workflows/change-cycle.md`.
