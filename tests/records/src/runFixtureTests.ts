import { access, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { RUN_TEST_FILENAME } from './fixtures.js';
import type { FixtureTestOutcome, FixtureTestReport, RunTest } from './types.js';

export interface RunFixtureTestsOptions {
	readonly fixturesDir: string;
	readonly filter?: string;
}

function makeOutcome(
	caseName: string,
	startedAt: number,
	status: 'PASS' | 'FAIL',
	error?: string,
): FixtureTestOutcome {
	return { caseName, status, durationMs: Date.now() - startedAt, error };
}

async function discoverFixtureCases(fixturesDir: string): Promise<string[]> {
	const entries = await readdir(fixturesDir, { withFileTypes: true });
	return entries
		.filter(entry => entry.isDirectory())
		.map(entry => join(fixturesDir, entry.name))
		.sort();
}

async function runFixtureCase(caseDir: string): Promise<FixtureTestOutcome> {
	const caseName = basename(caseDir);
	const startedAt = Date.now();
	const testFile = join(caseDir, RUN_TEST_FILENAME);

	const present = await access(testFile).then(
		() => true,
		() => false,
	);
	if (!present) return makeOutcome(caseName, startedAt, 'FAIL', `Missing ${RUN_TEST_FILENAME}`);

	try {
		const module: Record<string, unknown> = await import(pathToFileURL(testFile).href);
		// eslint-disable-next-line dot-notation
		const runTest = module['runTest'];
		if (typeof runTest !== 'function') {
			return makeOutcome(caseName, startedAt, 'FAIL', `Missing runTest export`);
		}
		await (runTest as RunTest)();
		return makeOutcome(caseName, startedAt, 'PASS');
	} catch (error) {
		return makeOutcome(
			caseName,
			startedAt,
			'FAIL',
			error instanceof Error ? error.message : String(error),
		);
	}
}

// Discovery follows the fixture directories, not a fixture file list: each case
// is a directory carrying its record files and its own `run-test.ts`.
export async function runFixtureTests(options: RunFixtureTestsOptions): Promise<FixtureTestReport> {
	const startedAt = Date.now();
	const discoveredCases = await discoverFixtureCases(options.fixturesDir);

	// Same rule as the art-md fixture tests: a case prefixed with `_` is a known
	// failure, so it is reported as skipped and never imported.
	const skippedCases = discoveredCases
		.filter(caseDir => basename(caseDir).startsWith('_'))
		.map(caseDir => basename(caseDir));
	const runnableCases = discoveredCases.filter(caseDir => !basename(caseDir).startsWith('_'));

	const selectedCases =
		options.filter === undefined
			? runnableCases
			: runnableCases.filter(caseDir => basename(caseDir).includes(options.filter as string));

	// Sequential for now; running N cases in parallel comes later.
	const outcomes: FixtureTestOutcome[] = [];
	for (const caseDir of selectedCases) {
		outcomes.push(await runFixtureCase(caseDir));
	}

	return {
		discovered: discoveredCases.length,
		skippedCases,
		tested: outcomes.length,
		passed: outcomes.filter(outcome => outcome.status === 'PASS').length,
		failed: outcomes.filter(outcome => outcome.status === 'FAIL').length,
		totalTimeMs: Date.now() - startedAt,
		outcomes,
	};
}
