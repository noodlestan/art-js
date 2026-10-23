export function findRecordFileByPath<File extends { path: string }>(
	files: readonly File[],
	expectedPath: string,
): File | undefined {
	function hasExpectedPath(file: File): boolean {
		return file.path === expectedPath;
	}
	return files.find(hasExpectedPath);
}
