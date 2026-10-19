// Entry point: discover every fixture test case, run it, report, and set the
// exit code. Usage: `npx tsx scripts/test-records.ts [case-name-filter]`
import { resolve } from 'node:path';

import { printFixtureTestReport, runFixtureTests } from '../src/index.js';

const packageDir = resolve(import.meta.dirname, '..');
const filter = process.argv[2];

const report = await runFixtureTests({ fixturesDir: resolve(packageDir, 'fixtures'), filter });
printFixtureTestReport(report);

process.exit(report.failed === 0 ? 0 : 2);
