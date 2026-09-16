import type { ConstructBase } from '../../../constructs';

export const makeDocumentMock = <T extends ConstructBase = never>(options?: {
	children?: T[];
}): {
	construct: 'Document';
	children: T[];
} => ({
	construct: 'Document',
	children: (options?.children ?? []) as T[],
});
