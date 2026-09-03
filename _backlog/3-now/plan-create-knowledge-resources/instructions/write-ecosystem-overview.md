# Instructions: `write-ecosystem-overview`

**Plan:** `create-knowledge-resources`

**Iteration Id:** `write-ecosystem-overview`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-create-knowledge-resources/instructions/write-ecosystem-overview__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `write-ecosystem-overview`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable              | Resolved Path               | Purpose                           |
| --------------------- | --------------------------- | --------------------------------- |
| `$WORKSPACE`          | Current working directory   | Workspace root directory          |
| `$PROJECT`            | Provided with prompt        | project repository root           |
| `$ARCH`               | `$PROJECT/architecture/`    | repo-level architecture directory |
| `$PACKAGE_PARSER`     | `$PROJECT/libs/parser/`     | parser package                    |
| `$PACKAGE_SERIALIZER` | `$PROJECT/libs/serializer/` | serializer package                |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs/` | constructs package                |
| `$PACKAGE_PRIMITIVES` | `$PROJECT/libs/primitives/` | primitives package                |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `write-ecosystem-overview`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Write a prose ecosystem overview for the art-js repository that conveys architectural knowledge beyond facts: how the packages are wired, each package's role, and the contracts that bind them versus the separation between them. The overview must make clear that the parser and serializer do NOT know anything about what constructs actually exist.

## Mandatory Reading

- `$PACKAGE_PARSER/src/config/types.ts` — `ParserConfig`: declares only `defaultConstruct` and `constructs` (a list of `ConstructParserFactory`).
- `$PACKAGE_PARSER/src/config/createDefaultConfig.ts` — the default parser config, importing concrete construct parsers from `@art-js/constructs`.
- `$PACKAGE_PARSER/src/builder.ts` — `buildDocument`, the parser core: visits mdast, tries pre-processors, then factories, falling back to the default construct.
- `$PACKAGE_SERIALIZER/src/config/types.ts` — `SerializerConfig`: declares only a `constructs` list of `ConstructToMdastFactory`.
- `$PACKAGE_SERIALIZER/src/config/createDefaultSerializerConfig.ts` — the default serializer config, importing concrete `*ToMdast` factories from `@art-js/constructs`.
- `$PACKAGE_SERIALIZER/src/artAstToMdast.ts` — walks the ArtDocument, looking up each construct by `construct` string in a registry built from config.
- `$PACKAGE_CONSTRUCTS/src/index.ts` — the constructs package public surface: exports the factory types and the concrete parser/toMdast factories.
- `$PACKAGE_CONSTRUCTS/src/constructs/types.ts` — the contract types: `ConstructCreator`, `ConstructPreProcessor`, `ConstructHandler`, `ConstructParser`, `ConstructToMdast`.
- `$PACKAGE_CONSTRUCTS/src/registry.ts` — the open construct registry (`BlockConstructMap`, `InlineConstructMap`).

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Verifying Step

**Instructions:**

To verify documentation changes, from `$PROJECT`:

```bash
npm run lint:fix # fix automatically
npm run lint # report errors that can't be fixed automatically
```

Confirm the markdown is well-formed and consistent with the existing `$ARCH` documents.

---

## Changes

- Step 1 / 2 — Write the ecosystem overview
- Step 2 / 2 — Commit `write-ecosystem-overview`

## Steps

### Step `1 / 2` — Write the ecosystem overview

Write `$ARCH/overview.md` (or fold the content into `$ARCH/index.md` if it is a better home, matching the structure decided in the plan) as **prose**. Do NOT produce flat fact tables of package metadata. Architecture documents convey knowledge beyond facts: interpretation, patterns, and decisions.

Group packages by their role in the ecosystem, NOT by cli/lib. Use a structure like:

```md
## Supporting Packages

- `@art-js/primitives` — {role}

## Md-Art-Md Roundtrip

{description}

- `@art-js/constructs` — {role}
- `@art-js/parser` — {role}
- `@art-js/serializer` — {role}

## Planned Packages

- ...
```

The core architectural point to convey — grounded in the code you read:

**The parser and serializer are construct-agnostic.** They know about the _contract_ (the factory types and the `Construct`/`ArtDocument` data shapes), not the concrete constructs. Concrete constructs are injected at configuration time:

- `ParserConfig` (in `parser/src/config/types.ts`) holds `defaultConstruct` and `constructs` — both are `ConstructParserFactory`s. The parser core (`buildDocument` in `builder.ts`) never names a specific construct; it drives detection generically through `preProcessor` → `factory` → fallback-to-default.
- `SerializerConfig` (in `serializer/src/config/types.ts`) holds a list of `ConstructToMdastFactory`. The serializer (`artAstToMdast.ts`) builds a registry keyed by the `construct` string and dispatches on it — again never naming a concrete construct.
- The concrete wiring lives in the **default configs**: `createDefaultConfig.ts` and `createDefaultSerializerConfig.ts`, both of which import the concrete factories from `@art-js/constructs`. This is where the ecosystem is "glued together" — it is a composition decision, not a hardcoded dependency inside the parser or serializer.

Describe the **contracts that bind** the packages:

- `@art-js/constructs` defines the _contract types_ (`ConstructCreator`, `ConstructParser`, `ConstructToMdast`, etc.) and the _data shapes_ (`Construct`, `BlockContent`, `InlineContent`, `ArtDocument` via the open `registry.ts` maps).
- `@art-js/parser` and `@art-js/serializer` both depend on these types, but each implements only one direction of the pipeline (parse and serialize respectively).

Describe the **separation**: parser and serializer are independent of each other and of any specific construct. The only binding between them is the shared data contract defined by `@art-js/constructs` (the `ArtDocument` / `Construct` shapes) plus the construct-agnostic configuration each side injects.

Cover the role of each package in a sentence or two:

- `@art-js/primitives` — shared low-level types (e.g. `MdastNode`, `VisitContext`, `Point`) used by parser and constructs.
- `@art-js/constructs` — owns the construct registry, contract types, and concrete construct implementations (both parser and toMdast directions).
- `@art-js/parser` — markdown → `ArtDocument`, driven generically by injected construct factories.
- `@art-js/serializer` — `ArtDocument` → markdown, driven generically by injected toMdast factories.

For any package whose role is not obvious from the code (e.g. `dev-server`, `language-server`, `watcher`, `tools`), list it under "Planned Packages" without speculative prose about what it may become. Do NOT invent futures.

---

#### Commit: `write-ecosystem-overview`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
docs(art-js): Write ecosystem overview.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify the overview is prose, grouped by role, not a flat fact table.
- Verify the overview correctly states that parser and serializer are construct-agnostic and bound only by the shared contract from `@art-js/constructs`.
- Verify no speculative prose about scaffolded packages.
- Execute the **Verifying Step** as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
