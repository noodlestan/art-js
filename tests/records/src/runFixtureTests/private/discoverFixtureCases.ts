import type { Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function discoverFixtureCases(fixturesDirectory: string): Promise<string[]> {
	const entries = await readdir(fixturesDirectory, { withFileTypes: true });

	function isDirectory(entry: Dirent): boolean {
		return entry.isDirectory();
	}

	function getDirectoryPath(entry: Dirent): string {
		return join(fixturesDirectory, entry.name);
	}

	const directories = entries.filter(isDirectory);
	const caseDirectories = directories.map(getDirectoryPath);
	return caseDirectories.sort();
}
