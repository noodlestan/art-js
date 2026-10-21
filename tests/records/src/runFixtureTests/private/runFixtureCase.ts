import { access } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { RUN_TEST_FILENAME } from '../../constants.js';
import type { FixtureTestOutcome, RunTest } from '../../types.js';

import { createFixtureOutcome } from './createFixtureOutcome.js';

export async function runFixtureCase(caseDirectory: string): Promise<FixtureTestOutcome> {
	const caseName = basename(caseDirectory);
	const startedAt = Date.now();
	const testFile = join(caseDirectory, RUN_TEST_FILENAME);

	function isFileAccessible(): boolean {
		return true;
	}

	function isFileInaccessible(): boolean {
		return false;
	}

	const filePresent = await access(testFile).then(isFileAccessible, isFileInaccessible);
	if (!filePresent) {
		return createFixtureOutcome(caseName, startedAt, 'FAIL', `Missing ${RUN_TEST_FILENAME}`);
	}

	try {
		const moduleAddress = pathToFileURL(testFile).href;
		const testModule: Record<string, unknown> = await import(moduleAddress);
		// eslint-disable-next-line dot-notation
		const runTestExport = testModule['runTest'];

		if (typeof runTestExport !== 'function') {
			return createFixtureOutcome(caseName, startedAt, 'FAIL', 'Missing runTest export');
		}
		await (runTestExport as RunTest)();

		return createFixtureOutcome(caseName, startedAt, 'PASS');
	} catch (error) {
		let errorMessage: string;
		if (error instanceof Error) {
			errorMessage = error.message;
		} else {
			errorMessage = String(error);
		}

		return createFixtureOutcome(caseName, startedAt, 'FAIL', errorMessage);
	}
}
