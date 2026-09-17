import type { ConstructBase, Document } from '../../../types';

export const makeDocumentMock = <T extends ConstructBase = never>(options?: {
	children?: T[];
}): Document<T> => ({
	construct: 'Document',
	children: (options?.children ?? []) as T[],
});
