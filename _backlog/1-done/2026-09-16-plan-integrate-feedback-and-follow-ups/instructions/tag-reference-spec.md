# Instructions: `tag-reference-spec`

**Plan:** `integrate-feedback-and-follow-ups`

**Iteration Id:** `tag-reference-spec`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-integrate-feedback-and-follow-ups/instructions/tag-reference-spec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `tag-reference-spec`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                                  | Purpose                               |
| ------------ | ---------------------------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory                      | Workspace root directory              |
| `$PROJECT`   | Provided with prompt                           | Where work execution is taking place. |
| `$SPEC`      | `$PROJECT/spec/grammar/constructs/expressions` | Spec directory for expressions        |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `tag-reference-spec`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Introduce the TagReference spec file, clean up the Tag spec by removing projection-related prose, and fix the VocabularyDeclaration syntax reference.

## Mandatory Reading

- ::READ `$SPEC/tag.art` (Knowledge) — Tag construct spec.
- ::READ `$PROJECT/spec/grammar/constructs/inline/vocabulary-declaration.art` (Knowledge) — VocabularyDeclaration spec.

## Changes

- Step 1 / 3 — Create TagReference spec
- Step 2 / 3 — Clean up Tag spec
- Step 3 / 3 — Commit `tag-reference-spec`

## Steps

### Step `1 / 3` — Create TagReference spec

Create `$SPEC/tag-reference.art` defining the `TagReference` construct.

**Content:**

````art
# Module

## Uses

::READ (Construct: Identifier) FROM `./identifier.art`.

## Construct: TagReference

**Category:** Expressions

**Purpose:** Reference a tag value in prose or instructions without triggering tag attachment behaviour.

**Description:** TagReferences are backtick-enclosed references to tag values used in instructions, prose, and filter operations. Unlike Tag constructs, they do not attach to SectionBlock headings and are not subject to projection rules. They are detected in prose content via regex — not inside fenced code blocks or inline code.

**Syntax:**

```art
<TagReference> =
    `#<Identifier>`
````

**Rules:**

- A TagReference MUST be enclosed in backticks.
- A TagReference MUST NOT include parentheses.
- A TagReference name MUST be kebab case.
- A TagReference is for reference only and does not attach to any construct.

**Examples:**

Example of referencing a tag in a filter operation:

```md
1. With each `%construct` tagged with `#generator`, ...
```

Example of referencing a tag in instructions:

```md
Apply the convention to all items tagged `#wip`.
```

```

### Step `2 / 3` — Clean up Tag spec

Edit `$SPEC/tag.art`:

1. Remove all prose related to "projections" from the Description (lines 13-14). Replace with simpler description focused on tag attachment and metadata.
2. In the Tagged definitions section, change `<Vocabulary> <Tags>` to `<VocabularyDeclaration> <Tags>`.
3. Remove the HTML comment at the end of the file (the WIP note about TagReference).

### Step `3 / 3` — Commit `tag-reference-spec`

#### Commit: `tag-reference-spec`

**Policy:** MANUAL — The user executes the commit themselves; no instructions file is generated and the commit is not delegated.

**Message:**

```

spec(art-js): Add TagReference spec and clean up tag definitions

- Create `spec/grammar/constructs/expressions/tag-reference.art`
- Remove projections prose from `spec/grammar/constructs/expressions/tag.art`
- Fix VocabularyDeclaration syntax reference

```

## Final Verification

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `tag-reference.art` exists and contains the TagReference construct definition.
- Verify that `tag.art` no longer contains projection-related prose and references `<VocabularyDeclaration> <Tags>`.
- Report according to the "How to Report Back to the Delegator" instructions.
```
