export const makeDocument = (options?: {
	children?: unknown[];
}): {
	construct: 'Document';
	children: unknown[];
} => ({
	construct: 'Document',
	children: options?.children ?? [],
});
