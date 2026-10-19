import { cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { FSRecordsPattern } from '@art-lib/fs-records';

// Every fixture case implements its use case in this file, next to the record
// files it exercises.
export const RUN_TEST_FILENAME = 'run-test.ts';

// The discovery pattern from the Records design: record files live under
// `_records/` and carry the `.art` extension.
export const RECORDS_PATTERNS: FSRecordsPattern[] = [
	{
		base: '.',
		pattern: '**/_records/**/*.art',
		ignored: ['node_modules/', '.git/', 'dist/'],
		excluded: [],
		gitignore: true,
	},
];

// Resolves the fixture case directory from the test module's own URL, so each
// test uses paths to its own fixture directory.
export function fixtureDirOf(moduleUrl: string): string {
	return dirname(fileURLToPath(moduleUrl));
}

// Copies the fixture case to a temporary working directory, so the committed
// fixture stays pristine and every run starts from the same state.
export async function copyFixtureCase(caseDir: string): Promise<string> {
	const workDir = await mkdtemp(join(tmpdir(), `art-records-${basename(caseDir)}-`));
	await cp(caseDir, workDir, { recursive: true });
	return workDir;
}
