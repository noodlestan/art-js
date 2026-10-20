import type { SectionBlock } from '@art-md/constructs';
import type {
	ArtCodec,
	ArtContentSource,
	ArtDocument,
	ArtDocumentSource,
} from '@art-md/primitives';

export type ArtRecord = {
	name: string;
	__section: SectionBlock;
	renameField(oldName: string, newName: string): void;
	save(): Promise<void>;
	[fieldName: string]: unknown;
};

export type CreateArtRecordOptions = {
	codec: ArtCodec;
	contentSource: ArtContentSource;
};

export type RecordContext = {
	readonly section: SectionBlock;
	readonly source: ArtDocumentSource;
	readonly document?: ArtDocument;
	readonly save: () => Promise<void>;
};
