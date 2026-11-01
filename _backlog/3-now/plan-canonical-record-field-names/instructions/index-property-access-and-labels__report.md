# Sub-Agent REPORT (#producer)

**Plan:** `canonical-record-field-names`

**Iteration Id:** `index-property-access-and-labels`

**Outcome:** `BLOCKER`

## Evidence

### Changes

Anchored on the iteration Goals (build the `name → field` index once at extraction and route every proxy trap through it): **no changes were made**. Execution stopped during instruction validation, before Step 1, because Step 6 and the Final Verification impose two mutually exclusive requirements (detailed under Blockers). Setup (`npm ci`) and verification commands were not run because no code work began.

#### Files changed

None. No files were created, modified, or deleted; no commits were made; nothing was pushed (commit policy is `NOPUSH`).

Environment notes — pre-existing repository state observed on arrival, not touched by this worker and not attributable to it:

- `$PROJECT/_roadmap/3-now/milestone-art-records/milestone.md` — already modified.
- `$PROJECT/_backlog/3-now/plan-adopt-codec-construct-api/` — already untracked.

Completed before stopping:

- Agent boot sequence and the agent-worker mandatory reading (`executing-work` workflow, engineering guide, worker mode record, plans definitions).
- The instruction's mandatory reading: Conventions: TypeScript, Conventions: Unit Tests, `../plan__pseudo.md`, `../plan__tests.md`, `$PACKAGE/knowledge/design/records.md`, `$PACKAGE/_guide.md`, `$PROJECT/_guide.md`.
- Source and test survey: `$PACKAGE/src/record/private/` (capsule, proxy, field helpers, converters), `$PACKAGE/tests/fixtures/`, `$PACKAGE/tests/record-helpers/`, `$PROJECT/tests/records/fixtures/01`–`07`.

## Blockers (if any)

### Contradiction: fixture `09-section-depth` must stay unmodified, yet cannot pass under the mandated label-generation rule

The instruction simultaneously requires:

1. **Green suites** — Goals: "`$PACKAGE` and `$PROJECT` are green at `refactor(records): Resolve record fields through a name index.`"; Step 6 Expected outcome: "every suite green ... `npm run test` from `$PACKAGE`, then `npm run ci` from `$PROJECT`".
2. **Fixture 09 untouched** — Step 6: "`03-read-assert-extract` and `09-section-depth` were audited and do **not** change."; Final Verification: "Verify fixtures `03-read-assert-extract` and `09-section-depth` were not modified (`git diff --stat`)."

Both cannot hold. Step 2 mandates that a `set` on an index miss "appends a `FieldInline` labelled `nameToLabel(name)` (so `brandNew` yields `**Brand New:**`)", and fixture 09 performs exactly such a canonical-miss write while asserting the old raw-name label:

- `$PACKAGE/tests/fixtures/09-section-depth/integration.test.ts` line 88: `artist['owner'] = 'foo';`
- `$PACKAGE/tests/fixtures/09-section-depth/integration.test.ts` line 106: `expect(content).toContain('**owner:** foo');`
- `$PACKAGE/tests/fixtures/09-section-depth/_records/artist.art` contains only `**Born:**` and `**Years active:**` — no `owner` field — so the write is an index miss that appends a new field.
- `nameToLabel('owner')` is `'Owner'`: the converter always capitalises the first word (`../plan__pseudo.md` section 3, `a333` → `A333`), pinned by the landed fixture table `tests/record-helpers/nameToLabel.fixtures.ts` (`['id', 'Id']`).

Under the new behaviour the document will contain `**Owner:** foo`, so the untouched fixture 09 fails `npm run test` (`vitest run` includes `tests/fixtures/09-section-depth`), which also fails the `pre-commit` hook's `npm run ci`. The Step 6 audit missed this second-order effect: fixture 09 does not access fields _by label_, but its persisted-content assertion pins the _generated label_ of a canonical-miss write.

Execution stopped per the agent-worker contract (instruction contradiction / change outside declared scope → STOP and REPORT BLOCKER). As a worker I must not choose which verification criterion to sacrifice, and must not modify a file the instruction explicitly declares out of scope.

### Recommended resolution

- **Option A (recommended):** move `09-section-depth` into the Step 6 modify list, change its line-106 assertion to `**Owner:** foo`, and amend the Final Verification line to protect only `03-read-assert-extract`. `03-read-assert-extract` genuinely needs no change: its only field-name assertion is `getFieldNames(...)` equal to `[]` on the field-less `Module` record.
- **Option B:** keep fixture 09's structural assertions but drop or relax the persisted-label case — this still requires the same amendment to the "do not change" rule.
- **Option C:** append canonical-miss fields with the raw supplied name instead of `nameToLabel(name)` — contradicts the Step 2 specification and the already-landed `nameToLabel` module; not recommended.

### Additional observation (non-blocking)

`$PACKAGE/knowledge/design/records.md` still documents the exact-label behaviour this iteration replaces ("A field property such as `record.owner` resolves by exact field name"); the instruction reads it as design context but schedules no update. If no later iteration owns the design-doc refresh, it will ship stale.

No other contradictions were found in the files read for this iteration: the 10 other listed in-package fixtures, the six `$PROJECT/tests/records` cases (`01`–`06`), and Steps 1–5 are internally consistent with the index design.
