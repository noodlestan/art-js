# Parking Lot: Art JS Roadmap

WIP tracker for the roadmap, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope). Decisions live in the ADRs (`knowledge/records/adr/`); the work sequence lives in `_architect.md`.

## ACTIONABLE

- None

## PENDING

- **Entry point spec** — define what an entry point is, how it is declared and selected for a compilation run, and what it resolves to. Anchors the vertical slice: output is validated against the entry point spec, not against a stored reference output.
- **Art init bootstrap** — marker-delimited AGENTS.md section (`<!-- ::ART-BOOTSTRAP:START/END -->`) + `.agents/` skeleton; `art init` / `npx art-init` inserts it non-destructively (idempotent). See ADR `installation.art`.
- **Update commands** — consolidate `update-domains`, `update-skills`, `update-agents` into a single deterministic `art update` in `cli/tools`.
- **Projection generation pipeline** — bundler generating per-domain projections (Author, Generator, Operator, Indexer), each exposing the minimum context its consumers need. Precompiled-and-committed to be replaced by install-time compilation + per-project overrides (see `distribution.art`).
- **Pipeline implementation details** — target-variant content, build configuration (projection + resource-type/name → format rules), tag-based filtering (`#author`/`#generator`/`#operator`/`#indexer`), overloaded declaration resolution, transformations, format templates, render stage, full-pipeline wiring. See `_architect.md` for sequence.

## BLOCKER

- None current.

## FOLLOW-UPS (not in scope)
