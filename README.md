# Artificial

> Generate and manage (Art)ificial Driven Development environments.

A collection of tools and resources to generate and manage agent instructions. Includes the Art Language, and a (reactive) pipeline for bundling, compiling, validating, parsing, and locating resources.

## Packages

| namespace | dir                | package              | description                            |
| --------- | ------------------ | -------------------- | -------------------------------------- |
| `@art-js` | `spec/`            | `@art-js/spec`       | Art Language specification             |
| `@art-js` | `libs/primitives/` | `@art-js/primitives` | Foundational types and utilities       |
| `@art-js` | `libs/parser/`     | `@art-js/parser`     | Parses context files and art modules   |
| `@art-js` | `libs/validator/`  | `@art-js/validator`  | Validates parsed modules               |
| `@art-js` | `libs/bundler/`    | `@art-js/bundler`    | Bundles Art modules                    |
| `@art-js` | `libs/program/`    | `@art-js/program`    | Executes parsed Art modules            |
| `@art-js` | `cli/bin/`         | `@art-js/bin`        | CLI for pipeline commands              |
| `@art-js` | `cli/dev-server/`  | `@art-js/dev-server` | Local dev server for Art modules       |
| `@art-js` | `cli/watcher/`     | `@art-js/watcher`    | Watches for changes, triggers rebuilds |
| `@art-js` | `cli/poc-parse/`   | `@art-js/poc-parse`  | POC parser spike                       |

## Scripts

- **$** `npm run build` — Bundle all packages for production.
- **$** `npm run lint` — Lint all packages.
- **$** `npm run ci` — Full CI pass (lint + build + test).

## Setup

- **Serve a micro app** — each app under `artisans/apps/` is vanilla HTML/CSS/JS with a single `serve` script.
- **Scaffold by cloning practices in neighbours** — when adding a new package of **app** type, its `package.json` is very different from the lib/cli packages.

## License

MIT License

Copyright (c) 2026 Noodlestan https://noodlestan.org/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
