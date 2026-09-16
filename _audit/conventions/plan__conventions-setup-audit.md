# Setup Audit Report

**Plan:** `audit-conventions-adoption`

**Iteration Id:** `audit-conventions-setup`

## Setup Report

| Check                                                                   | Status | Issue                                                                               |
| ----------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| Package `@noodlestan/conventions-typescript` declared in `package.json` | PASS   | Installed at `node_modules/@noodlestan/conventions-typescript/`                     |
| Root `_guide.md` contains `## Conventions` section                      | PASS   | References `./node_modules/@noodlestan/conventions-typescript/art/typescript.md`    |
| Root `_guide.md` conventions section has explanatory prose              | PASS   | Contains instructions on how to read and apply conventions                          |
| Convention source file does not resolve                                 | FAIL   | `node_modules/@noodlestan/conventions-typescript/art/typescript.md` is not readable |
| Package `libs/primitives/_guide.md` contains `## Conventions` section   | PASS   | References `../../_guide.md`                                                        |
| Package `libs/constructs/_guide.md` contains `## Conventions` section   | PASS   | References `../../_guide.md`                                                        |
| Package `libs/parser/_guide.md` contains `## Conventions` section       | PASS   | References `../../_guide.md`                                                        |
| Package `libs/serializer/_guide.md` contains `## Conventions` section   | PASS   | References `../../_guide.md`                                                        |

## Findings

- `node_modules/@noodlestan/conventions-typescript/art/typescript.md` is not readable -update `_guide.md` to reference `.../art/index.md` instead.

## Prescribed Fixes

None.
