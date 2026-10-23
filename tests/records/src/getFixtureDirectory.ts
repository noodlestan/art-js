import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve a fixture case directory relative to its test module.
export function getFixtureDirectory(moduleAddress: string): string {
	return dirname(fileURLToPath(moduleAddress));
}
