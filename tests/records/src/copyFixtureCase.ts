import { cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

// Copy a case before it runs so fixture files stay unchanged. Cases migrated to
// Vitest pass their own temporary directory and clean it up on teardown.
export async function copyFixtureCase(
	caseDirectory: string,
	temporaryDirectory?: string,
): Promise<string> {
	if (temporaryDirectory !== undefined) {
		await cp(caseDirectory, temporaryDirectory, { recursive: true });
		return temporaryDirectory;
	}

	const createdDirectory = await mkdtemp(join(tmpdir(), `art-records-${basename(caseDirectory)}-`));
	await cp(caseDirectory, createdDirectory, { recursive: true });
	return createdDirectory;
}
