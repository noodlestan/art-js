import type { ArtRecord } from '../../../src/index.js';

export function findRecordByName(
	records: readonly ArtRecord[],
	expectedName: string,
): ArtRecord | undefined {
	function hasExpectedName(record: ArtRecord): boolean {
		return record.name === expectedName;
	}
	return records.find(hasExpectedName);
}
