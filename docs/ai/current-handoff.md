# Current Agent Handoff

> Short, current-state handoff — overwrite at meaningful handoff points. **Not a
> changelog.** Keep only what the next agent needs; delete stale details.

## Current objective
_None active. The cross-agent instruction system was set up (AGENTS.md, tool
adapters, and docs/ai)._

## Files touched
_—_

## Decisions made
- `AGENTS.md` is the canonical source of truth; tool files are thin adapters.

## Tests/checks run
_—_

## Known risks or open questions
- `main` = production (TinaCloud-indexed) / `dev` = preview. Do code work on `dev`.
- TinaCMS schema edits require a regenerated + verified `tina/tina-lock.json`.

## Next suggested action
_Awaiting the next task._
