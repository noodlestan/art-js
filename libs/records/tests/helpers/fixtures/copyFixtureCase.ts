import { cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

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
