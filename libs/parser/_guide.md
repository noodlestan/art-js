# Parser

The `@art-js/parser` package parses context files and art modules into structured representations.

## Recommended Reading

Agents SHOULD scan these files for definitions and resource locations when faced with uncertainty or ambiguity that may result from missing resources.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `README.md` — package readme.
- `architecture/index.md` — package architecture reference.

## Package Layout

```
_records/           — package records
architecture/       — architecture reference
  index.md          — architecture document index
  api.md            — public API and config
  implementation.md — internal mechanics
scripts/            — test scripts
src/                — source code
test/               — tests
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

## Knowledge References

This package maintains an architecture reference at `architecture/index.md`:

- `architecture/api.md` — parser API: config shape, entry points, contract references.
- `architecture/implementation.md` — parser implementation: visit loop, context stack, dispatch.

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
npm run build # to produce a full build
```
