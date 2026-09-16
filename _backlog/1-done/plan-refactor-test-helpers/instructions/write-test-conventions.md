# Instructions: `write-test-conventions`

**Plan:** `refactor-test-helpers`

**Iteration Id:** `write-test-conventions`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions.

## How to Report Back to the Delegator

1. Summarise whether you are reporting completion or a BLOCKER.
2. Gather evidence of changes made and outcomes achieved, or blocker error details.
3. Use the `render-template` skill with `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `write-test-conventions__report.md`.
4. Generate the response and send it back to the delegator tersely: happy face + up to 3 bullet points.

## Path Variables

| Variable     | Resolved Path               | Purpose                              |
| ------------ | --------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory   | Workspace root directory             |
| `$PROJECT`   | `checkouts/art-js-building` | Repository root for all code changes |

## Working Agreements

1. **This instructions file is self-contained.** Everything you need is in this file.
2. **Your report is mandatory.** The rendered report file carries the full trail.
3. **User interaction is minimal.** Report tersely to the delegator.

## Goals

Capture all test helper and unit test conventions in `@noodlestan/conventions`.

## Changes

- Generate `@noodlestan/conventions-unit-tests` package draft in `$PROJECT/conventions/`.
- Structure conventions by topic.
- Use terse convention format for obvious rules.
- Use verbose convention format with Avoid/Prefer examples for detailed rules.

## Steps

### Step 1 / 3 — Create Conventions Package Structure

Create the directory structure:

- `$PROJECT/conventions/unit-tests/index.md`

If a conventions directory does not exist, create it at `$PROJECT/conventions/`.

### Step 2 / 3 — Document Conventions

Create `$PROJECT/conventions/unit-tests/index.md` with the following sections:

**Terse conventions** (use the format: `- **Name** – description`):

```markdown
- **Fixture Factory Naming** – Fixture factories use `make{Construct}Mock`.
- **Function Mock Naming** – Function mocks use `{functionName}Mock` with no `make` prefix.
- **Context Mock Naming** – Context mocks use `{contextName}Mock`.
- **Test Description Prefixes** – Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
- **Helper Grouping** – Group helpers by domain under `constructs/{ConstructName}/` or `primitives/`.
- **Cross-Package Mock Ownership** – Mocks for `@art-js/primitives` functions live in the `primitives` package.
- **Import Style Preference** – Prefer static imports over async imports in `vi.mock()` blocks when possible.
```

**Verbose conventions** (use the format with Avoid/Prefer examples):

````markdown
## Convention: Unit Tests / Block Spacing

**Summary:** Separate setup, invocation, and assertion blocks with empty lines.

**Avoid:**

```ts
const mock = makeTagMock();
const result = processTag(mock);
expect(result).toBe('test');
```
````

**Prefer:**

```ts
const mock = makeTagMock();

const result = processTag(mock);

expect(result).toBe('test');
```

````

Add another verbose convention for helper header comments:

```markdown
## Convention: Unit Tests / Helper Header Comments

**Summary:** Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

**Avoid:**

```ts
export const extractTagsMock = vi.fn();
````

**Prefer:**

```ts
/** @mocks extractTags */
export const extractTagsMock = vi.fn();
```

```

### Step 3 / 3 — Commit

#### Commit: `write-test-conventions`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```

conventions(art-js): Add unit test conventions

- Document helper grouping, naming, and commenting conventions
- Document test description and formatting conventions

```

## Final Verification

- Verify the conventions file exists and is well-structured.
- Verify all conventions from previous iterations are captured.
- Run `npm run ci` or equivalent to ensure lint is clean.
- Report according to the "How to Report Back to the Delegator" instructions.
```
