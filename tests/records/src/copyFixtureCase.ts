import { cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

// Copy a case before it runs so fixture files stay unchanged.
export async function copyFixtureCase(caseDirectory: string): Promise<string> {
	const temporaryDir = await mkdtemp(join(tmpdir(), `art-records-${basename(caseDirectory)}-`));
	await cp(caseDirectory, temporaryDir, { recursive: true });
	return temporaryDir;
}
