import { basename } from 'node:path';

import type { FixtureTestOutcome, FixtureTestReport, RunFixtureTestsOptions } from '../types.js';

import { discoverFixtureCases } from './private/discoverFixtureCases.js';
import { runFixtureCase } from './private/runFixtureCase.js';

// Discovery follows the fixture directories, not a fixture file list: each case
// is a directory carrying its record files and its own `run-test.ts`.
export async function runFixtureTests(options: RunFixtureTestsOptions): Promise<FixtureTestReport> {
	const startedAt = Date.now();
	const discoveredCases = await discoverFixtureCases(options.fixturesDirectory);

	function isSkippedCase(caseDirectory: string): boolean {
		return basename(caseDirectory).startsWith('_');
	}

	function getCaseName(caseDirectory: string): string {
		return basename(caseDirectory);
	}

	function isRunnableCase(caseDirectory: string): boolean {
		return !isSkippedCase(caseDirectory);
	}

	// Same rule as the art-md fixture tests: a case prefixed with `_` is a known
	// failure, so it is reported as skipped and never imported.
	const skippedDirectories = discoveredCases.filter(isSkippedCase);
	const skippedCases = skippedDirectories.map(getCaseName);
	const runnableCases = discoveredCases.filter(isRunnableCase);

	function isMatchingFilter(caseDirectory: string): boolean {
		const filter = options.filter;
		if (filter === undefined) {
			return false;
		}
		return basename(caseDirectory).includes(filter);
	}

	let selectedCases = runnableCases;
	if (options.filter !== undefined) {
		selectedCases = runnableCases.filter(isMatchingFilter);
	}

	// Sequential for now; running N cases in parallel comes later.
	const outcomes: FixtureTestOutcome[] = [];
	for (const caseDirectory of selectedCases) {
		outcomes.push(await runFixtureCase(caseDirectory));
	}

	function isPassed(outcome: FixtureTestOutcome): boolean {
		return outcome.status === 'PASS';
	}

	function isFailed(outcome: FixtureTestOutcome): boolean {
		return outcome.status === 'FAIL';
	}

	const passedOutcomes = outcomes.filter(isPassed);
	const failedOutcomes = outcomes.filter(isFailed);
	const passed = passedOutcomes.length;
	const failed = failedOutcomes.length;
	const totalTimeMs = Date.now() - startedAt;

	return {
		discovered: discoveredCases.length,
		skippedCases,
		tested: outcomes.length,
		passed,
		failed,
		totalTimeMs,
		outcomes,
	};
}
