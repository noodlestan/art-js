import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getFixtureDirectory(moduleAddress: string): string {
	return dirname(fileURLToPath(moduleAddress));
}
