import type { FSRecordFile } from '@art-lib/fs-records';

export function findRecordFileByPath(
	files: readonly FSRecordFile[],
	expectedPath: string,
): FSRecordFile | undefined {
	function hasExpectedPath(file: FSRecordFile): boolean {
		return file.path === expectedPath;
	}
	return files.find(hasExpectedPath);
}
