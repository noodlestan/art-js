# Architect Briefing: Art JS Roadmap

This file supports tracking transient architecture knowledge in the context of the current roadmap focus.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `architecture/index.md`

## Findings

- None.

## Decisions

- None.

## Knowledge to Update

### Missing Architecture Docs/Sections:

- Why
- Use Cases
- Vision
- NFRs
- Technical Debt

## Follow Ups

- Reactive core (chokidar → signals → memo recompute) — blocked on POC; signals + directivity need exercised grammar.
- Template engine research (Nunjucks/Handlebars/Liquid vs `.tart` requirements) — parallelizable.
- Precompiled rewrite (install-time compilation + per-project overrides, using render-cost evidence from the POC).
- Standalone build of the compile command — `bin/compile`, backed by ADR.
