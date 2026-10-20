import type { ArtDocument, ArtDocumentSource } from '@art-md/primitives';

export type RecordsDocumentContext = {
	readonly document: ArtDocument;
	readonly source: ArtDocumentSource;
	readonly save: () => Promise<void>;
};
