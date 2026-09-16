import type { ConstructBase } from '../../../types';

export const makeDocumentMock = <T extends ConstructBase = never>(options?: {
	children?: T[];
}): {
	construct: 'Document';
	children: T[];
} => ({
	construct: 'Document',
	children: (options?.children ?? []) as T[],
});
