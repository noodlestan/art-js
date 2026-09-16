# Sub-Agent REPORT (#producer)

**Plan:** `integrate-feedback-and-follow-ups`

**Iteration Id:** `tag-reference-spec`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                           | Outcome                                                                                                                                       | Status |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Introduce the TagReference spec file           | Created `spec/grammar/constructs/expressions/tag-reference.art` defining the `TagReference` construct.                                        | Done   |
| Clean up the Tag spec                          | Removed projections prose from the Tag Description, fixed the tagged-definitions syntax reference, and removed the trailing WIP HTML comment. | Done   |
| Fix the VocabularyDeclaration syntax reference | Updated the tagged-definitions syntax to reference `<VocabularyDeclaration> <Tags>`.                                                          | Done   |

#### Files changed

- `spec/grammar/constructs/expressions/tag-reference.art` — New. Defines the `TagReference` construct: category, purpose, description, syntax, rules, and examples.
- `spec/grammar/constructs/expressions/tag.art` — Edited. Simplified the Description to focus on tag attachment and metadata, corrected the tagged-definitions syntax reference to `<VocabularyDeclaration> <Tags>`, and removed the trailing WIP HTML comment about TagReference.

**Commit status:** Commit `tag-reference-spec` has policy `MANUAL` — the user executes the commit themselves. No commit was executed and nothing was pushed. The changes above are left uncommitted in the `$PROJECT` working tree for the user to commit.

**Note:** The Tag rules section still contains one "per projection" clause (rule line): "A Tag determines the inclusion, exclusion, or transformation of the tagged declaration's content per projection." It was left in place because the instruction scoped the projections cleanup to the Description (lines 13-14) only.

## Blockers (if any)

None.
