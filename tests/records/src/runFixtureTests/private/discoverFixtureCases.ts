import type { Dirent } from 'node:fs';
import { access, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { RUN_TEST_FILENAME } from '../../constants.js';

// A case directory without `run-test.ts` belongs to the Vitest suite, so the
// script runner leaves it alone.
export async function discoverFixtureCases(fixturesDirectory: string): Promise<string[]> {
	const entries = await readdir(fixturesDirectory, { withFileTypes: true });

	function isDirectory(entry: Dirent): boolean {
		return entry.isDirectory();
	}

	function getDirectoryPath(entry: Dirent): string {
		return join(fixturesDirectory, entry.name);
	}

	async function hasRunTestFile(caseDirectory: string): Promise<boolean> {
		return await access(join(caseDirectory, RUN_TEST_FILENAME)).then(
			() => true,
			() => false,
		);
	}

	const caseDirectories = entries.filter(isDirectory).map(getDirectoryPath).sort();

	const discoveredCases: string[] = [];
	for (const caseDirectory of caseDirectories) {
		const runnable = await hasRunTestFile(caseDirectory);
		if (runnable) {
			discoveredCases.push(caseDirectory);
		}
	}
	return discoveredCases;
}
