import type { ArtRecord } from '@art-js/records';

export function findRecordByName(
	records: readonly ArtRecord[],
	expectedName: string,
): ArtRecord | undefined {
	function hasExpectedName(record: ArtRecord): boolean {
		return record.name === expectedName;
	}
	return records.find(hasExpectedName);
}
