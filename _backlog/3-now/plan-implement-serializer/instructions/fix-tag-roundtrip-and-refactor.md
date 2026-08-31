# Instructions: `fix-tag-roundtrip-and-refactor`

**Plan:** `implement-serializer`

**Iteration Id:** `fix-tag-roundtrip-and-refactor`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

- RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.
- RULE: Do not rename or remove existing fixtures beyond the 04* renames specified below.
- RULE: Do not create fixture files beginning with `_`.
- RULE: If a command reports errors, attempt to fix them; if the error persists, STOP and report a blocker.
- RULE: If ANY already-passing fixture test starts failing during your work, you MUST highlight in your report: what broke, during which new fixture implementation, and how you fixed it to pass both the existing tests and the new one.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-serializer/instructions/fix-tag-roundtrip-and-refactor__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `fix-tag-roundtrip-and-refactor`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable              | Resolved Path                                 | Purpose                                           |
| --------------------- | --------------------------------------------- | ------------------------------------------------- |
| `$PROJECT`            | `$WORKSPACE/checkouts/art-js`                 | project repository root                           |
| `$PACKAGE_PARSER`     | `$PROJECT/libs/parser/`                       | parser package and fixture suite                  |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs/`                   | construct implementations and unit tests          |
| `$PACKAGE_SERIALIZER` | `$PROJECT/libs/serializer/`                   | serializer implementation used by roundtrip tests |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `fix-tag-roundtrip-and-refactor`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Fix the tag roundtrip for SectionBlock headings: make the serializer emit `(#tag)` syntax when tags are captured, and make the Tag construct only capture tags that appear at the end of a heading name (not in the middle). Rename the 04* fixtures to match their corrected behavior. Refactor the Tag construct to extract `createTag.ts` following the NaturalBlock pattern.

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- `$PACKAGE_PARSER/architecture/parser.md` — parser design principles, block/phrasing boundary, construct API, and serializer pipeline.
- `$PACKAGE_PARSER/architecture/fixture-tests.md` — test infrastructure, fixture anatomy, CLI flags, and use cases.
- `$PACKAGE_PARSER/test/fixtures/` — fixture inputs and snapshots used by the two-way tests.
- `$PACKAGE_PARSER/scripts/test-parser.ts` — parser test runner.
- `$PACKAGE_PARSER/scripts/test-serializer.ts` — serializer test runner.
- `$PACKAGE_CONSTRUCTS/src/constructs/Tag/` — Tag construct implementation (creator, handler, toMdast).
- `$PACKAGE_CONSTRUCTS/src/constructs/SectionBlock/createSectionBlockToMdast.ts` — SectionBlock serializer.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from `$PROJECT`:

```bash
npm ci
```

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

After every part:

```bash
cd $PACKAGE_PARSER
npm run test-parser -- --fixture {name} --write
npm run test-serializer -- --fixture {name}
```

When construct fixes are made:

```bash
cd $PACKAGE_CONSTRUCTS
npm run test
npm run lint
npm run build
```

Final verification:

```bash
cd $PACKAGE_PARSER
npm run test-parser
npm run test-serializer

cd $PACKAGE_CONSTRUCTS
npm run lint
npm run build
npm run test

cd $PROJECT
git status
npm run ci
```

---

## Changes

This section summarises the changes to be made in this iteration.

- Refactor Tag construct: extract `createTag.ts` from `createTagCreator.ts` following the NaturalBlock pattern.
- Fix Tag construct: only capture tags that appear at the END of a text node (not in the middle). Tags in the middle of heading names remain as literal text in the SectionBlock's `name` value.
- Fix SectionBlock serializer: emit `(#tag)` syntax when tags are present, appending them after the heading name.
- Rename and update 04* fixtures to match corrected behavior.
- Verify all numbered fixtures pass both parser and serializer tests with no regressions.

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 5` — Refactor Tag construct: extract `createTag.ts`

Follow the NaturalBlock pattern where `createNaturalBlockCreator.ts` is a thin wrapper calling `createNaturalBlock.ts`.

**Current structure:**
- `Tag/private/createTagCreator.ts` — contains both `detect()` and `create()` logic inline

**Target structure:**
- `Tag/private/createTagCreator.ts` — thin wrapper: `detect: () => true` (or delegates), `create: (node) => createTag(node)`
- `Tag/private/createTag.ts` — new file containing the actual tag detection and creation logic (extracted from `createTagCreator.ts`)

The `createTag.ts` function should:
1. Accept an mdast `Text` node
2. Return an array of Tag records (same shape as current `create()` output)
3. Contain the TAG_PATTERN matching logic currently in `createTagCreator.ts`

### Step `2 / 5` — Fix Tag construct: only capture tags at end of text

**Problem:** The Tag creator currently fires on ANY text node matching `TAG_PATTERN`. For headings like `# Section (#foo) Heading`, the tag `(#foo)` is in the middle of the name but gets captured. The user wants tags to only be captured when they appear at the END of the text (after stripping trailing whitespace).

**Desired behavior:**

| Fixture | Input | Tags captured? | SectionBlock name |
| --- | --- | --- | --- |
| `040-tag-in-section-block` | `# Section (#foo)` | Yes | `"Section"` |
| `041-invalid-tag-in-section-block` | `# Section (#foo) Heading` | No | `"Section (#foo) Heading"` |
| `042-multiple-tags-in-section-block` | `# Hello World (#foo) (#bar)` | Yes | `"Hello World"` |

**Implementation in `createTag.ts`:**

1. Get the text node's value
2. Strip trailing whitespace
3. Check if the stripped text ENDS with a tag pattern `(#...)`
4. If NOT → return empty array (no tags captured)
5. If YES → extract all consecutive tags from the end of the text, working backwards
6. Return the extracted tags

This means tags in the middle of a heading name (like `# Section (#foo) Heading`) are NOT captured — they remain in the SectionBlock's `name` value as literal text.

### Step `3 / 5` — Fix SectionBlock serializer: emit tags in heading

**Problem:** `SectionBlock.toMdast()` only outputs `section.name`, not `section.tags`. Fixtures 040 and 042 have captured tags that are lost during serialization.

**Fix in `createSectionBlockToMdast.ts`:**

1. After producing the heading children from `section.name` (via `fromMarkdown`), check if `section.tags` exists and has entries
2. If tags exist, append tag syntax to the heading name before parsing: `# {name} (#tag1) (#tag2) ...`
3. This means the `fromMarkdown` call should use `# ${section.name} ${tags.map(t => `(#${t.name})`).join(' ')}` instead of just `# ${section.name}`

**Important:** The `section.tags` array contains objects like `{ construct: 'Tag', name: 'foo' }`. When serializing, emit `(#foo)` for each tag, space-separated, appended after the name.

### Step `4 / 5` — Rename and update 04* fixtures

**Rename and update these fixtures:**

| Current | New | New Content | Expected Behavior |
| --- | --- | --- | --- |
| `040-tag-simple.md` | `040-tag-in-section-block.md` | `# Section (#foo)` | Tag captured: `tags=[Tag(name="foo")]`, name=`"Section"`, serializer outputs `# Section (#foo)` |
| `041-tag-in-section.md` | `041-invalid-tag-in-section-block.md` | `# Section (#foo) Heading` | Tag NOT captured: no `tags` field, name=`"Section (#foo) Heading"`, serializer outputs `# Section (#foo) Heading` |
| `042-tag-in-field-inline.md` | `042-multiple-tags-in-section-block.md` | `# Hello World (#foo) (#bar)` | Tags captured: `tags=[Tag(name="foo"), Tag(name="bar")]`, name=`"Hello World"`, serializer outputs `# Hello World (#foo) (#bar)` |

For each fixture:
1. Delete the old `.md` and `.md.json` files
2. Create the new `.md` file with the specified content
3. Run `npm run test-parser -- --fixture {new-name} --write` to generate the snapshot
4. Inspect the `.md.json` snapshot — verify construct names, tags array, and name value
5. Run `npm run test-serializer -- --fixture {new-name}` — confirm LOSSLESS ROUNDTRIP
6. Run `npm run test-serializer -- --fixture {new-name} --debug-write` — inspect `.parsed.md`

### Step `5 / 5` — Verify all fixtures still pass

After all changes:

```bash
cd $PACKAGE_PARSER
npm run test-parser
npm run test-serializer
```

Confirm all numbered fixtures pass (lossless roundtrip for 040, 041, 042; no regressions elsewhere).

---

#### Commit: `fix-tag-roundtrip-and-refactor`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
fix(md-art-roundtrip): fix tag roundtrip and refactor Tag construct
```

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that all numbered fixtures pass both parser and serializer tests with no regressions.
- Verify that the 04* fixtures have been renamed and match the corrected behavior.
- Verify that the Tag construct refactor follows the NaturalBlock pattern.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
