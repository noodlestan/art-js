import type { ConstructBase, ContainerConstructBase } from '../constructs';

/** Document — Container construct representing a document root */
export type ArtDocument = ContainerConstructBase & {
	construct: 'Document';
};

export type ArtDocumentFactoryData = {
	children: ConstructBase[];
};
