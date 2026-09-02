# Pipeline Test CLI

The `@art-js/pipeline-test-cli` package provides test scripts for the parser and serializer pipeline.

## Recommended Reading

Agents SHOULD scan these files for definitions and resource locations when faced with uncertainty or ambiguity that may result from missing resources.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `README.md` — package readme.

## Package Layout

```
_records/           — package records
src/                — source code
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

## Knowledge References

This package does not maintain a dedicated architecture reference.

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Running Tests

**Instructions:**

```bash
npm run test           # runs test-parser and test-serializer against stable fixtures
npm run test-parser    # test all fixtures against snapshots
npm run test-serializer # test all numbered fixtures
```
