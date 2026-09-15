import type { ContainerConstructBase } from '../../../constructs';

export const makeDocument = (options?: {
	children?: ContainerConstructBase[];
}): ContainerConstructBase => ({
	construct: 'Document',
	children: options?.children ?? [],
});
