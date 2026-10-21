import type { ArtRecord } from '@art-js/records';

const reservedRecordKeys = new Set(['name', '__section', 'renameField', 'save']);

export function getFieldNames(record: ArtRecord): string[] {
	function isRecordFieldName(key: string): boolean {
		return !reservedRecordKeys.has(key) && !key.startsWith('__');
	}
	const recordKeys = Object.keys(record);
	return recordKeys.filter(isRecordFieldName);
}
