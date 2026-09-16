# Unit Test Conventions

## Terse Conventions

- **Fixture Factory Naming** – Fixture factories use `make{Construct}Mock`.
- **Function Mock Naming** – Function mocks use `{functionName}Mock` with no `make` prefix.
- **Context Mock Naming** – Context mocks use `{contextName}Mock`.
- **Test Description Prefixes** – Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
- **Helper Grouping** – Group helpers by domain under `constructs/{ConstructName}/` or `primitives/`.
- **Cross-Package Mock Ownership** – Mocks for `@art-js/primitives` functions live in the `primitives` package.
- **Import Style Preference** – Prefer static imports over async imports in `vi.mock()` blocks when possible.

## Verbose Conventions

### Convention: Unit Tests / Block Spacing

**Summary:** Separate setup, invocation, and assertion blocks with empty lines.

**Avoid:**

```ts
const mock = makeTagMock();
const result = processTag(mock);
expect(result).toBe('test');
```

**Prefer:**

```ts
const mock = makeTagMock();

const result = processTag(mock);

expect(result).toBe('test');
```

### Convention: Unit Tests / Helper Header Comments

**Summary:** Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

**Avoid:**

```ts
export const extractTagsMock = vi.fn();
```

**Prefer:**

```ts
/** @mocks extractTags */
export const extractTagsMock = vi.fn();
```
