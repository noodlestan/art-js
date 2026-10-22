import type { SectionBlock } from '@art-md/constructs';
import type { ArtDocument, ArtDocumentSource } from '@art-md/primitives';

export type SectionContainer = ArtDocument | SectionBlock;

export type SectionContainerMatch = {
	readonly container: SectionContainer;
	readonly index: number;
};

export type AnchorLocation = SectionContainerMatch & {
	readonly section: SectionBlock;
};

export type SectionPlacement = {
	readonly container: SectionContainer;
	readonly index: number;
	readonly depth: number;
};

export type RecordsCollectionContext = {
	readonly document: ArtDocument;
	readonly source: ArtDocumentSource;
	readonly save: () => Promise<void>;
};
