# Art JS

> Enable Art files to be authored as programs, with validation, language tooling, and automated projection to target formats.

Libraries and tools for working with [Art MD](https://github.com/noodlestan/art-md) as a programming language, including records, resources, modules, programs, program builders, validators, projectors, language services, and related tooling.

**Keywords:** art, markdown, ast.

## Packages

| namespace | dir                    | package                   | description                                                      |
| --------- | ---------------------- | ------------------------- | ---------------------------------------------------------------- |
| `@art-js` | `libs/bundler/`        | `@art-js/bundler`         | Bundles Art modules                                              |
| `@art-js` | `libs/program/`        | `@art-js/program`         | Executes parsed Art modules                                      |
| `@art-js` | `libs/validator/`      | `@art-js/validator`       | Validates parsed modules                                         |
| `@art-js` | `libs/records/`        | `@art-js/records`         | Record identity, discovery, extraction, update and serialisation |
| `@art-js` | `cli/bin/`             | `@art-js/bin`             | CLI for pipeline commands                                        |
| `@art-js` | `cli/dev-server/`      | `@art-js/dev-server`      | Local dev server for Art modules                                 |
| `@art-js` | `cli/language-server/` | `@art-js/language-server` | Language server for Art modules                                  |
| `@art-js` | `cli/tools/`           | `@art-js/tools`           | Tools for Art modules                                            |
| `@art-js` | `cli/watcher/`         | `@art-js/watcher`         | Watches for changes, triggers rebuilds                           |

## Development

### Scripts

- **$** `npm run turbo build` — Build all packages.
- **$** `npm run turbo test` — Run tests in all packages.
- **$** `npm run turbo lint` — Lint all packages (Prettier + ESLint).
- **$** `npm run ci` — Run all CI scripts in all packages.

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
