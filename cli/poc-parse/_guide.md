# POC Parse

The `@art-js/poc-parse` package is a POC spike of the artificials parser: a self-contained, CLI-executable package.

## Recommended Reading

Agents SHOULD scan these files for definitions and resource locations when faced with uncertainty or ambiguity that may result from missing resources.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `_pseudo.md` — pseudo code for context-aware visiting.
- `README.md` — package readme.

## Package Layout

```
_guide.md           — this file
_pseudo.md          — pseudo code for context-aware visiting
_records/           — package records
fixtures/           — test fixtures
scripts/            — test scripts
src/                — source code
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`

## Knowledge References

This package does not maintain a dedicated architecture reference.

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
```

### Operating Instructions: Verifying Completion

**Instructions:**

Run from this package directory:

```bash
npm run ci # lint and test
```
